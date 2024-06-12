import { ZodError } from "zod";
import { StatusCode, StatusValue } from "../../interfaces";
import { formatZodError } from "../utils";
import { Request, Response } from "express";
import { employeeService } from "../../services";
import { employeeRequestSchema, querySchema, updateEmployeeSchema } from "./employee.schema";

class EmployeeController {
  private handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({
      status: StatusValue.Failed,
      data: { error: formatZodError(error) },
    });
  };

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  async findEmployeeAndRoles(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findEmployeeAndRoles();

    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findEmployee(req: Request, res: Response): Promise<void> {
    const request = employeeRequestSchema.safeParse(req.query);
    if (!request.success) {
      res
        .status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }

    const response = await employeeService.findEmployees(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findEmployeeById(req: Request, res: Response): Promise<void> {
    const request = querySchema.safeParse(req.params);
    if(!request.success) {
      res
        .status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await employeeService.findEmployeeById(request.data.idEmployee);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    const request = querySchema.safeParse(req.params);
    if(!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await employeeService.deleteEmployee(request.data.idEmployee);
    res.status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    const request = updateEmployeeSchema.safeParse(req.body);
    if (!request.success) {
      res
        .status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }

    const response = await employeeService.updateEmployee(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findCities(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findCities();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findEps(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findEps();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findRoles(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findRoles();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findState(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findState();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findArls(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findArls();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findContractTypes(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findContractTypes();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findBanks(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findBanks();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findPaymentMethods(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findPaymentMethods();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findCompensationFunds(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findCompensationFunds();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findIdentificationTypes(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findIdentificationTypes();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findPositions(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findPositions();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findRequiredDocuments(req: Request, res: Response): Promise<void> {
    const response = await employeeService.findRequiredDocuments();
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }
  

}

export const employeeController = new EmployeeController();
