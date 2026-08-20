import { QuotationRepository } from "./quotation.repository";
import * as dtos from "./quotation.interfase";
import { StatusCode } from "../../utils/general.interfase";
import { Input } from "../input/input.model";
import { CustomError, deleteFile, formatDate, getNextMonth, uploadFile } from "../../utils";
import { ResponseEntity } from "../employee/interface";
import { dbConnection } from "../../config";
import { Quotation } from "./quotation.model";
import { QuotationPercentage } from "./quotation-percentage.model";
import sequelize from "sequelize";
import { QuotationAdditionalCost } from "./quotation-additional-costs.model";
import { QuotationComment } from "./quotation-comment.model";
import { QuotationItemDetail } from "./quotation-item-detail.model";
import { QuotationItem } from "./quotation-item.model";
import { readFileSync } from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { EmployeeRepository } from "../employee/employee.repository";
import { BuildResponse } from "../../utils/build-response";

export class QuotationService {

  private readonly quotationRepository: QuotationRepository;
  private readonly employeeRepository: EmployeeRepository;

  constructor(
    quotationRepository: QuotationRepository,
    employeeRepository: EmployeeRepository
  ) {
    this.quotationRepository = quotationRepository;
    this.employeeRepository = employeeRepository;
  }

  createQuotation = async (quotationData: dtos.CreateQuotationDTO, fileName?: string): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      quotationData = {
        ...quotationData,
        idQuotationStatus: 7,
        builder: quotationData.builder ?? quotationData.client,
      };
      const quotation = await this.quotationRepository.create(quotationData, transaction);
      const consecutive = `COT SACIPR No. ${quotation.idQuotation}-${new Date().getFullYear()}`;
      quotation.consecutive = consecutive;

