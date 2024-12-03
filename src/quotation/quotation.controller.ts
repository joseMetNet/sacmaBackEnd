import { Request, Response } from "express";
import * as schemas from "./quotation.schema";
import { QuotationService } from "./quotation.service";
import { StatusCode, StatusValue } from "../interfaces";
import { formatZodError } from "../controllers/utils";

export class QuotationController {
  private readonly quotationService: QuotationService;
  constructor(quotationService: QuotationService) {
    this.quotationService = quotationService;
  }

  createQuotation = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.CreateQuotationSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.createQuotation(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  updateQuotation = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.UpdateQuotationSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.updateQuotation(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  createQuotationItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.CreateQuotationItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.createQuotationItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  updateQuotationItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.UpdateQuotationItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.updateQuotationItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  createQuotationItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.CreateQuotationItemDetailSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.createQuotationItemDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  updateQuotationItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.UpdateQuotationItemDetailSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.updateQuotationItemDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findQuotationById = async (req: Request, res: Response): Promise<void> => {
    console.log(`req.params: ${JSON.stringify(req.params)}`);
    const request = schemas.QuotationSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.findQuotationById(request.data.idQuotation);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findAllQuotations = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.FindAllQuotationSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.quotationService.findAllQuotations(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  deleteQuotation = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.deleteQuotation(request.data.idQuotation);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findQuotationItemById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationItemSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.findQuotationItemById(request.data.idQuotationItem);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findAllQuotationStatus = async (req: Request, res: Response): Promise<void> => {
    const response = await this.quotationService.findAllQuotationStatus();
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findAllQuotationItems = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.FindAllQuotationItemSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.quotationService.findAllQuotationItems(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  deleteQuotationItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationItemSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.deleteQuotationItem(request.data.idQuotationItem);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findQuotationItemDetailById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationItemDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.findQuotationItemDetailById(request.data.idQuotationItemDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findAllQuotationItemDetails = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.FindAllQuotationItemDetailSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.quotationService.findAllQuotationItemDetails(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  deleteQuotationItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationItemDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.deleteQuotationItemDetail(request.data.idQuotationItemDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  createQuotationPercentage = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.CreateQuotationPercentageSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.createQuotationPercentage(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  createQuotationComment = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.CreateQuotationCommentSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.createQuotationComment(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  updateQuotationComment = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.UpdateQuotationCommentSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.updateQuotationComment(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  findAllQuotationComments = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.FindAllQuotationCommentSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.quotationService.findAllQuotationComments(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };

  deleteQuotationComment = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.QuotationCommentSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }

    const response = await this.quotationService.deleteQuotationComment(request.data.idQuotationComment);
    res.status(response.code).json({
      status: response.status,
      data: response.data,
    });
  };  
}