import { Request, Response } from "express";
import * as schemas from "./work-tracking.schema";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { WorkTrackingService } from "./work-tracking.service";
import { CustomError } from "../../utils";
import { formatZodError } from "../employee/utils";

export class WorkTrackingController {
  private readonly workTrackingService: WorkTrackingService;

  constructor(workTrackingService: WorkTrackingService) {
    this.workTrackingService = workTrackingService;
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAll.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.findAll(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  findWorkTrackingByEmployee = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllByEmployee.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.findWorkTrackingByEmployee(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  findAllByEmployee = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllByEmployee.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.findAllByEmployee(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  findDailyWorkTrackingByEmployee = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findDailyWorkTrackingByEmployee.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.findDailyWorkTrackingByEmployee(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  findAllWorkHour = async (req: Request, res: Response): Promise<void> => {
    const response = await this.workTrackingService.findAllWorkHour();
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWorkTracking.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.findById(request.data.idWorkTracking);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createWorkTracking.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.create(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  generateReport = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.generateReport.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.generateReport(request.data);
    if (response instanceof CustomError) {
      res
        .status(response.statusCode)
        .json({
          status: StatusValue.Failed,
          data: response.message
        });
      return;
    }
    res.setHeader("Content-Disposition", "attachment; filename=\"resumen.xlsx\"");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.end(response, "binary");
  };

  createAll = async (req: Request, res: Response): Promise<void> => {
    let workTrackingArray;
    try {
      const jsonString = req.body.workTracking.replace(/,\s*$/, "");
      workTrackingArray = JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON format", error);
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: "Invalid JSON format" }
        });
      return;
    }

    const workTracking = workTrackingArray.map((item: any) => {
      return {
        idEmployee: item.idEmployee,
        idCostCenterProject: item.idCostCenterProject,
        hoursWorked: item.hoursWorked,
        overtimeHour: item?.overtimeHour,
        idNovelty: item?.idNovelty,
        createdAt: item?.createdAt
      };
    });

    const request = schemas.createWorkTrackingArray.safeParse(workTracking);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.createAll(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateWorkTracking.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.update(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  updateAll = async (req: Request, res: Response): Promise<void> => {
    let workTrackingArray;
    try {
      const jsonString = req.body.workTracking.replace(/,\s*$/, "");
      workTrackingArray = JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON format", error);
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: "Invalid JSON format" }
        });
      return;
    }

    const workTracking = workTrackingArray.map((item: any) => {
      return {
        idWorkTracking: item.idWorkTracking,
        idEmployee: item.idEmployee,
        idCostCenterProject: item.idCostCenterProject,
        hoursWorked: item.hoursWorked,
        overtimeHour: item?.overtimeHour,
        idNovelty: item?.idNovelty,
        createdAt: item?.createdAt
      };
    });

    const request = schemas.updateWorkTrackingArray.safeParse(workTracking);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.updateAll(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.deleteWorkTracking.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.delete(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idWorkTracking.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
      return;
    }
    const response = await this.workTrackingService.deleteById(request.data);
    res
      .status(response.code)
      .json({
        status: response.status,
        data: response.data
      });
  };

}