      if (fileName) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        await uploadFile(fileName, identifier, contentType, "order");
        quotation.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.pdf`;
      }

      await quotation.save({ transaction });

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, quotation);
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error creating quotation", err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to create quotation" });
    }
  };

  duplicateQuotation = async (idQuotation: number): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      const originalQuotation = await this.quotationRepository.findById(idQuotation);
      if (!originalQuotation) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }

      const originalQuotationItems = await this.quotationRepository.findAllQuotationItem({ idQuotation }, -1, 0);
      const originalQuotationItemDetails = await this.quotationRepository.findAllQuotationItemDetail(
        this.buildQuotationItemDetailFilter({ idQuotation }),
        -1,
        0
      );
      const originalQuotationComments = await this.quotationRepository.findAllQuotationComment({ idQuotation }, -1, 0);
      const originalQuotationPercentage = await this.quotationRepository.findQuotationPercentageByQuotationId(idQuotation);
      const originalQuotationAdditionalCost = await this.quotationRepository.findQuotationAdditionalCostByQuotationId(idQuotation);

      if (originalQuotationItemDetails instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: originalQuotationItemDetails.message });
      }

      const duplicatedQuotation = await this.quotationRepository.create(
        {
          name: originalQuotation.name,
          idResponsable: originalQuotation.idResponsable,
          builder: originalQuotation.builder,
          builderAddress: originalQuotation.builderAddress,
          projectName: originalQuotation.projectName,
          itemSummary: originalQuotation.itemSummary,
          totalCost: originalQuotation.totalCost,
          perDiem: originalQuotation.perDiem,
          sisoNumber: originalQuotation.sisoNumber,
          documentUrl: originalQuotation.documentUrl,
          client: originalQuotation.client,
          executionTime: originalQuotation.executionTime,
          policy: originalQuotation.policy,
          advance: originalQuotation.advance,
          technicalCondition: originalQuotation.technicalCondition,
          idQuotationStatus: originalQuotation.idQuotationStatus,
          consecutive: originalQuotation.consecutive ? `${originalQuotation.consecutive} copy` : "copy",
        } as any,
        transaction
      );

      const quotationItemIdMap = new Map<number, number>();
      for (const originalItem of originalQuotationItems.rows) {
        const duplicatedItem = await QuotationItem.create(
          {
            idQuotation: duplicatedQuotation.idQuotation,
            item: originalItem.item,
            technicalSpecification: originalItem.technicalSpecification,
            unitMeasure: originalItem.unitMeasure,
            quantity: originalItem.quantity,
            unitPrice: originalItem.unitPrice,
            total: originalItem.total,
          },
          { transaction }
        );

        quotationItemIdMap.set(originalItem.idQuotationItem, duplicatedItem.idQuotationItem);
      }

      for (const originalDetail of originalQuotationItemDetails.rows) {
        const duplicatedQuotationItemId = quotationItemIdMap.get(originalDetail.idQuotationItem);
        if (!duplicatedQuotationItemId) {
          throw new Error(`Missing duplicated quotation item for idQuotationItem=${originalDetail.idQuotationItem}`);
        }

        await QuotationItemDetail.create(
          {
            idQuotationItem: duplicatedQuotationItemId,
            idInput: originalDetail.idInput,
            quantity: originalDetail.quantity,
            performance: originalDetail.performance,
            cost: originalDetail.cost,
            totalCost: originalDetail.totalCost,
          },
          { transaction }
        );
      }

      if (originalQuotationPercentage) {
        await QuotationPercentage.create(
          {
            idQuotation: duplicatedQuotation.idQuotation,
            administration: originalQuotationPercentage.administration,
            unforeseen: originalQuotationPercentage.unforeseen,
            utility: originalQuotationPercentage.utility,
            vat: originalQuotationPercentage.vat,
          },
          { transaction }
        );
      }

      if (originalQuotationAdditionalCost) {
        await QuotationAdditionalCost.create(
          {
            idQuotation: duplicatedQuotation.idQuotation,
            perDiem: originalQuotationAdditionalCost.perDiem,
            sisoValue: originalQuotationAdditionalCost.sisoValue,
            tax: originalQuotationAdditionalCost.tax,
            commision: originalQuotationAdditionalCost.commision,
            pettyCash: originalQuotationAdditionalCost.pettyCash,
            policy: originalQuotationAdditionalCost.policy,
            utility: originalQuotationAdditionalCost.utility,
          },
          { transaction }
        );
      }

      for (const originalComment of originalQuotationComments.rows) {
        await QuotationComment.create(
          {
            idQuotation: duplicatedQuotation.idQuotation,
            idEmployee: originalComment.idEmployee,
            idUser: originalComment.idUser,
            comment: originalComment.comment,
            createdAt: originalComment.createdAt,
            updatedAt: originalComment.updatedAt,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
        idQuotation: duplicatedQuotation.idQuotation,
        idQuotationSource: idQuotation,
        message: "Quotation duplicated successfully",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error duplicating quotation", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to duplicate quotation" });
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
        documentUrl: quotation.documentUrl,
        consecutive: quotation.consecutive,
        QuotationPercentage: jsonQuotation.QuotationPercentage,
        QuotationAdditionalCost: jsonQuotation.QuotationAdditionalCost,
        QuotationStatus: jsonQuotation.QuotationStatus,
        builder: quotation.builder,
        builderAddress: quotation.builderAddress,
        projectName: quotation.projectName,
        executionTime: quotation.executionTime,
        advance: quotation.advance,
        policy: quotation.policy,
        technicalCondition: quotation.technicalCondition,
        idResponsable: quotation.idResponsable,
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

      const employeeDb = await this.employeeRepository.findById((quotation.data as any).idResponsable);
      if (employeeDb instanceof CustomError) {
        console.error(employeeDb);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get employee" });
      }

      const employee = employeeDb.toJSON();


      const response = {
        items: itemResponse,
        client: (quotation.data as any)?.client ?? "",
        itemNames,
        policy: (quotation.data as any)?.policy ?? "",
        quotationName: (quotation.data as any)?.name ?? "",
        executionTime: (quotation.data as any)?.executionTime ?? "",
        advance: (quotation.data as any)?.advance ?? "",
        cuts: (quotation.data as any)?.advance ? 100 - parseInt((quotation.data as any)?.advance) : "",
        technicalSpecifications,
        employeeName: employee.User.firstName + " " + employee.User.lastName,
        employeeEmail: employee.User.email,
        technicalCondition: (quotation.data as any)?.technicalCondition ?? "",
        employeePosition: employee.Position.position,
        date: formatDate(new Date().toISOString().split("T")[0]),
        dateUntil: formatDate(getNextMonth(new Date().toISOString().split("T")[0])),
        consecutive: (quotation.data as any)?.consecutive ?? "",
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

  generateQuotationSupplyLaborDocx = async (id: number): Promise<ResponseEntity | Buffer> => {
    try {
      const quotationResponse = await this.findQuotationById(id);
      if (quotationResponse.code !== StatusCode.Ok) {
        return quotationResponse;
      }

      const quotationItemsResponse = await this.findAllQuotationItems({ idQuotation: id, page: 1, pageSize: 100 });
      if (quotationItemsResponse.code !== StatusCode.Ok) {
        return quotationItemsResponse;
      }

      const templatePath = "template/cotizacionSuminstroManoObra.docx";
      const content = readFileSync(templatePath, "binary");

      const zip = new PizZip(content);
      const documentXmlFile = zip.file("word/document.xml");
      if (documentXmlFile) {
        const updatedDocumentXml = this.replaceSecondTablePlaceholders(documentXmlFile.asText());
        // Fuerza tablas en flujo normal para evitar superposición al abrir en Word.
        const normalizedTablePositionXml = updatedDocumentXml
          .replace(/<w:tblpPr[^>]*\/>/g, "")
          .replace(/<w:tblOverlap\s+w:val="overlap"\s*\/>/g, "");
        zip.file("word/document.xml", normalizedTablePositionXml);
      }

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });

      const quotation = quotationResponse as ResponseEntity;
      const quotationItems = quotationItemsResponse as ResponseEntity;

      const rawItems = ((quotationItems.data as any)?.data ?? []) as QuotationItem[];
      const currencyFormatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      });

      const supplyItemsCalculated = rawItems.map((item: QuotationItem) => {
        const quantity = this.toNumber(item.quantity);
        const unitPriceBase = this.toNumber(item.unitPrice);

        const x = unitPriceBase * 1.1557;
        const y = x * 0.70;
        const z = y / 1.1557;
        const total = z * quantity;

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          unitPrice: currencyFormatter.format(z),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });

      const laborItemsCalculated = rawItems.map((item: QuotationItem) => {
        const quantity = this.toNumber(item.quantity);
        const unitPriceBase = this.toNumber(item.unitPrice);

        const x = unitPriceBase * 1.1557;
        const y = x * 0.30;
        const z = y / 1.19;
        const total = z * quantity;

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          unitPrice: currencyFormatter.format(z),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });

      const supplyUnitValueAIU = supplyItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const supplyAdministration = supplyUnitValueAIU * 0.10;
      const supplyUnforeseen = supplyUnitValueAIU * 0.02;
      const supplyUtility = supplyUnitValueAIU * 0.03;
      const supplyVat = supplyUtility * 0.19;
      const supplyUnitValueAIUIncluded = supplyUnitValueAIU + supplyAdministration + supplyUnforeseen + supplyUtility + supplyVat;

      console.log("[quotation][V3][supply][totals]", {
        supplyUnitValueAIU,
        supplyAdministration,
        supplyUnforeseen,
        supplyUtility,
        supplyVat,
        supplyUnitValueAIUIncluded,
      });

      const laborUnitValueAIU = laborItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const laborVat = laborUnitValueAIU * 0.19;
      const laborUnitValueAIUIncluded = laborUnitValueAIU + laborVat;

      console.log("[quotation][V3][labor][totals]", {
        laborUnitValueAIU,
        laborVat,
        laborUnitValueAIUIncluded,
      });

      const itemNames = rawItems.map((item: QuotationItem) => item.item).join(", ");
      const technicalSpecifications = rawItems.map((item: QuotationItem) => item.technicalSpecification).join(", ");

      const employeeDb = await this.employeeRepository.findById((quotation.data as any).idResponsable);
      if (employeeDb instanceof CustomError) {
        console.error(employeeDb);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get employee" });
      }

      const employee = employeeDb.toJSON();

      const response = {
        items: supplyItemsCalculated.map(({ rawTotal, ...item }) => item),
        itemsLabor: laborItemsCalculated.map(({ rawTotal, ...item }) => item),
        client: (quotation.data as any)?.client ?? "",
        itemNames,
        policy: (quotation.data as any)?.policy ?? "",
        quotationName: (quotation.data as any)?.name ?? "",
        executionTime: (quotation.data as any)?.executionTime ?? "",
        advance: (quotation.data as any)?.advance ?? "",
        cuts: (quotation.data as any)?.advance ? 100 - parseInt((quotation.data as any)?.advance) : "",
        technicalSpecifications,
        employeeName: employee.User.firstName + " " + employee.User.lastName,
        employeeEmail: employee.User.email,
        technicalCondition: (quotation.data as any)?.technicalCondition ?? "",
        employeePosition: employee.Position.position,
        date: formatDate(new Date().toISOString().split("T")[0]),
        dateUntil: formatDate(getNextMonth(new Date().toISOString().split("T")[0])),
        consecutive: (quotation.data as any)?.consecutive ?? "",
        project: (quotation.data as any)?.projectName ?? "",
        unitValueAIU: currencyFormatter.format(supplyUnitValueAIU),
        administration: currencyFormatter.format(supplyAdministration),
        unforeseen: currencyFormatter.format(supplyUnforeseen),
        utility: currencyFormatter.format(supplyUtility),
        vat: currencyFormatter.format(supplyVat),
        unitValueAIUIncluded: currencyFormatter.format(supplyUnitValueAIUIncluded),
        unitValueAIULabor: currencyFormatter.format(laborUnitValueAIU),
        vatLabor: currencyFormatter.format(laborVat),
        unitValueAIUIncludedLabor: currencyFormatter.format(laborUnitValueAIUIncluded),
      };

      doc.render(response);
      return doc.getZip().generate({ type: "nodebuffer" });
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get supply and labor quotation report" });
    }
  };

  generateQuotationSupplyLaborDocxV2 = async (id: number): Promise<ResponseEntity | Buffer> => {
    try {
      // ─── CARGA DE DATOS ──────────────────────────────────────────────────────────
      // Trae encabezado de la cotización, ítems y detalles de ítems (insumos).
      // Los porcentajes de AIU e IVA también se obtienen aquí y son compartidos
      // por ambas tablas.
      const quotationResponse = await this.findQuotationById(id);
      if (quotationResponse.code !== StatusCode.Ok) {
        return quotationResponse;
      }

      const quotationItemsResponse = await this.findAllQuotationItems({ idQuotation: id, page: 1, pageSize: 100000 });
      if (quotationItemsResponse.code !== StatusCode.Ok) {
        return quotationItemsResponse;
      }

      const quotationItemDetailsResponse = await this.quotationRepository.findAllQuotationItemDetail(
        this.buildQuotationItemDetailFilter({ idQuotation: id }),        -1,        0
      );
      
      if (quotationItemDetailsResponse instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: quotationItemDetailsResponse.message });
      }

      const quotationPercentage = await this.quotationRepository.findQuotationPercentageByQuotationId(id);
      if (!quotationPercentage) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation percentage not found" });
      }
      // ─────────────────────────────────────────────────────────────────────────────

      const administrationPercentage = 0.10;
      const unforeseenPercentage = 0.02;
      const utilityPercentage = 0.02;
      const vatPercentage = 0.19;

      const aiuFactor = 1 + administrationPercentage + unforeseenPercentage + utilityPercentage;
      // ─────────────────────────────────────────────────────────────────────────────

      // ─── COSTO BASE DE MANO DE OBRA POR ÍTEM (insumo idInput = 131) ─────────────
      // Se acumula el costo del insumo de mano de obra (idInput=131) por cada
      // idQuotationItem. Este valor base es el punto de partida para TABLA 2.
      const laborCostByQuotationItem = quotationItemDetailsResponse.rows
        .filter((detail) => this.toNumber(detail.idInput) === 131)
        .reduce((acc, detail) => {
          const idQuotationItem = this.toNumber(detail.idQuotationItem);
          acc[idQuotationItem] = (acc[idQuotationItem] ?? 0) + this.toNumber(detail.cost);
          return acc;
        }, {} as Record<number, number>);
      // ─────────────────────────────────────────────────────────────────────────────

      const templatePath = "template/cotizacionSuminstroManoObraV2.docx";
      const content = readFileSync(templatePath, "binary");

      const zip = new PizZip(content);
      const documentXmlFile = zip.file("word/document.xml");
      if (documentXmlFile) {
        const updatedDocumentXml = this.replaceSecondTablePlaceholders(documentXmlFile.asText());
        zip.file("word/document.xml", updatedDocumentXml);
      }

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });

      const quotation = quotationResponse as ResponseEntity;
      const quotationItems = quotationItemsResponse as ResponseEntity;

      const rawItems = ((quotationItems.data as any)?.data ?? []) as QuotationItem[];
      const currencyFormatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      });

      // TABLA 1: MANO DE OBRA
      // unitPrice = cost * 1.5
      // total = unitPrice * quantity
      const laborItemsCalculated = rawItems.map((item: QuotationItem) => {
        const quantity = this.toNumber(item.quantity);
        const idQuotationItem = this.toNumber(item.idQuotationItem);
        const cost = laborCostByQuotationItem[idQuotationItem] ?? 0;
        const unitPrice = cost * 1.5;
        const total = unitPrice * quantity;

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          cost: currencyFormatter.format(cost),
          unitPrice: currencyFormatter.format(unitPrice),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });

      // TABLA 2: SUMINISTRO
      // x = unitPriceBase * aiuFactor
      // unitPrice = (x - laborUnitPrice) / 1.19
      // total = unitPrice * quantity
      const supplyItemsCalculated = rawItems.map((item: QuotationItem) => {
        const quantity = this.toNumber(item.quantity);
        const unitPriceBase = this.toNumber(item.unitPrice);
        const idQuotationItem = this.toNumber(item.idQuotationItem);
        const laborCostBase = laborCostByQuotationItem[idQuotationItem] ?? 0;
        const laborUnitPrice = laborCostBase * 1.5;
        const x = unitPriceBase * aiuFactor;
        const unitPrice = vatPercentage > 0 ? Math.max((x - laborUnitPrice) / (1 + vatPercentage), 0) : Math.max(x - laborUnitPrice, 0);
        const total = unitPrice * quantity;

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          unitPrice: currencyFormatter.format(unitPrice),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });

      // TABLA 1: totales de mano de obra con AIU
      const laborUnitValueAIU = laborItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const laborAdministration = laborUnitValueAIU * administrationPercentage;
      const laborUnforeseen = laborUnitValueAIU * unforeseenPercentage;
      const laborUtility = laborUnitValueAIU * utilityPercentage;
      const laborVat = laborUtility * vatPercentage;
      const laborUnitValueAIUIncluded = laborUnitValueAIU + laborAdministration + laborUnforeseen + laborUtility + laborVat;

      // TABLA 2: totales de suministro con IVA solamente
      const supplyUnitValueAIU = supplyItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const supplyVat = supplyUnitValueAIU * vatPercentage;
      const supplyUnitValueAIUIncluded = supplyUnitValueAIU + supplyVat;

      const itemNames = rawItems.map((item: QuotationItem) => item.item).join(", ");
      const technicalSpecifications = rawItems.map((item: QuotationItem) => item.technicalSpecification).join(", ");

      const employeeDb = await this.employeeRepository.findById((quotation.data as any).idResponsable);
      if (employeeDb instanceof CustomError) {
        console.error(employeeDb);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get employee" });
      }

      const employee = employeeDb.toJSON();

      const response = {
        items: laborItemsCalculated.map(({ rawTotal, ...item }) => item),
        itemsLabor: supplyItemsCalculated.map(({ rawTotal, ...item }) => item),
        client: (quotation.data as any)?.client ?? "",
        itemNames,
        policy: (quotation.data as any)?.policy ?? "",
        quotationName: (quotation.data as any)?.name ?? "",
        executionTime: (quotation.data as any)?.executionTime ?? "",
        advance: (quotation.data as any)?.advance ?? "",
        cuts: (quotation.data as any)?.advance ? 100 - parseInt((quotation.data as any)?.advance) : "",
        technicalSpecifications,
        employeeName: employee.User.firstName + " " + employee.User.lastName,
        employeeEmail: employee.User.email,
        technicalCondition: (quotation.data as any)?.technicalCondition ?? "",
        employeePosition: employee.Position.position,
        date: formatDate(new Date().toISOString().split("T")[0]),
        dateUntil: formatDate(getNextMonth(new Date().toISOString().split("T")[0])),
        consecutive: (quotation.data as any)?.consecutive ?? "",
        project: (quotation.data as any)?.projectName ?? "",
        unitValueAIU: currencyFormatter.format(laborUnitValueAIU),
        administration: currencyFormatter.format(laborAdministration),
        unforeseen: currencyFormatter.format(laborUnforeseen),
        utility: currencyFormatter.format(laborUtility),
        vat: currencyFormatter.format(laborVat),
        unitValueAIUIncluded: currencyFormatter.format(laborUnitValueAIUIncluded),
        unitValueAIULabor: currencyFormatter.format(supplyUnitValueAIU),
        vatLabor: currencyFormatter.format(supplyVat),
        unitValueAIUIncludedLabor: currencyFormatter.format(supplyUnitValueAIUIncluded),
      };

      console.log("[quotation][V3][response]", {
        items: response.items,
        itemsLabor: response.itemsLabor,
        laborTotals: {
          unitValueAIU: response.unitValueAIU,
          administration: response.administration,
          unforeseen: response.unforeseen,
          utility: response.utility,
          vat: response.vat,
          unitValueAIUIncluded: response.unitValueAIUIncluded,
        },
        supplyTotals: {
          unitValueAIU: response.unitValueAIULabor,
          vat: response.vatLabor,
          unitValueAIUIncluded: response.unitValueAIUIncludedLabor,
        },
      });

      doc.render(response);
      return doc.getZip().generate({ type: "nodebuffer" });
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get supply and labor quotation report" });
    }
  };
  
  generateQuotationSupplyLaborDocxV3 = async (id: number): Promise<ResponseEntity | Buffer> => {
    try {
      // ─── CARGA DE DATOS ──────────────────────────────────────────────────────────
      // Trae encabezado de la cotización, ítems y detalles de ítems (insumos).
      // Los porcentajes de AIU e IVA también se obtienen aquí y son compartidos
      // por ambas tablas.
      const quotationResponse = await this.findQuotationById(id);
      if (quotationResponse.code !== StatusCode.Ok) {
        return quotationResponse;
      }

      const quotationItemsResponse = await this.findAllQuotationItems({ idQuotation: id, page: 1, pageSize: 100000 });
      if (quotationItemsResponse.code !== StatusCode.Ok) {
        return quotationItemsResponse;
      }

      const quotationItemDetailsResponse = await this.quotationRepository.findAllQuotationItemDetail(
        this.buildQuotationItemDetailFilter({ idQuotation: id }),        -1,        0
      );
      
      if (quotationItemDetailsResponse instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: quotationItemDetailsResponse.message });
      }

      const quotationPercentage = await this.quotationRepository.findQuotationPercentageByQuotationId(id);
      if (!quotationPercentage) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation percentage not found" });
      }
      // ─────────────────────────────────────────────────────────────────────────────

      // ─── PORCENTAJES COMPARTIDOS (ambas tablas) ──────────────────────────────────
      // TABLA 1 (Mano de obra): Administración, Imprevistos, Utilidad e IVA/Utilidad.
      // TABLA 2 (Suministro): IVA.
      const administrationPercentage = this.toNumber(quotationPercentage.administration);
      const unforeseenPercentage = this.toNumber(quotationPercentage.unforeseen);
      const utilityPercentage = this.toNumber(quotationPercentage.utility);
      const vatPercentage = this.toNumber(quotationPercentage.vat);

      // Factor AIU = 1 + A + I + U + (U * IVA) — usado para calcular base con AIU.
      const aiuFactor = 1 + administrationPercentage + unforeseenPercentage + utilityPercentage + (utilityPercentage * vatPercentage);
      // ─────────────────────────────────────────────────────────────────────────────

      // ─── COSTO BASE DE MANO DE OBRA POR ÍTEM (insumo idInput = 131) ─────────────
      // Se acumula el costo del insumo de mano de obra (idInput=131) por cada
      // idQuotationItem. Este valor base se usa en ambos cálculos.
      const laborCostByQuotationItem = quotationItemDetailsResponse.rows
        .filter((detail) => this.toNumber(detail.idInput) === 131)
        .reduce((acc, detail) => {
          const idQuotationItem = this.toNumber(detail.idQuotationItem);
          acc[idQuotationItem] = (acc[idQuotationItem] ?? 0) + this.toNumber(detail.cost);
          return acc;
        }, {} as Record<number, number>);
      // ─────────────────────────────────────────────────────────────────────────────

      const templatePath = "template/cotizacionSuminstroManoObraV3.docx";
      const content = readFileSync(templatePath, "binary");

      const zip = new PizZip(content);
      const documentXmlFile = zip.file("word/document.xml");
      if (documentXmlFile) {
        const updatedDocumentXml = this.replaceSecondTablePlaceholders(documentXmlFile.asText());
        zip.file("word/document.xml", updatedDocumentXml);
      }

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });

      const quotation = quotationResponse as ResponseEntity;
      const quotationItems = quotationItemsResponse as ResponseEntity;

      const rawItems = ((quotationItems.data as any)?.data ?? []) as QuotationItem[];
      const currencyFormatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      });

      console.log("[quotation][V3] rawItems", rawItems.map((item) => ({
        idQuotationItem: item.idQuotationItem,
        item: item.item,
        unitMeasure: item.unitMeasure,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })));

      // ─── TABLA 1: MANO DE OBRA ────────────────────────────────────────────────────
      // Por cada ítem:
      //   laborValueAiu = laborCostBase * 1.5
      //   unitPrice     = laborValueAiu
      //   total         = unitPrice * quantity
      const laborItemsCalculated = rawItems.map((item: QuotationItem) => {
        const unitPriceBase = this.toNumber(item.unitPrice);
        const quantity = this.toNumber(item.quantity);
        const idQuotationItem = this.toNumber(item.idQuotationItem);
        const laborCostBase = laborCostByQuotationItem[idQuotationItem] ?? 0;
        const laborValueAiu = laborCostBase * 1.5;
        const unitPrice = laborValueAiu;
        const total = unitPrice * quantity;
        const sumCantUnitPrice = unitPriceBase * quantity;

        console.log("[quotation][V3][labor][item]", {
          idQuotationItem,
          quantity,
          laborCostBase,
          laborValueAiu,
          unitPrice,
          total,
          sumCantUnitPrice,
        });

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          unitPrice: currencyFormatter.format(unitPrice),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });
      // ─────────────────────────────────────────────────────────────────────────────

      // ─── TABLA 2: SUMINISTRO — cálculo con AIU (sin IVA en unitario) ────────────
      // Por cada ítem:
      //   totalValueAiu  = unitPriceBase * aiuFactor       (total con AIU)
      //   laborValueAiu  = laborCostBase * aiuFactor        (porción laboral con AIU)
      //   supplyValueAiu = totalValueAiu - laborValueAiu    (porción suministro con AIU)
      //   unitPrice      = supplyValueAiu / aiuFactor       (unitario suministro sin AIU)
      //   total          = unitPrice * quantity
      // Los totales globales llevan Administración, Imprevistos, Utilidad e IVA/Utilidad.
      const supplyItemsCalculated = rawItems.map((item: QuotationItem) => {
        const quantity = this.toNumber(item.quantity);
        const unitPriceBase = this.toNumber(item.unitPrice);
        const idQuotationItem = this.toNumber(item.idQuotationItem);
        const laborCostBase = laborCostByQuotationItem[idQuotationItem] ?? 0;
       

        const totalValueAiu = unitPriceBase * aiuFactor;
        // const laborValueAiu = laborCostBase * aiuFactor;
        const laborValueAiu = laborCostBase * 1.5 * aiuFactor;
        const supplyValueAiu = totalValueAiu - laborValueAiu;
        // const unitPrice = aiuFactor > 0 ? supplyValueAiu / aiuFactor : 0;
        const unitPrice = aiuFactor > 0 ? supplyValueAiu / 1.19 : 0;
        const total = unitPrice * quantity;

        console.log("[quotation][V3][supply][item]", {
          idQuotationItem,
          quantity,
          unitPriceBase,
          laborCostBase,
          totalValueAiu,
          laborValueAiu,
          supplyValueAiu,
          unitPrice,
          total,
        });

        return {
          item: item.item,
          technicalSpecification: item.technicalSpecification,
          unitMeasure: item.unitMeasure,
          quantity: String(parseInt(String(quantity))),
          unitPrice: currencyFormatter.format(unitPrice),
          total: currencyFormatter.format(total),
          rawTotal: total,
        };
      });
      // ─────────────────────────────────────────────────────────────────────────────

      // ─── TOTALES TABLA 1: MANO DE OBRA ───────────────────────────────────────────
      // Subtotal + Administración + Imprevistos + Utilidad + IVA(Utilidad)
      const laborUnitValueAIU = laborItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const laborAdministration = laborUnitValueAIU * administrationPercentage;
      const laborUnforeseen = laborUnitValueAIU * unforeseenPercentage;
      const laborUtility = laborUnitValueAIU * utilityPercentage;
      const laborVat = laborUtility * vatPercentage;
      const laborUnitValueAIUIncluded = laborUnitValueAIU + laborAdministration + laborUnforeseen + laborUtility + laborVat;

      // ─── TOTALES TABLA 2: SUMINISTRO ─────────────────────────────────────────────
      // Subtotal + IVA
      const supplyUnitValueAIU = supplyItemsCalculated.reduce((acc, item) => acc + item.rawTotal, 0);
      const supplyVat = supplyUnitValueAIU * vatPercentage;
      const supplyUnitValueAIUIncluded = supplyUnitValueAIU + supplyVat;

      // ─────────────────────────────────────────────────────────────────────────────

      const itemNames = rawItems.map((item: QuotationItem) => item.item).join(", ");
      const technicalSpecifications = rawItems.map((item: QuotationItem) => item.technicalSpecification).join(", ");

      const employeeDb = await this.employeeRepository.findById((quotation.data as any).idResponsable);
      if (employeeDb instanceof CustomError) {
        console.error(employeeDb);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get employee" });
      }

      const employee = employeeDb.toJSON();

      const firstTableLaborItems = laborItemsCalculated.map(({ rawTotal, ...item }) => item);
      const secondTableSupplyItems = supplyItemsCalculated.map(({ rawTotal, ...item }) => item);

      // ─── PAYLOAD PARA PLANTILLA DOCX ─────────────────────────────────────────────
      // items      → filas de TABLA 1 (Mano de obra)
      // itemsLabor → filas de TABLA 2 (Suministro)
      // unitValueAIU / administration / unforeseen / utility / vat / unitValueAIUIncluded
      //   → totales del pie de TABLA 1 (Mano de obra)
      // unitValueAIULabor / vatLabor / unitValueAIUIncludedLabor
      //   → totales del pie de TABLA 2 (Suministro)
      const response = {
        items: firstTableLaborItems,
        itemsLabor: secondTableSupplyItems,
        client: (quotation.data as any)?.client ?? "",
        itemNames,
        policy: (quotation.data as any)?.policy ?? "",
        quotationName: (quotation.data as any)?.name ?? "",
        executionTime: (quotation.data as any)?.executionTime ?? "",
        advance: (quotation.data as any)?.advance ?? "",
        cuts: (quotation.data as any)?.advance ? 100 - parseInt((quotation.data as any)?.advance) : "",
        technicalSpecifications,
        employeeName: employee.User.firstName + " " + employee.User.lastName,
        employeeEmail: employee.User.email,
        technicalCondition: (quotation.data as any)?.technicalCondition ?? "",
        employeePosition: employee.Position.position,
        date: formatDate(new Date().toISOString().split("T")[0]),
        dateUntil: formatDate(getNextMonth(new Date().toISOString().split("T")[0])),
        consecutive: (quotation.data as any)?.consecutive ?? "",
        project: (quotation.data as any)?.projectName ?? "",
        // Totales TABLA 1 — Mano de obra (con AIU)
        unitValueAIU: currencyFormatter.format(laborUnitValueAIU),
        administration: currencyFormatter.format(laborAdministration),
        unforeseen: currencyFormatter.format(laborUnforeseen),
        utility: currencyFormatter.format(laborUtility),
        vat: currencyFormatter.format(laborVat),
        unitValueAIUIncluded: currencyFormatter.format(laborUnitValueAIUIncluded),
        
        // Totales TABLA 2 — Suministro (solo IVA)
        unitValueAIULabor: currencyFormatter.format(supplyUnitValueAIU),
        vatLabor: currencyFormatter.format(supplyVat),
        unitValueAIUIncludedLabor: currencyFormatter.format(supplyUnitValueAIUIncluded),

      };
      // ─────────────────────────────────────────────────────────────────────────────

      doc.render(response);
      return doc.getZip().generate({ type: "nodebuffer" });
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get supply and labor quotation report" });
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

      const commentsMap = comments.rows
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .reduce((acc, comment) => {
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
          advance: quotation.advance,
          documentUrl: quotation.documentUrl,
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

  updateQuotation = async (quotationData: dtos.UpdateQuotationDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      const quotation = await this.quotationRepository.findById(quotationData.idQuotation);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }

      if (filePath && quotation.documentUrl) {
        const identifier = new URL(quotation.documentUrl).pathname.split("/").pop();
        const deleted = await deleteFile(identifier!, "order");
        if (deleted instanceof CustomError) {
          console.error(deleted);
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: deleted.message });
        }
      }

      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        await uploadFile(filePath, identifier, contentType, "order");
        quotation.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.pdf`;
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
    const transaction = await dbConnection.transaction();
    try {
      const quotation = await this.quotationRepository.findById(idQuotation);
      if (!quotation) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation not found" });
      }

