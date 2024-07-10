import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { createProviderSchema, findAllProviderSchema, providerIdSchema, providerProviderDocumentSchema, updateProviderSchema } from "./provider.schema";
import { StatusCode, StatusValue } from "../interfaces";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../controllers/utils";

class ProviderController {
  async findAll(req: Request, res: Response): Promise<void> {
    const request = findAllProviderSchema.safeParse(req.query);
    if(!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
        return;
    }
    const response = await providerService.findAll(request.data);
    res
      .status(response.code)
      .json({status: response.status, data: response.data});
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const request = providerIdSchema.safeParse(req.params);
      if(!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
        return;
      }
      const response = await providerService.findById(request.data.id);
      res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request = createProviderSchema.safeParse(req.body);
      if(!request.success) {
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
      const response = await providerService.create(request.data, filePath);
      res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const request = updateProviderSchema.safeParse(req.body);
      if(!request.success) {
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
      const response = await providerService.update(request.data, filePath);
      res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const request = providerIdSchema.safeParse(req.params);
      if(!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
          return;
      }
      const response = await providerService.delete(request.data.id);
      res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findDocumentTypes(req: Request, res: Response): Promise<void>{
    try {
      const response = await providerService.findDocumentTypes();
      res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async uploadRequiredDocument(req: Request, res: Response): Promise<void> {
    const request = providerProviderDocumentSchema.safeParse(req.body);
    if(!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    if(!req.files || !req.files.document) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: "Document is required" },
        });
      return;
    }
    const documentPath = (req.files.document as UploadedFile).tempFilePath;
    const response = await providerService.uploadDocument(request.data, documentPath);
    res.status(response.code)
      .json({ status: response.status, data: response.data });
  }
}

const providerController = new ProviderController();
export { providerController };