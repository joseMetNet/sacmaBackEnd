import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { createProviderSchema, findAllProviderSchema, providerIdSchema, updateProviderSchema } from "./provider.schema";
import { StatusCode } from "../interfaces";
import { UploadedFile } from "express-fileupload";

class ProviderController {
  async findAll(req: Request, res: Response) {
    const request = findAllProviderSchema.safeParse(req.query);
    if(!request.success) {
      return res
      .status(StatusCode.BadRequest)
      .json({ message: request.error.message });
    }
    const response = await providerService.findAll(request.data);
    return res
      .status(response.code)
      .json({status: response.status, data: response.data});
  }

  async findById(req: Request, res: Response) {
    try {
      const request = providerIdSchema.safeParse(req.params);
      if(!request.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: request.error.message });
      }
      const response = await providerService.findById(request.data.id);
      return res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      return res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const request = createProviderSchema.safeParse(req.body);
      if(!request.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: request.error });
      }
      const filePath = req.files
        ? (req.files.imageProfile as UploadedFile).tempFilePath
        : undefined;
      request.data.imageProfile = filePath;
      const response = await providerService.create(request.data, filePath);
      return res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      return res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const request = updateProviderSchema.safeParse(req.body);
      if(!request.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: request.error });
      }
      const filePath = req.files
        ? (req.files.imageProfile as UploadedFile).tempFilePath
        : undefined;
      const response = await providerService.update(request.data, filePath);
      return res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      return res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const request = providerIdSchema.safeParse(req.params);
      if(!request.success) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: request.error.message });
      }
      const response = await providerService.delete(request.data.id);
      return res
        .status(response.code)
        .json({status: response.status, data: response.data});
    }catch(err: any) {
      return res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }
}

const providerController = new ProviderController();
export { providerController };