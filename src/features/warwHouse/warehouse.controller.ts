import { Request, Response } from "express";
import { WareHouseService } from "./warehouse.service";
import * as schemas from "./warehouse.schema";
import { formatZodError } from "../employee/utils";
import { StatusCode, StatusValue } from "../../utils/general.interfase";

export class WareHouseController {
  private readonly wareHouseService: WareHouseService;
  
  constructor(wareHouseService: WareHouseService) {
    this.wareHouseService = wareHouseService;
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllWareHouseSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.findAll(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWareHouseSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.findById(request.data.idWarehouse);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createWareHouseSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.create(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const paramsRequest = schemas.idWareHouseSchema.safeParse(req.params);
    const bodyRequest = schemas.updateWareHouseSchema.safeParse({
      ...req.body,
      idWarehouse: paramsRequest.success ? paramsRequest.data.idWarehouse : parseInt(req.params.idWarehouse),
    });

    if (!paramsRequest.success || !bodyRequest.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: [...(paramsRequest.error?.errors || []), ...(bodyRequest.error?.errors || [])] }
      });
      return;
    }

    const response = await this.wareHouseService.update(bodyRequest.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWareHouseSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.delete(request.data.idWarehouse);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  softDelete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWareHouseSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.softDelete(request.data.idWarehouse);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  restore = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWareHouseSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.wareHouseService.restore(request.data.idWarehouse);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}