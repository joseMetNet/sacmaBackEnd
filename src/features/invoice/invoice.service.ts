import { InvoiceRepository } from "./invoice.repository";
import { CreateInvoiceDTO, FindAllDTO, UpdateInvoiceDTO } from "./invoice.schema";
import { ResponseEntity } from "../employee/interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";

export class InvoiceService {
  private readonly invoiceRepository: InvoiceRepository;

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  create = async (invoiceData: CreateInvoiceDTO): Promise<ResponseEntity> => {
    try {
      const response = await this.invoiceRepository.create(invoiceData);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
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
    catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
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
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  update = async (invoiceData: UpdateInvoiceDTO): Promise<ResponseEntity> => {
    try {
      const invoice = await this.invoiceRepository.findById(invoiceData.idInvoice);
      if (!invoice) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Invoice not found" }
        );
      }

      const [, [updatedInvoice]] = await this.invoiceRepository.update(invoiceData);
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        updatedInvoice
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const response = await this.invoiceRepository.delete(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { deleted: response > 0 });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  findAllInvoiceStatus = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.invoiceRepository.findAllInvoiceStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  private buildFindAllFilter(request: FindAllDTO): { [key: string]: any } {
    const filter: { [key: string]: any } = {};

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