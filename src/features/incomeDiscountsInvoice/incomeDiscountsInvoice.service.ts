import { IncomeDiscountInvoiceRepository } from "./incomeDiscountsInvoice.repository";
import { ResponseEntity } from "../employee/interface";
import { BuildResponse } from "../../utils/build-response";
import { findPagination, StatusCode } from "../../utils/general.interfase";
import * as types from "./incomeDiscountsInvoice.interface";
import * as schemas from "./incomeDiscountsInvoice.schema";

export class IncomeDiscountInvoiceService {
  private readonly incomeDiscountInvoiceRepository: IncomeDiscountInvoiceRepository;

  constructor(incomeDiscountInvoiceRepository: IncomeDiscountInvoiceRepository) {
    this.incomeDiscountInvoiceRepository = incomeDiscountInvoiceRepository;
  }

  findAll = async (request: schemas.FindAllIncomeDiscountInvoiceSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination({
        page: request.page ? parseInt(request.page) : undefined,
        pageSize: request.pageSize ? parseInt(request.pageSize) : undefined,
      });
      const filter = this.buildFilter(request);

      const incomeDiscountInvoices = await this.incomeDiscountInvoiceRepository.findAll(limit, offset, filter);

      const response = {
        data: incomeDiscountInvoices.rows,
        totalItems: incomeDiscountInvoices.count,
        currentPage: page,
        totalPage: Math.ceil(incomeDiscountInvoices.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all income discount invoices", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to find all income discount invoices",
      });
    }
  };

  findById = async (idIncome: number): Promise<ResponseEntity> => {
    try {
      const incomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);
      
      if (!incomeDiscountInvoice) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Income discount invoice not found",
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, incomeDiscountInvoice);
    } catch (error) {
      console.error("An error occurred while trying to find income discount invoice by id", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to find income discount invoice by id",
      });
    }
  };

  create = async (request: schemas.CreateIncomeDiscountInvoiceSchema): Promise<ResponseEntity> => {
    try {
      const createData = {
        ...request,
        // Si no se proporciona refundRequestDate, usar la fecha actual
        refundRequestDate: request.refundRequestDate 
          ? new Date(request.refundRequestDate) 
          : new Date(), // Fecha actual por defecto
      };
      
      const newIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.create(createData);

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newIncomeDiscountInvoice);
    } catch (error) {
      console.error("An error occurred while trying to create income discount invoice", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to create income discount invoice",
      });
    }
  };

  update = async (request: schemas.UpdateIncomeDiscountInvoiceSchema): Promise<ResponseEntity> => {
    try {
      const { idIncome, ...updateData } = request;

      const existingIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);
      
      if (!existingIncomeDiscountInvoice) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Income discount invoice not found",
        });
      }

      const updateDataProcessed = {
        ...updateData,
        refundRequestDate: updateData.refundRequestDate ? new Date(updateData.refundRequestDate) : undefined,
      };

      await this.incomeDiscountInvoiceRepository.updateByIdIncome(idIncome, updateDataProcessed);

      const updatedIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedIncomeDiscountInvoice!);
    } catch (error) {
      console.error("An error occurred while trying to update income discount invoice", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to update income discount invoice",
      });
    }
  };

  delete = async (idIncome: number): Promise<ResponseEntity> => {
    try {
      const existingIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);
      
      if (!existingIncomeDiscountInvoice) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Income discount invoice not found",
        });
      }

      await this.incomeDiscountInvoiceRepository.deleteByIdIncome(idIncome);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Income discount invoice deleted successfully",
      });
    } catch (error) {
      console.error("An error occurred while trying to delete income discount invoice", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to delete income discount invoice",
      });
    }
  };

  softDelete = async (idIncome: number): Promise<ResponseEntity> => {
    try {
      const existingIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);
      
      if (!existingIncomeDiscountInvoice) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Income discount invoice not found",
        });
      }

      await this.incomeDiscountInvoiceRepository.softDeleteByIdIncome(idIncome);

      // Después del soft delete, usar findByIdIncomeAny para obtener el registro inactivo
      const updatedIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findByIdIncomeAny(idIncome);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedIncomeDiscountInvoice!);
    } catch (error) {
      console.error("An error occurred while trying to soft delete income discount invoice", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to soft delete income discount invoice",
      });
    }
  };

  restore = async (idIncome: number): Promise<ResponseEntity> => {
    try {
      // Para restore, buscamos sin filtro de isActive porque queremos encontrar registros inactivos
      const existingIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findByIdIncomeAny(idIncome);
      
      if (!existingIncomeDiscountInvoice) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Income discount invoice not found",
        });
      }

      await this.incomeDiscountInvoiceRepository.restoreByIdIncome(idIncome);

      const restoredIncomeDiscountInvoice = await this.incomeDiscountInvoiceRepository.findById(idIncome);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, restoredIncomeDiscountInvoice!);
    } catch (error) {
      console.error("An error occurred while trying to restore income discount invoice", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to restore income discount invoice",
      });
    }
  };

  private buildFilter = (request: schemas.FindAllIncomeDiscountInvoiceSchema): { [key: string]: any } => {
    const filter: { [key: string]: any } = {};

    if (request.idIncomeDiscountInvoice) {
      filter.idIncomeDiscountInvoice = parseInt(request.idIncomeDiscountInvoice);
    }

    if (request.idExpenditureType) {
      filter.idExpenditureType = parseInt(request.idExpenditureType);
    }

    if (request.idCostCenterProject) {
      filter.idCostCenterProject = parseInt(request.idCostCenterProject);
    }

    if (request.idInvoice) {
      filter.idInvoice = parseInt(request.idInvoice);
    }

    if (request.refundRequestDate) {
      filter.refundRequestDate = request.refundRequestDate;
    }

    if (request.isActive !== undefined) {
      filter.isActive = request.isActive === "true";
    }

    return filter;
  };
}