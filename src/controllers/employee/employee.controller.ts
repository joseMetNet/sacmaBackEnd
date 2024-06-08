import { ZodError } from "zod";
import { StatusCode, StatusValue } from "../../interfaces";
import { formatZodError } from "../utils";
import { Request, Response } from "express";
import { employeeService } from "../../services";
import { employeeRequestSchema, updateEmployeeSchema } from "./employee.schema";

class EmployeeController {

  private handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({ 
      status: StatusValue.Failed, 
      data: { error: formatZodError(error) } 
    });
  };

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  async findEmployeeAndRoles(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findEmployeeAndRoles();

    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async findEmployee(req: Request, res: Response): Promise<void> {
    const request = employeeRequestSchema.safeParse(req.query);
    if(!request.success){
      res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: formatZodError(request.error)}});
      return;
    }

    const response = await employeeService.findEmployees(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    const request = updateEmployeeSchema.safeParse(req.body);
    if(!request.success){
      res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: formatZodError(request.error)}});
      return;
    }

    const response = await employeeService.updateEmployee(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }
}

export const employeeController = new EmployeeController();
