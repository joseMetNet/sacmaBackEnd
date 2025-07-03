import { InvoiceRepository } from "./invoice.repository";
import { CreateInvoiceDTO, FindAllDTO, UpdateInvoiceDTO } from "./invoice.schema";
import { ResponseEntity } from "../employee/interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { CustomError, deleteFile, uploadFile } from "../../utils";
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
        documentUrl,
        idInvoiceStatus: 1  // Default value for new invoices
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

      // Calculate totalValue for this invoice
      const totalValue = await this.invoiceRepository.calculateTotalValueByContract(data.contract);
      const invoiceWithTotalValue = {
        ...data.toJSON(),
        totalValue
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, invoiceWithTotalValue);
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

      // Calculate totalValue for each invoice
      const rowsWithTotalValue = await Promise.all(
        data.rows.map(async (invoice: any) => {
          const totalValue = await this.invoiceRepository.calculateTotalValueByContract(invoice.contract);
          return {
            ...invoice.toJSON(),
            totalValue
          };
        })
      );

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        rows: rowsWithTotalValue,
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
        // if documentUrl is provided, remove the old file
        if (documentUrl) {
          const oldIdentifier = documentUrl.split("/").pop()?.split(".")[0];
          if (oldIdentifier) {
            const oldFilePath = `invoice/${oldIdentifier}.pdf`;
            const deleteResponse = await deleteFile(oldFilePath, "invoice");
            if (deleteResponse instanceof CustomError) {
              console.error(deleteResponse);
              return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to delete old document" });
            }
          }
        }
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