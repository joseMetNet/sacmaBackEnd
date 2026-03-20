import { Request, Response } from "express";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { formatZodError } from "../employee/utils";
import { ReportsService } from "./reports.service";
import * as schemas from "./reports.schema";

export class ReportsController {
  private readonly reportsService: ReportsService;

  constructor(reportsService: ReportsService) {
    this.reportsService = reportsService;
  }

  getReportEmployees = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.getReportEmployees.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.reportsService.getReportEmployees(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  };
}
