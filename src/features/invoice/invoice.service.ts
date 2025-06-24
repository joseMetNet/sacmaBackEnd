import { InvoiceRepository } from "./invoice.repository";
import { CreateInvoiceDTO, FindAllDTO, UpdateInvoiceDTO } from "./invoice.schema";
import { ResponseEntity } from "../employee/interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { CustomError, uploadFile } from "../../utils";
import crypto from "crypto";

export class InvoiceService {
  private readonly invoiceRepository: InvoiceRepository;

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  create = async (invoiceData: CreateInvoiceDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      let documentUrl = undefined;
      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        const response = await uploadFile(filePath, identifier, contentType, "invoice");
        if (response instanceof CustomError) {
          console.error(response);
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to upload document" });
        }
        documentUrl = `https://sacmaback.blob.core.windows.net/invoice/${identifier}.pdf`;
      }

      const invoicePayload = {
        ...invoiceData,
        documentUrl
      };

      const response = await this.invoiceRepository.create(invoicePayload);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const data = await this.invoiceRepository.findById(id);
      if (!data) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Invoice not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  findAll = async (request: FindAllDTO): Promise<ResponseEntity> => {
    try {
      const filter = this.buildFindAllFilter(request);
      const { limit, offset } = this.getPagination(request);

      const data = await this.invoiceRepository.findAll(
        filter,
        limit,
        offset
      );

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        rows: data.rows,
        count: data.count,
        page: request.page || 0,
        pageSize: request.pageSize || 10
      });
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  update = async (invoiceData: UpdateInvoiceDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      const invoice = await this.invoiceRepository.findById(invoiceData.idInvoice);
      if (!invoice) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Invoice not found" }
        );
      }

      let documentUrl = invoiceData.documentUrl;
      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        const response = await uploadFile(filePath, identifier, contentType, "invoice");
        if (response instanceof CustomError) {
          console.error(response);
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to upload document" });
        }
        documentUrl = `https://sacmaback.blob.core.windows.net/invoice/${identifier}.pdf`;
      }

      const updatePayload = {
        ...invoiceData,
        documentUrl
      };

      const [, [updatedInvoice]] = await this.invoiceRepository.update(updatePayload);
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        updatedInvoice
      );
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const response = await this.invoiceRepository.delete(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { deleted: response > 0 });
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  findAllInvoiceStatus = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.invoiceRepository.findAllInvoiceStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  private buildFindAllFilter(request: FindAllDTO): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (request.idCostCenterProject) {
      filter.idCostCenterProject = request.idCostCenterProject;
    }

    if (request.idInvoiceStatus) {
      filter.idInvoiceStatus = request.idInvoiceStatus;
    }

    return filter;
  }

  private getPagination = (request: { page?: number, pageSize?: number }) => {
    const page = request.page || 0;
    const pageSize = request.pageSize || 10;
    const limit = pageSize;
    const offset = page * pageSize;
    return { limit, offset };
  };
}

export const invoiceService = new InvoiceService(new InvoiceRepository()); 