import { costCenterService } from "./cost-center.service";
import * as schemas from "./cost-center.schema";
import { Request, Response } from "express";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../employee/utils";

class CostCenterController {
  async findAll(req: Request, res: Response): Promise<void> {
    const request = schemas.findAll.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await costCenterService.findAll(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findAllCostCenterContact(req: Request, res: Response): Promise<void> {
    const request = schemas.findAllCostCenterContact.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await costCenterService.findAllCostCenterContact(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findAllCostCenterProject(req: Request, res: Response): Promise<void> {
    const request = schemas.findAllCostCenterProject.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await costCenterService.findAllCostCenterProject(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idCostCenter.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.findById(request.data.idCostCenter);
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
      const buffer = await costCenterService.download();
      res.setHeader("Content-Disposition", "attachment; filename=\"centro-costo.xlsx\"");
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

  async findCostCenterContactById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idCostCenterContact.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.findCostCenterContactById(request.data.idCostCenterContact);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findCostCenterProjectById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idCostCenterProject.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.findCostCenterProjectById(request.data.idCostCenterProject);
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
      const request = schemas.idCostCenter.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.delete(request.data.idCostCenter);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async deleteCostCenterContact(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idCostCenterContact.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.deleteCostCenterContact(request.data.idCostCenterContact);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async deleteCostCenterProject(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idCostCenterProject.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.deleteCostCenterProject(request.data.idCostCenterProject);
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
      const request = schemas.createCostCenter.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const filePath = req.files
        ? (req.files.imageUrl as UploadedFile).tempFilePath
        : undefined;
      const response = await costCenterService.create(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async createCostCenterContact(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createCostCenterContact.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.createCostCenterContact(request.data);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async createCostCenterProject(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createCostCenterProject.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.createCostCenterProject(request.data);
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
      const request = schemas.updateCostCenter.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const filePath = req.files
        ? (req.files.imageUrl as UploadedFile).tempFilePath
        : undefined;
      const response = await costCenterService.update(request.data, filePath);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async updateCostCenterContact(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.updateCostCenterContact.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.updateCostCenterContact(request.data);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async updateCostCenterProject(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.updateCostCenterProject.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await costCenterService.updateCostCenterProject(request.data);
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

export const costCenterController = new CostCenterController();