      const [
        quotationItems,
        quotationItemDetails,
        quotationAdditionalCost,
        quotationPercentage
      ] = await Promise.all([
        this.quotationRepository.findAllQuotationItem({ idQuotation }, -1, 0),
        this.quotationRepository.findQuotationDetailItemsByIdQuotation(idQuotation),
        this.quotationRepository.findQuotationAdditionalCostByQuotationId(idQuotation),
        this.quotationRepository.findQuotationPercentageByQuotationId(idQuotation),
      ]);

      await Promise.all([
        ...quotationItems.rows.map(item => item.destroy({ transaction })),
        ...(quotationItemDetails ? quotationItemDetails.map(itemDetail => itemDetail.destroy({ transaction })) : []),
        quotationAdditionalCost?.destroy({ transaction }),
        quotationPercentage?.destroy({ transaction }),
      ]);

      await quotation.destroy({ transaction });
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Quotation deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting quotation:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to delete quotation" });
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

      quotationItemData.total = unitPrice ? String(parseFloat(quantity) * parseFloat(unitPrice)) : "";

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
    const transaction = await dbConnection.transaction();
    try {
      const quotationItem = await this.quotationRepository.findQuotationItemById(idQuotationItem);
      if (!quotationItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }
      const quotationItemDetails = await this.quotationRepository.findQuotationItemDetailByQuotationItemId(idQuotationItem);
      if (!quotationItemDetails) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item details not found" });
      }

