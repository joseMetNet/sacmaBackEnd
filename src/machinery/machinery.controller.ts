import { Request, Response } from "express";
import * as schemas from "./machinery.schema";
import { StatusCode, StatusValue } from "../interfaces";
import { formatZodError } from "../controllers/utils";
import { machineryService } from "./machinery.service";
import { UploadedFile } from "express-fileupload";

class MachineryController {
  async findAll(req: Request, res: Response): Promise<void> {
    const request = schemas.findAllMachinerySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await machineryService.findAll(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findAllMachineryMaintenance(req: Request, res: Response): Promise<void> {
    const request = schemas.findAllMachinerySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await machineryService.findAllMachineryMaintenance(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findAllMachineryLocation(req: Request, res: Response): Promise<void> {
    const request = schemas.findAllMachinerySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await machineryService.findAllMachineryLocation(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.machineryIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await machineryService.findById(request.data.idMachinery);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.machineryIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await machineryService.delete(request.data.idMachinery);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }
  async deleteMachineryMaintenance(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.machineryMaintenanceIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await machineryService.deleteMachineryMaintenance(request.data.idMachineryMaintenance);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findMachineryType(req: Request, res: Response): Promise<void> {
    try {
      const response = await machineryService.findMachineryType();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async createMachinerLocationHistory(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createMachineryLocationSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await machineryService.createMachineryLocation(request.data);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findMachineryModel(req: Request, res: Response): Promise<void> {
    try {
      const response = await machineryService.findMachineryModel();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findMachineryBrand(req: Request, res: Response): Promise<void> {
    try {
      const response = await machineryService.findMachineryBrand();
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
      const buffer = await machineryService.download();
      res.setHeader("Content-Disposition", "attachment; filename=\"maquinaria.xlsx\"");
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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createMachinerySchema.safeParse(req.body);
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
      const response = await machineryService.create(request.data, filePath);
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
    try {
      const request = schemas.updateMachinerySchema.safeParse(req.body);
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
      const response = await machineryService.update(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async createMachineryMaintenance(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createMachineryMaintenanceSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const filePath = req.files
        ? (req.files.document as UploadedFile).tempFilePath
        : undefined;
      console.log(`filePath: ${filePath}`);
      const response = await machineryService.createMachineryMaintenance(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }
}

const machineryController = new MachineryController();
export { machineryController };