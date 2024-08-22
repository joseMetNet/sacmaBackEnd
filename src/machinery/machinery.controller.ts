import { Request, Response } from "express";
import * as schemas from "./machinery.schema";
import { StatusCode, StatusValue } from "../interfaces";
import { formatZodError } from "../controllers/utils";
import { machineryService } from "./machinery.service";

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
}

const machineryController = new MachineryController();
export { machineryController };