      await Promise.all(quotationItemDetails.map(itemDetail => itemDetail.destroy({ transaction })));
      await quotationItem.destroy({ transaction });
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Quotation item deleted successfully" });

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
      const quotationItemDetails = await this.quotationRepository.findAllQuotationItemDetail(filter, limit, offset);
      if (quotationItemDetails instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: quotationItemDetails.message });
      }

      if (request.idQuotation) {
        const quotationItems = new Map<number, { QuotationItem: any; QuotationItemDetails: any[] }>();

        quotationItemDetails.rows.forEach((itemDetail) => {
          const idQuotationItem = itemDetail.idQuotationItem;

          if (!quotationItems.has(idQuotationItem)) {
            quotationItems.set(idQuotationItem, {
              QuotationItem: itemDetail.toJSON().QuotationItem,
              QuotationItemDetails: [],
            });
          }

          quotationItems.get(idQuotationItem)!.QuotationItemDetails.push({
            idQuotationItemDetail: itemDetail.idQuotationItemDetail,
            idQuotationItem: itemDetail.idQuotationItem,
            idInput: itemDetail.idInput,
            quantity: itemDetail.quantity,
            performance: itemDetail.performance,
            cost: itemDetail.cost,
            totalCost: itemDetail.totalCost,
            Input: itemDetail.toJSON().Input,
          });
        });

        const rows = Array.from(quotationItems.values());

        const response = {
          data: rows,
          totalItems: rows.length,
          currentPage: page,
          totalPages: Math.ceil(rows.length / pageSize),
        };

        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          response
        );
      }

      const totalCost = quotationItemDetails.rows.reduce((acc, item) => acc + parseFloat(item.totalCost), 0);
      const response = {
        data: quotationItemDetails.rows,
        totalCost: totalCost.toFixed(2),
        totalItems: quotationItemDetails.count,
        currentPage: page,
        totalPages: Math.ceil(quotationItemDetails.count / pageSize),
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

      if (!request.performance || !request.price) {
        request.performance = input.performance;
        request.price = input.cost;
      }

      const data = {
        idQuotationItem: request.idQuotationItem,
        idInput: request.idInput,
        cost: request.price,
        performance: request.performance,
        quantity: Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(request.performance)),
        totalCost: parseFloat((parseFloat(request.price) * Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(request.performance))).toFixed(2)),
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
      if (!quotationItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Quotation item not found" });
      }

      if (quotationItemDetailData.idInput) {
        const input = await Input.findOne({ where: { idInput: quotationItemDetailData.idInput } });
        if (!input) {
          return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Input not found" });
        }

        if (!quotationItemDetailData.performance || !quotationItemDetailData.price) {
          quotationItemDetailData.performance = input.performance;
          quotationItemDetailData.price = input.cost;
        }
      }

      const quantity = String(Math.ceil(parseFloat(quotationItem.quantity) / parseFloat(quotationItemDetailData.performance ?? quotationItemDetail.performance)));
      quotationItemDetailData.totalCost =
        String(Math.ceil(parseInt(quotationItemDetailData.price ?? quotationItemDetail.cost) * parseFloat(quantity)));
      quotationItemDetailData.quantity = quantity;

      const data = {
        idQuotationItemDetail: quotationItemDetailData.idQuotationItemDetail,
        idQuotationItem: quotationItemDetail.idQuotationItem,
        idInput: quotationItemDetailData.idInput ?? quotationItemDetail.idInput,
        quantity: quotationItemDetailData.quantity,
        performance: quotationItemDetailData.performance ?? quotationItemDetail.performance,
        cost: quotationItemDetailData.price ?? quotationItemDetail.cost,
        totalCost: quotationItemDetailData.totalCost,
      };

      const [updatedCount, updatedQuotationItemDetails] = await this.quotationRepository.updateQuotationItemDetail(data);
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
      console.error(quotationAdditionalCost);
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
      const persistedQuotationComment = await this.quotationRepository.findQuotationCommentById(quotationComment.idQuotationComment);

      if (!persistedQuotationComment) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
          message: "Quotation comment was created but could not be reloaded",
        });
      }

      if (persistedQuotationComment.idUser !== quotationCommentData.idUser) {
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
          message: "idUser was not persisted in database",
          expectedIdUser: quotationCommentData.idUser,
          persistedIdUser: persistedQuotationComment.idUser,
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, persistedQuotationComment);
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

  /**
   * Retrieve raw quotations without associations
   */
  findAllRawQuotations = async (): Promise<ResponseEntity> => {
    try {
      const quotations = await this.quotationRepository.findAllRaw();
      const data = quotations.map((q) => q.toJSON());
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to get raw quotations" });
    }
  };

  private buildQuotationComment = (quotationComment: QuotationComment, quotationCommentData: dtos.UpdateQuotationCommentDTO) => {
    quotationComment.idQuotation = quotationCommentData.idQuotation ?? quotationComment.idQuotation;
    quotationComment.idEmployee = quotationCommentData.idEmployee ?? quotationComment.idEmployee;
    quotationComment.idUser = quotationCommentData.idUser ?? quotationComment.idUser;
    quotationComment.comment = quotationCommentData.comment ?? quotationComment.comment;
    quotationComment.createdAt = quotationCommentData.createdAt ?? quotationComment.createdAt;
    return quotationComment;
  };

  private replaceSecondTablePlaceholders = (documentXml: string): string => {
    let updatedXml = documentXml;

    updatedXml = this.replaceNthOccurrence(updatedXml, "{{#items}}{{item}}", "{{#itemsLabor}}{{item}}", 2);
    updatedXml = this.replaceNthOccurrence(updatedXml, "{{total}}{{/items}}", "{{total}}{{/itemsLabor}}", 2);
    updatedXml = this.replaceNthOccurrence(updatedXml, "{{unitValueAIU}}", "{{unitValueAIULabor}}", 2);
    updatedXml = this.replaceNthOccurrence(updatedXml, "{{vat}}", "{{vatLabor}}", 2);
    updatedXml = this.replaceNthOccurrence(updatedXml, "{{unitValueAIUIncluded}}", "{{unitValueAIUIncludedLabor}}", 2);

    return updatedXml;
  };

  private replaceNthOccurrence = (source: string, search: string, replacement: string, occurrence: number): string => {
    let fromIndex = 0;
    let foundAt = -1;

    for (let count = 0; count < occurrence; count++) {
      foundAt = source.indexOf(search, fromIndex);
      if (foundAt === -1) {
        return source;
      }
      fromIndex = foundAt + search.length;
    }

    return source.slice(0, foundAt) + replacement + source.slice(foundAt + search.length);
  };

  private toNumber = (value: unknown): number => {
    const parsed = parseFloat(String(value ?? 0));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  private toRate = (value: unknown): number => {
    const numeric = this.toNumber(value);
    return numeric > 1 ? numeric / 100 : numeric;
  };

  private buildQuotation = (quotation: Quotation, quotationData: dtos.UpdateQuotationDTO) => {
    quotation.name = quotationData.name ?? quotation.name;
    quotation.client = quotationData.client ?? quotation.client;
    quotation.builder = quotationData.client ?? quotation.client;
    quotation.idResponsable = quotationData.idResponsable ?? quotation.idResponsable;
    quotation.policy = quotationData.policy ?? quotation.policy;
    quotation.executionTime = quotationData.executionTime ?? quotation.executionTime;
    quotation.advance = quotationData.advance ?? quotation.advance;
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
    if (filter.name) {
      where = {
        ...where,
        projectName: sequelize.where(sequelize.col("projectName"), "LIKE", `%${filter.name}%`),
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
    if (filter.idQuotation) {
      where = {
        ...where,
        idQuotation: sequelize.where(sequelize.col("QuotationItem.Quotation.idQuotation"), "=", `${filter.idQuotation}`),
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

      // Normaliza porcentajes: soporta formato decimal (0.10) y entero (10).
      const taxRate = this.toRate(additionalCosts.tax);
      const policyRate = this.toRate(additionalCosts.policy);
      const commisionRate = this.toRate(additionalCosts.commision);
      const pettyCashRate = this.toRate(additionalCosts.pettyCash);
      const utilityRate = this.toRate(additionalCosts.utility);

      const otherCost = {
        impuesto: taxRate * total * 1.5390,
        poliza: policyRate * total * 1.5390,
        comision: commisionRate * total * 1.3317,
        caja_menor: pettyCashRate * total * 1.5390,
        sisos: additionalCosts.sisoValue,
        perDiem: additionalCosts.perDiem,
        utility: utilityRate
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

      percentage.administration = this.toRate(percentage.administration);
      percentage.unforeseen = this.toRate(percentage.unforeseen);
      percentage.utility = this.toRate(percentage.utility);
      percentage.vat = this.toRate(percentage.vat);

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
      // const directCost = summaryByItem.reduce((acc, item) => acc + item.totalCost, 0);

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
