import { ExpenditureService } from "./expenditure.service";
import * as schemas from "./expenditure.schema";
import { Request, Response } from "express";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { formatZodError } from "../employee/utils";
import { UploadedFile } from "express-fileupload";

export class ExpenditureController {
  private readonly expenditureService: ExpenditureService;

  constructor(expenditureService: ExpenditureService) {
    this.expenditureService = expenditureService;
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.findAll(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllExpenditureItem = async (req: Request, res: Response): Promise<void> => {
    console.log(req.query);
    const request = schemas.findAllExpenditureItemSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.findAllExpenditureItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllExpenditureType = async (req: Request, res: Response): Promise<void> => {
    const response = await this.expenditureService.findAllExpenditureType();
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.findById(request.data.idExpenditure);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const document = req.files
      ? (req.files.document as UploadedFile)
      : undefined;

    const filePath = document ? document.tempFilePath : undefined;
    const response = await this.expenditureService.create(request.data, filePath);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  createExpenditureItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createExpenditureItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.createExpenditureItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.update(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updateExpenditureItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateExpenditureItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.updateExpenditureItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.delete(request.data.idExpenditure);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deleteExpenditureItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idExpenditureItemSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.expenditureService.deleteExpenditureItem(request.data.idExpenditureItem);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}