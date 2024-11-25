import { QuotationRepository } from "./quotation.repository";
import * as dtos from "./quotation.interfase";
import { StatusCode } from "../interfaces";
import { Input } from "../input/input.model";
import { CustomError } from "../utils";
import { ResponseEntity } from "../services/interface";
import { BuildResponse } from "../services";
import { dbConnection } from "../config";
import { Quotation } from "./quotation.model";
import { QuotationPercentage } from "./quotation-percentage.model";
import sequelize from "sequelize";
import { QuotationComment } from "./quotation-comment.model";

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
      };
      const quotation = await this.quotationRepository.create(quotationData, transaction);
      const consecutive = `COT SACIPR Nr. ${quotation.idQuotation}-${new Date().getFullYear()}`;
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

  findQuotationById = async (id: number): Promise<ResponseEntity> => {
    try {
      const quotation = await this.quotationRepository.findById(id);
      if (quotation) {
        const jsonQuotation = quotation.toJSON();
        const responsable = jsonQuotation.Employee.User.firstName 
            + " " + jsonQuotation.Employee.User.lastName;
        const data = {
          idQuotation: quotation.idQuotation,
          name: quotation.name,
          responsable,
          QuotationPercentage: jsonQuotation.QuotationPercentage,
          QuotationStatus: jsonQuotation.QuotationStatus,
          builder: quotation.builder,
          builderAddress: quotation.builderAddress,
          projectName: quotation.projectName,
          itemSummary: quotation.itemSummary,
          totalCost: quotation.totalCost,
          QuotationComments: jsonQuotation.QuotationComments,
        };
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
      } else {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: error });
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
      const data = quotations.rows.map((quotation) => {
        let responsable: string | undefined;
        const jsonQuotation = quotation.toJSON();
        if(jsonQuotation.Employee) {
          responsable = jsonQuotation.Employee.User.firstName 
            + " " + jsonQuotation.Employee.User.lastName;
        }
        return {
          idQuotation: quotation.idQuotation,
          name: quotation.name,
          responsable: responsable,
          QuotationPercentage: jsonQuotation.QuotationPercentage,
          QuotationStatus: jsonQuotation.QuotationStatus,
          builder: quotation.builder,
          builderAddress: quotation.builderAddress,
          projectName: quotation.projectName,
          itemSummary: quotation.itemSummary,
          totalCost: quotation.totalCost,
          QuotationComments: jsonQuotation.QuotationComments,
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
      await updatedQuotation.save();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedQuotation);
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
      const quotationItems = await this.quotationRepository.findAllQuotationItem({}, limit, offset);
      const response = {
        data: quotationItems.rows,
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
      quotationItemData.total = quantity * unitPrice;

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

  findAllQuotationItemDetails = async (request: dtos.findAllQuotationItemDTO): Promise<ResponseEntity> => {
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
      const quotationItems = await this.quotationRepository.findAllQuotationItemDetail({}, limit, offset);
      if (quotationItems instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: quotationItems.message });
      }
      const response = {
        data: quotationItems.rows,
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

  createQuotationItemDetail = async (quotationItemDetailData: dtos.CreateQuotationItemDetailDTO): Promise<ResponseEntity> => {
    try {
      const input = await Input.findOne({ where: { idInput: quotationItemDetailData.idInput } });
      if (!input) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Input not found" });
      }
      
      const data = {
        ...quotationItemDetailData,
        totalCost: parseInt(input.cost) * quotationItemDetailData.quantity,
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

      if (quotationItemDetailData.idInput) {
        const input = await Input.findOne({ where: { idInput: quotationItemDetailData.idInput } });
        if (!input) {
          return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Input not found" });
        }
        const quantity = quotationItemDetailData.quantity? quotationItemDetailData.quantity : quotationItemDetail.quantity;
        quotationItemDetailData.totalCost = 
          parseInt(input.cost) * quantity;
      }
      quotationItemDetailData.totalCost = quotationItemDetailData.totalCost || quotationItemDetail.totalCost;

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
      const quotationPercentage = await this.quotationRepository.createQuotationPercentage(quotationPercentageData);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotationPercentage);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation percentage" });
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
      if(!quotationComment) {
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
    quotation.idQuotationStatus = quotationData.idQuotationStatus ?? quotation.idQuotationStatus;
    quotation.builder = quotationData.builder ?? quotation.builder;
    quotation.builderAddress = quotationData.builderAddress ?? quotation.builderAddress;
    quotation.projectName = quotationData.projectName ?? quotation.projectName;
    quotation.itemSummary = quotationData.itemSummary ?? quotation.itemSummary;
    return quotation;
  };

  private buildQuotationPercentage = (quotationPercentage: QuotationPercentage, quotationPercentageData: dtos.UpdateQuotationPercentageDTO) => {
    quotationPercentage.administration = quotationPercentageData.administration ?? quotationPercentage.administration;
    quotationPercentage.unforeseen = quotationPercentageData.unforeseen ?? quotationPercentage.unforeseen;
    quotationPercentage.utility = quotationPercentageData.utility ?? quotationPercentage.utility;
    quotationPercentage.tax = quotationPercentageData.tax ?? quotationPercentage.tax;
    return quotationPercentage;
  };

  private buildQuotationFilter = (filter: dtos.findAllQuotationDTO): {[key: string]: any} => {
    let where: {[key: string]: any} = {};
    if (filter.responsible) {
      where = {
        ...where,
        responsible: sequelize.where(sequelize.col("Employee.User.firstName"), "LIKE", `%${filter.responsible}%`),
      };
    }
    return where;
  };

  private buildQuotationCommentFilter = (filter: dtos.FindAllQuotationCommentDTO): {[key: string]: any} => {
    let where: {[key: string]: any} = {};
    if (filter.idQuotation) {
      where = {
        ...where,
        idQuotation: filter.idQuotation,
      };
    }
    return where;
  };
}
