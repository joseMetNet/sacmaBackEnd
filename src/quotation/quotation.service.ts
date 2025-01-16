import { QuotationRepository } from "./quotation.repository";
import * as dtos from "./quotation.interfase";
import { StatusCode } from "../interfaces";
import { Input } from "../input/input.model";
import { CustomError, formatDate, getNextMonth } from "../utils";
import { ResponseEntity } from "../services/interface";
import { BuildResponse } from "../services";
import { dbConnection } from "../config";
import { Quotation } from "./quotation.model";
import { QuotationPercentage } from "./quotation-percentage.model";
import sequelize from "sequelize";
import { QuotationComment } from "./quotation-comment.model";
import { QuotationItemDetail } from "./quotation-item-detail.model";
import { QuotationItem } from "./quotation-item.model";
import { readFileSync } from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export class QuotationService {

  private readonly quotationRepository: QuotationRepository;

  constructor(quotationRepository: QuotationRepository) {
    this.quotationRepository = quotationRepository;
  }

  createQuotation = async (quotationData: dtos.CreateQuotationDTO): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      quotationData = {
        ...quotationData,
        idQuotationStatus: 1,
        builder: quotationData.builder ?? quotationData.client,
      };
      const quotation = await this.quotationRepository.create(quotationData, transaction);
      const consecutive = `COT SACIPR No. ${quotation.idQuotation}-${new Date().getFullYear()}`;
      quotation.consecutive = consecutive;
      await quotation.save({ transaction });

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotation);
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error creating quotation:", err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation", error: err.message });
    }
  };

  private buildEmptyQuotationReport = () => {
    return {
      quotationSummary: {
        unitValueAIU: "0",
        administration: "0",
        unforeseen: "0",
        utility: "0",
        vat: "0",
        unitValueAIUIncluded: "0",
        totalValue: "0"
      },
      quotationAdditionalCost: {
        perDiem: "0",
        sisoValue: "0",
        tax: "0",
        commision: "0",
        pettyCash: "0",
        policy: "0",
        utility: "0",
        directCost: "0",
      },
      summaryByItem: []
    };
  };

  findQuotationById = async (id: number): Promise<ResponseEntity> => {
    try {

      const quotation = await this.quotationRepository.findById(id);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }

      let quotationReport = await this.buildQuotationReport(quotation);
      if (quotationReport instanceof CustomError) {
        quotationReport = this.buildEmptyQuotationReport();
      }

      const jsonQuotation = quotation.toJSON();
      const responsable = jsonQuotation.Employee.User.firstName
        + " " + jsonQuotation.Employee.User.lastName;
      const data = {
        idQuotation: quotation.idQuotation,
        name: quotation.name,
        client: quotation.client,
        responsable,
        consecutive: quotation.consecutive,
        QuotationPercentage: jsonQuotation.QuotationPercentage,
        QuotationAdditionalCost: jsonQuotation.QuotationAdditionalCost,
        QuotationStatus: jsonQuotation.QuotationStatus,
        builder: quotation.builder,
        builderAddress: quotation.builderAddress,
        projectName: quotation.projectName,
        itemSummary: quotation.itemSummary,
        totalCost: quotation.totalCost,
        QuotationComments: jsonQuotation.QuotationComments,
        QuotationReport: quotationReport.quotationSummary,
        QuotationAdditionalCostReport: quotationReport.quotationAdditionalCost,
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get quotation" });
    }
  };

  generateQuotationDocx = async (id: number): Promise<ResponseEntity | Buffer> => {
    try {
      const quotationResponse = await this.findQuotationById(id);
      const quotationItemsResponse = await this.findAllQuotationItems({ idQuotation: id, page: 1, pageSize: 100 });
      const templatePath = "template/cotizacion.docx";
      const content = readFileSync(templatePath, "binary");
      if (quotationResponse.code !== 200 && quotationResponse) {
        return quotationResponse;
      }

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });
      const quotation = quotationResponse as ResponseEntity;
      const quotationItems = quotationItemsResponse as ResponseEntity;
      const additionalRepport = quotation.data ? (quotation.data as any).QuotationReport : {};
      // concat all item names 
      const itemNames = (quotationItems.data as any).data
        .map((item: QuotationItem) => item.item)
        .join(", ");

      const quotationItemsData = (quotationItems.data as any).data;
      quotationItemsData.forEach((item: QuotationItem) => {
        item.unitPrice = parseFloat(item.unitPrice).toFixed(2);
        item.total = parseFloat(item.total).toFixed(2);
      });
      const technicalSpecifications = (quotationItems.data as any).data
        .map((item: QuotationItem) => item.technicalSpecification)
        .join(", ");

      const currencyFormatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      });

      const itemResponse = (quotationItems.data as any).data
        .map((item: QuotationItem) => { 
          item.unitPrice = currencyFormatter.format(parseFloat(item.unitPrice)); 
          item.total = currencyFormatter.format(parseFloat(item.total));
          item.quantity = String(parseInt(item.quantity));
          return item; 
        });

      const response = {
        items: itemResponse,
        name: (quotation.data as any)?.name ?? "",
        itemNames,
        technicalSpecifications,
        date: formatDate(new Date().toISOString().split("T")[0]),
        dateUntil: formatDate(getNextMonth(new Date().toISOString().split("T")[0])),
        consecutive: (quotation.data as any)?.consecutive ?? "",
        referencia: "Impermeabilización Aleros",
        project: (quotation.data as any)?.projectName ?? "",
        unitValueAIU: currencyFormatter.format(additionalRepport.unitValueAIU),
        administration: currencyFormatter.format(additionalRepport.administration),
        unforeseen: currencyFormatter.format(additionalRepport.unforeseen),
        utility: currencyFormatter.format(additionalRepport.utility),
        vat: currencyFormatter.format(additionalRepport.vat),
        unitValueAIUIncluded: currencyFormatter.format(additionalRepport.unitValueAIUIncluded),
        totalValue: currencyFormatter.format(additionalRepport.totalValue),
      };

      doc.render(response);
      const buffer = doc.getZip().generate({ type: "nodebuffer" });
      return buffer;
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get quotation report" });
    }
  };

  findAllQuotations = async (request: dtos.findAllQuotationDTO): Promise<ResponseEntity> => {
    try {
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;
      const filter = this.buildQuotationFilter(request);
      const quotations = await this.quotationRepository.findAll(filter, limit, offset);
      const comments = await this.quotationRepository.findAllQuotationComment({}, -1, 0);

      const unitValueAIUPromise = quotations.rows.map(async (quotation: Quotation) => {
        const report = await this.buildQuotationReport(quotation);
        if (report instanceof CustomError) {
          return {
            quotationId: quotation.idQuotation,
            unitValueAIU: "0",
          };
        }
        return {
          quotationId: quotation.idQuotation,
          unitValueAIU: parseFloat(report.quotationSummary.unitValueAIUIncluded).toFixed(2),
        };
      });

      const unitValueAIU = await Promise.all(unitValueAIUPromise);
      
      const commentsMap = comments.rows.reduce((acc, comment) => {
        if (!acc[comment.idQuotation]) {
          acc[comment.idQuotation] = comment.comment;
        }
        return acc;
      }, {} as { [key: number]: string });

      const data = quotations.rows.map((quotation) => {
        let responsable: string | undefined;
        const jsonQuotation = quotation.toJSON();
        if (jsonQuotation.Employee) {
          responsable = jsonQuotation.Employee.User.firstName
            + " " + jsonQuotation.Employee.User.lastName;
        }
        return {
          idQuotation: quotation.idQuotation,
          name: quotation.name,
          responsable: responsable,
          consecutive: quotation.consecutive,
          total: unitValueAIU.find((item) => item.quotationId === quotation.idQuotation)?.unitValueAIU,
          idEmployee: jsonQuotation.Employee.idEmployee,
          comment: commentsMap[quotation.idQuotation] ?? "",
          QuotationStatus: jsonQuotation.QuotationStatus,
          builder: quotation.builder,
          builderAddress: quotation.builderAddress,
          projectName: quotation.projectName,
          itemSummary: quotation.itemSummary,
          totalCost: quotation.totalCost,
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
          client: quotation.client,
          executionTime: quotation.executionTime,
          policy: quotation.policy,
          technicalCondition: quotation.technicalCondition,
        };
      });

      const response = {
        data,
        totalItems: quotations.count,
        currentPage: page,
        totalPages: Math.ceil(quotations.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get quotations" });
    }
  };

  updateQuotation = async (quotationData: dtos.UpdateQuotationDTO): Promise<ResponseEntity> => {
    try {
      const quotation = await this.quotationRepository.findById(quotationData.idQuotation);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }
      const updatedQuotation = this.buildQuotation(quotation, quotationData);
      const response = await updatedQuotation.save();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  deleteQuotation = async (idQuotation: number): Promise<ResponseEntity> => {
    try {
      const deletedCount = await this.quotationRepository.delete(idQuotation);
      if (deletedCount > 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Quotation deleted successfully" });
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  createQuotationItem = async (quotationItemData: dtos.CreateQuotationItemDTO): Promise<ResponseEntity> => {
    try {
      const quotationItem = await this.quotationRepository.createQuotationItem(quotationItemData);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationItem);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  findQuotationItemById = async (idQuotationItem: number): Promise<ResponseEntity> => {
    try {
      const quotationItem = await this.quotationRepository.findQuotationItemById(idQuotationItem);
      if (quotationItem) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationItem);
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  findAllQuotationStatus = async (): Promise<ResponseEntity> => {
    try {
      const quotationStatus = await this.quotationRepository.findAllQuotationStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, quotationStatus);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get quotation status" });
    }
  };

  updateQuotationStatus = async (quotationStatusData: dtos.UpdateQuotationStatusDTO): Promise<ResponseEntity> => {
    try {
      const quotation = await this.quotationRepository.findById(quotationStatusData.idQuotation);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }
      quotation.idQuotationStatus = quotationStatusData.idQuotationStatus;
      const quotationDb = await quotation.save();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationDb);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to update quotation status" });
    }
  };

  findAllQuotationItems = async (request: dtos.findAllQuotationItemDTO): Promise<ResponseEntity> => {
    try {
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;
      const filter = this.buildQuotationItemFilter(request);
      const quotation = await this.quotationRepository.findById(request.idQuotation);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }

      const quotationItems = await this.quotationRepository.findAllQuotationItem(filter, limit, offset);
      const summary = await this.buildQuotationReport(quotation);

      if (summary instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: summary.message });
      }
      const summaryByItem = summary.summaryByItem;
      const rows = quotationItems.rows.map((item) => {
        const summaryItem = summaryByItem.find((summaryItem) => summaryItem.idQuotationItem === item.idQuotationItem);
        return {
          idQuotationItem: item.idQuotationItem,
          idQuotation: item.idQuotation,
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: item.quantity,
          unitPrice: summaryItem?.unitValue,
          total: summaryItem?.totalCost,
          Quotation: item.toJSON().Quotation ?? {},
        };
      });
      const response = {
        data: rows,
        totalItems: quotationItems.count,
        currentPage: page,
        totalPages: Math.ceil(quotationItems.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  updateQuotationItem = async (quotationItemData: dtos.UpdateQuotationItemDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.quotationRepository.findQuotationItemById(quotationItemData.idQuotationItem);
      if (!data) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }

      const quantity = quotationItemData.quantity ?? data.quantity;
      const unitPrice = quotationItemData.unitPrice ?? data.unitPrice;

      quotationItemData.total = unitPrice ? String(parseFloat(quantity) * parseFloat(unitPrice)): "";

      const quotationItemDetails = await this.quotationRepository.findQuotationItemDetailByQuotationItemId(quotationItemData.idQuotationItem);
      if (quotationItemDetails) {
        quotationItemDetails.forEach(async (quotationItemDetail) => {
          quotationItemDetail.quantity = String(parseInt(String(parseFloat(quantity) / parseFloat(quotationItemDetail.performance))));
          quotationItemDetail.totalCost = (parseFloat(quotationItemDetail.cost) * Math.ceil(parseFloat(quantity) / parseFloat(quotationItemDetail.performance))).toFixed(2),
          await quotationItemDetail.save();
        });
      }

      const [updatedCount, updatedQuotationItems] = await this.quotationRepository.updateQuotationItem(quotationItemData);
      if (updatedCount > 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, updatedQuotationItems);
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  deleteQuotationItem = async (idQuotationItem: number): Promise<ResponseEntity> => {
    try {
      const deletedCount = await this.quotationRepository.deleteQuotationItem(idQuotationItem);
      if (deletedCount > 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { message: "Quotation item deleted successfully" });
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  findQuotationItemDetailById = async (idQuotationItemDetail: number): Promise<ResponseEntity> => {
    try {
      const quotationItemDetail = await this.quotationRepository.findQuotationItemDetailById(idQuotationItemDetail);
      if (quotationItemDetail) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationItemDetail);
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item detail not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  findAllQuotationItemDetail = async (request: dtos.findAllQuotationItemDetailDTO): Promise<ResponseEntity> => {
    try {
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;
      const filter = this.buildQuotationItemDetailFilter(request);
      const quotationItems = await this.quotationRepository.findAllQuotationItemDetail(filter, limit, offset);
      if (quotationItems instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: quotationItems.message });
      }
      const totalCost = quotationItems.rows.reduce((acc, item) => acc + parseFloat(item.totalCost), 0);
      const response = {
        data: quotationItems.rows,
        totalCost: totalCost.toFixed(2),
        totalItems: quotationItems.count,
        currentPage: page,
        totalPages: Math.ceil(quotationItems.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  createQuotationItemDetail = async (request: dtos.CreateQuotationItemDetailDTO): Promise<ResponseEntity> => {
    try {
      const input = await Input.findOne({ where: { idInput: request.idInput } });
      if (!input) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Input not found" });
      }
      const quotationItem = await this.quotationRepository.findQuotationItemById(request.idQuotationItem);
      if (!quotationItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }
      console.log(request);
      if(!request.performance || !request.cost) {
        request.performance = input.performance;
        request.cost = input.cost;
      }
      console.log("Performance: ", request.performance);
      const data = {
        ...request,
        quantity: Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(request.performance)),
        totalCost: parseFloat((parseFloat(request.cost) * Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(request.performance))).toFixed(2)),
      };

      const quotationItemDetail = await this.quotationRepository.createQuotationItemDetail(data);
      return BuildResponse.buildSuccessResponse(201, quotationItemDetail);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  updateQuotationItemDetail = async (quotationItemDetailData: dtos.UpdateQuotationItemDetailDTO): Promise<ResponseEntity> => {
    try {
      const quotationItemDetail = await this.quotationRepository.findQuotationItemDetailById(quotationItemDetailData.idQuotationItemDetail);
      if (!quotationItemDetail) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item detail not found" });
      }

      const quotationItem = await this.quotationRepository.findQuotationItemById(quotationItemDetail.idQuotationItem);
      if(!quotationItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }

      if (quotationItemDetailData.idInput) {
        const input = await Input.findOne({ where: { idInput: quotationItemDetailData.idInput } });
        if (!input) {
          return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Input not found" });
        }

        if(!quotationItemDetailData.performance || !quotationItemDetailData.cost) {
          quotationItemDetailData.performance = input.performance;
          quotationItemDetailData.cost = input.cost;
        }
      }

      const quantity = String(Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(quotationItemDetailData.performance ?? quotationItemDetail.performance)));
      quotationItemDetailData.totalCost =
          String(Math.ceil(parseInt(quotationItemDetailData.cost ?? quotationItemDetail.cost) * parseFloat(quantity)));
      quotationItemDetailData.quantity = quantity;

      const [updatedCount, updatedQuotationItemDetails] = await this.quotationRepository.updateQuotationItemDetail(quotationItemDetailData);
      if (updatedCount > 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, updatedQuotationItemDetails);
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item detail not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  deleteQuotationItemDetail = async (idQuotationItemDetail: number): Promise<ResponseEntity> => {
    try {
      const deletedCount = await this.quotationRepository.deleteQuotationItemDetail(idQuotationItemDetail);
      if (deletedCount > 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { message: "Quotation item detail deleted successfully" });
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item detail not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  createQuotationPercentage = async (quotationPercentageData: dtos.CreateQuotationPercentageDTO): Promise<ResponseEntity> => {
    try {
      const quotationPercentage = await this.quotationRepository.findQuotationPercentageByQuotationId(quotationPercentageData.idQuotation);
      if (!quotationPercentage) {
        const response = await this.quotationRepository.createQuotationPercentage(quotationPercentageData);
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
      }
      quotationPercentage.administration = quotationPercentageData.administration;
      quotationPercentage.unforeseen = quotationPercentageData.unforeseen;
      quotationPercentage.utility = quotationPercentageData.utility;
      quotationPercentage.vat = quotationPercentageData.vat;
      await quotationPercentage.save();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationPercentage);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation percentage" });
    }
  };

  createQuotationAdditionalCost = async (request: dtos.CreateQuotationAdditionalCostDTO): Promise<ResponseEntity> => {
    try {
      const quotationAdditionalCost = await this.quotationRepository.findQuotationAdditionalCostById(request.idQuotation);
      console.log(quotationAdditionalCost);
      if (!quotationAdditionalCost) {
        const response = await this.quotationRepository.createQuotationAdditionalCost(request);
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
      }
      quotationAdditionalCost.perDiem = request.perDiem;
      quotationAdditionalCost.sisoValue = request.sisoValue;
      quotationAdditionalCost.commision = request.commision;
      quotationAdditionalCost.pettyCash = request.pettyCash;
      quotationAdditionalCost.policy = request.policy;
      quotationAdditionalCost.tax = request.tax;
      quotationAdditionalCost.utility = request.utility;

      await quotationAdditionalCost.save();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationAdditionalCost);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation additional cost" });
    }
  };

  updateQuotationPercentage = async (quotationPercentageData: dtos.UpdateQuotationPercentageDTO): Promise<ResponseEntity> => {
    try {
      const quotationPercentage = await this.quotationRepository.findQuotationPercentageById(quotationPercentageData.idQuotationPercentage);
      if (!quotationPercentage) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation percentage not found" });
      }

      const updatedQuotationPercentage = this.buildQuotationPercentage(quotationPercentage, quotationPercentageData);

      await updatedQuotationPercentage.save();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationPercentage);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  findAllQuotationComments = async (request: dtos.FindAllQuotationCommentDTO): Promise<ResponseEntity> => {
    try {
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;
      const filter = this.buildQuotationCommentFilter(request);
      const quotationComments = await this.quotationRepository.findAllQuotationComment(filter, limit, offset);
      const response = {
        data: quotationComments.rows,
        totalItems: quotationComments.count,
        currentPage: page,
        totalPages: Math.ceil(quotationComments.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get quotation comments" });
    }
  };

  createQuotationComment = async (quotationCommentData: dtos.CreateQuotationCommentDTO): Promise<ResponseEntity> => {
    try {
      const quotationComment = await this.quotationRepository.createQuotationComment(quotationCommentData);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationComment);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation comment" });
    }
  };

  updateQuotationComment = async (quotationCommentData: dtos.UpdateQuotationCommentDTO): Promise<ResponseEntity> => {
    try {
      const quotationComment = await this.quotationRepository.findQuotationCommentById(quotationCommentData.idQuotationComment);
      if (!quotationComment) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation comment not found" });
      }

      const updatedQuotationComment = this.buildQuotationComment(quotationComment, quotationCommentData);

      await updatedQuotationComment.save();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationComment);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  deleteQuotationComment = async (idQuotationComment: number): Promise<ResponseEntity> => {
    try {
      const quotationComment = await this.findQuotationById(idQuotationComment);
      if (!quotationComment) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation comment not found" });
      }

      await this.quotationRepository.deleteQuotationComment(idQuotationComment);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Quotation comment deleted successfully" });
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
    }
  };

  private buildQuotationComment = (quotationComment: QuotationComment, quotationCommentData: dtos.UpdateQuotationCommentDTO) => {
    quotationComment.idQuotation = quotationCommentData.idQuotation ?? quotationComment.idQuotation;
    quotationComment.idEmployee = quotationCommentData.idEmployee ?? quotationComment.idEmployee;
    quotationComment.comment = quotationCommentData.comment ?? quotationComment.comment;
    quotationComment.createdAt = quotationCommentData.createdAt ?? quotationComment.createdAt;
    return quotationComment;
  };

  private buildQuotation = (quotation: Quotation, quotationData: dtos.UpdateQuotationDTO) => {
    quotation.name = quotationData.name ?? quotation.name;
    quotation.client = quotationData.client ?? quotation.client;
    quotation.builder = quotationData.client ?? quotation.client;
    quotation.idResponsable = quotationData.idResponsable ?? quotation.idResponsable;
    quotation.policy = quotationData.policy ?? quotation.policy;
    quotation.technicalCondition = quotationData.technicalCondition ?? quotation.technicalCondition;
    quotation.idQuotationStatus = quotationData.idQuotationStatus ?? quotation.idQuotationStatus;
    quotation.builderAddress = quotationData.builderAddress ?? quotation.builderAddress;
    quotation.projectName = quotationData.projectName ?? quotation.projectName;
    quotation.itemSummary = quotationData.itemSummary ?? quotation.itemSummary;
    return quotation;
  };

  private buildQuotationPercentage = (quotationPercentage: QuotationPercentage, quotationPercentageData: dtos.UpdateQuotationPercentageDTO) => {
    quotationPercentage.administration = quotationPercentageData.administration ?? quotationPercentage.administration;
    quotationPercentage.unforeseen = quotationPercentageData.unforeseen ?? quotationPercentage.unforeseen;
    quotationPercentage.utility = quotationPercentageData.utility ?? quotationPercentage.utility;
    quotationPercentage.vat = quotationPercentageData.vat ?? quotationPercentage.vat;
    return quotationPercentage;
  };

  private buildQuotationFilter = (filter: dtos.findAllQuotationDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    if (filter.responsible) {
      where = {
        ...where,
        responsible: sequelize.where(sequelize.col("Employee.User.firstName"), "LIKE", `%${filter.responsible}%`),
      };
    }
    if (filter.consecutive) {
      where = {
        ...where,
        consecutive: sequelize.where(sequelize.col("consecutive"), "LIKE", `%${filter.consecutive}%`),
      };
    }
    if (filter.quotationStatus) {
      where = {
        ...where,
        quotationStatus: sequelize.where(sequelize.col("QuotationStatus.quotationStatus"), "LIKE", `%${filter.quotationStatus}%`),
      };
    }
    if (filter.builder) {
      where = {
        ...where,
        builder: sequelize.where(sequelize.col("builder"), "LIKE", `%${filter.builder}%`),
      };
    }
    return where;
  };

  private buildQuotationCommentFilter = (filter: dtos.FindAllQuotationCommentDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    if (filter.idQuotation) {
      where = {
        ...where,
        idQuotation: filter.idQuotation,
      };
    }
    return where;
  };

  private buildQuotationItemFilter = (filter: dtos.findAllQuotationItemDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    if (filter.idQuotation) {
      where = {
        ...where,
        idQuotation: filter.idQuotation,
      };
    }
    return where;
  };

  private buildQuotationItemDetailFilter = (filter: dtos.findAllQuotationItemDetailDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    if (filter.idQuotationItem) {
      where = {
        ...where,
        idQuotationItem: filter.idQuotationItem,
      };
    }
    return where;
  };

  private buildQuotationReport = async (quotationIn: Quotation):
    Promise<
      {
        quotationSummary: dtos.QuotationSummaryDTO,
        quotationAdditionalCost: dtos.QuotationAdditionalCostSummaryDTO,
        summaryByItem: dtos.QuotationItemSummaryDTO[]
      } |
      CustomError
    > => {
    try {
      const [quotationItems, percentage, additionalCosts] = await Promise.all([
        this.quotationRepository.findAllQuotationItem({ idQuotation: quotationIn.idQuotation }, 100, 0),
        this.quotationRepository.findQuotationPercentageByQuotationId(quotationIn.idQuotation) as Promise<QuotationPercentage>,
        this.quotationRepository.findQuotationAdditionalCostByQuotationId(quotationIn.idQuotation)
      ]);

      const quotation = await this.quotationRepository.findById(quotationIn.idQuotation);
      if (!quotation || !quotationItems) {
        return CustomError.notFound("Quotation not found");
      }

      const quotationItemsIds = quotationItems.rows.map((item) => item.idQuotationItem);
      const quotationItemDetails = await QuotationItemDetail.findAll({ where: { idQuotationItem: quotationItemsIds } });

      if (!percentage || !quotationItems || !additionalCosts) {
        return this.buildEmptyQuotationReport();
      }

      let total = quotationItemDetails.reduce((acc, item) => acc + parseFloat(item.totalCost), 0);
      total = total + additionalCosts.perDiem + additionalCosts.sisoValue;

      const otherCost = {
        impuesto: additionalCosts.tax * total * 1.5390,
        poliza: additionalCosts.policy * total * 1.5390,
        comision: additionalCosts.commision * total * 1.3317,
        caja_menor: additionalCosts.pettyCash * total * 1.5390,
        sisos: additionalCosts.sisoValue,
        perDiem: additionalCosts.perDiem,
        utility: additionalCosts.utility
      };

      const totalByQuotationItem = quotationItemDetails.reduce((acc: { [key: number]: number }, item) => {
        acc[item.idQuotationItem] = acc[item.idQuotationItem] ? acc[item.idQuotationItem] + parseFloat(item.totalCost) : parseFloat(item.totalCost);
        return acc;
      }, {});
      const sumTotalItems = quotationItemDetails.reduce((acc, item) => acc + parseFloat(item.totalCost), 0);

      // get the percentage of each item in the total cost
      const summary = Object.keys(totalByQuotationItem).map((key: string) => {
        return {
          idQuotationItem: key,
          totalCost: totalByQuotationItem[parseInt(key)],
          percentage: (totalByQuotationItem[parseInt(key)] / sumTotalItems) * 100,
        };
      });

      percentage.administration = percentage.administration ? parseFloat(String(percentage.administration)) : 0;
      percentage.unforeseen = percentage.unforeseen ? parseFloat(String(percentage.unforeseen)) : 0;
      percentage.utility = percentage.utility ? parseFloat(String(percentage.utility)) : 0;
      percentage.vat = percentage.vat ? parseFloat(String(percentage.vat)) : 0;

      const sumPercents = parseFloat(String(percentage.administration)) +
        parseFloat(String(percentage.unforeseen)) +
        parseFloat(String(percentage.utility)) +
        parseFloat(String(percentage.utility * percentage.vat)) + 1;

      const subTotal = total + otherCost.impuesto + otherCost.poliza + otherCost.comision + otherCost.caja_menor;
      const finalTotal = subTotal * otherCost.utility + subTotal;

      const summaryByItem = summary.map((item) => {
        const quotationItem = quotationItems.rows.find((quotationItem) => quotationItem.idQuotationItem === parseInt(item.idQuotationItem))! as QuotationItem;
        const unitValue = (finalTotal * (item.percentage / 100)) / parseFloat(quotationItem.quantity) / parseFloat(sumPercents.toFixed(6));
        return {
          idQuotationItem: parseInt(item.idQuotationItem),
          quantity: parseFloat(quotationItem?.quantity),
          percentage: item.percentage,
          firstSum: quotationItem?.quantity ? (finalTotal * (item.percentage / 100)) / parseInt(quotationItem.quantity) : 0,
          unitValue,
          totalCost: parseFloat(quotationItem.quantity) * unitValue,
        };
      });

      const unitValueAIU = summaryByItem.reduce((acc, item) => acc + item.totalCost, 0);

      const quotationSummary = {
        unitValueAIU: String(unitValueAIU),
        administration: String(unitValueAIU * percentage.administration),
        unforeseen: String(unitValueAIU * percentage.unforeseen),
        utility: String(unitValueAIU * percentage.utility),
        vat: String((unitValueAIU * percentage.utility) * percentage.vat),
        unitValueAIUIncluded: String((unitValueAIU + (percentage.administration + percentage.unforeseen + percentage.utility) * unitValueAIU)
          + (unitValueAIU * percentage.utility) * percentage.vat),
        totalValue: String((unitValueAIU + (percentage.administration + percentage.unforeseen + percentage.utility) * unitValueAIU)
          + (unitValueAIU * percentage.utility) * percentage.vat)
      };

      const directCost = quotationItemDetails.reduce((acc, item) => acc + parseFloat(item.totalCost), 0);

      const quotationAdditionalCost = {
        perDiem: String(otherCost.perDiem),
        sisoValue: String(otherCost.sisos),
        tax: String(otherCost.impuesto),
        commision: String(otherCost.comision),
        pettyCash: String(otherCost.caja_menor),
        policy: String(otherCost.poliza),
        utility: String(otherCost.utility * subTotal),
        directCost: String(directCost),
      };
      return { quotationSummary, quotationAdditionalCost, summaryByItem };
    } catch (error) {
      console.error(error);
      return CustomError.internalServer("Failed to build quotation report");
    }
  };
}
