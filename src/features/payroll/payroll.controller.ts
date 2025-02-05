import { ZodError } from "zod";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { Request, Response } from "express";
import * as schemas from "./payroll.schema";
import { UploadedFile } from "express-fileupload";
import { employeePayrollService } from "./payroll.service";
import { formatZodError } from "../employee/utils";

class EmployeePayrollController {
  private handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({
      status: StatusValue.Failed,
      data: { error: formatZodError(error) },
    });
  };

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.findAllPayrollSchema.safeParse(req.query);
      if (!request.success || !request.data) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await employeePayrollService.findAll(request.data);
      res.status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.idEmployeePayroll);
      const response = await employeePayrollService.findById(id);
      res.status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async uploadPayroll(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.uploadPayrollSchema.safeParse(req.body);
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
            data: { error: "Payroll document is required" },
          });
        return;
      }
      const payrollPath = (req.files.document as UploadedFile).tempFilePath;
      const response = await employeePayrollService.uploadPayroll(request.data, payrollPath);
      res.status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.findPayrollByIdSchema.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await employeePayrollService.deleteById(request.data.idEmployeePayroll);
      res.status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async updateById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.updatePayrollSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }

      const filePath = (req.files?.document as UploadedFile).tempFilePath ?? undefined;

      const response = await employeePayrollService.updateById(request.data, filePath);
      res.status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }
}

export const employeePayrollController = new EmployeePayrollController();
