import { Request, Response } from "express";
import { supplierService } from "./supplier.service";
import { createSupplierSchema, findAllSupplierSchema, supplierIdSchema, supplierSupplierDocumentSchema, updateSupplierSchema } from "./supplier.schema";
import { StatusCode, StatusValue } from "../interfaces";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../controllers/utils";

class SupplierController {
  async findAll(req: Request, res: Response): Promise<void> {
    const request = findAllSupplierSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await supplierService.findAll(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const request = supplierIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await supplierService.findById(request.data.id);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      req.body.contactInfo = JSON.parse(req.body.contactInfo);
      const request = createSupplierSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const filePath = req.files
        ? (req.files.imageProfile as UploadedFile).tempFilePath
        : undefined;
      request.data.imageProfile = filePath;
      request.data.contactInfo = request.data.contactInfo?.filter(contact => contact != null);
      const response = await supplierService.create(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    if(req.body.contactInfo) {
      req.body.contactInfo = JSON.parse(req.body.contactInfo);
    }
    try {
      const request = updateSupplierSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const filePath = req.files
        ? (req.files.imageProfile as UploadedFile).tempFilePath
        : undefined;
      const response = await supplierService.update(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }


  async download(req: Request, res: Response): Promise<void> {
    try {
      const buffer = await supplierService.download();
      res.setHeader("Content-Disposition", "attachment; filename=\"proveedores.xlsx\"");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.end(buffer, "binary");

    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const request = supplierIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await supplierService.delete(request.data.id);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findDocumentTypes(req: Request, res: Response): Promise<void> {
    try {
      const response = await supplierService.findDocumentTypes();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findAccountTypes(req: Request, res: Response): Promise<void> {
    try {
      const response = await supplierService.findAccountTypes();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async uploadRequiredDocument(req: Request, res: Response): Promise<void> {
    const request = supplierSupplierDocumentSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    if (!req.files || !req.files.document) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: "Document is required" },
        });
      return;
    }
    const documentPath = (req.files.document as UploadedFile).tempFilePath;
    const response = await supplierService.uploadDocument(request.data, documentPath);
    res.status(response.code)
      .json({ status: response.status, data: response.data });
  }
}

const supplierController = new SupplierController();
export { supplierController };