import { InvoiceService } from "./invoice.service";
import * as schemas from "./invoice.schema";
import { Request, Response } from "express";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { formatZodError } from "../employee/utils";
import { UploadedFile } from "express-fileupload";

export class InvoiceController {
  private readonly invoiceService: InvoiceService;

  constructor(invoiceService: InvoiceService) {
    this.invoiceService = invoiceService;
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAll.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await this.invoiceService.findAll(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = schemas.idInvoice.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await this.invoiceService.findById(request.data.idInvoice);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: unknown) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = schemas.createInvoice.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }

      const document = req.files
        ? (req.files.document as UploadedFile)
        : undefined;

      const filePath = document ? document.tempFilePath : undefined;
      const response = await this.invoiceService.create(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: unknown) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = schemas.updateInvoice.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }

      const document = req.files
        ? (req.files.document as UploadedFile)
        : undefined;

      const filePath = document ? document.tempFilePath : undefined;
      const response = await this.invoiceService.update(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: unknown) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = schemas.idInvoice.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await this.invoiceService.delete(request.data.idInvoice);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: unknown) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  findAllInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.invoiceService.findAllInvoiceStatus();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: unknown) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err instanceof Error ? err.message : "Unknown error" });
    }
  };
}