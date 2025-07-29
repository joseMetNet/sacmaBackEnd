import { Request, Response } from "express";
import { RevenueCenterService } from "./revenue-center.service";
import * as schemas from "./revenue-center.schema";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { formatZodError } from "../employee/utils";

export class RevenueCenterController {
  private readonly revenueCenterService: RevenueCenterService;

  constructor(revenueCenterService: RevenueCenterService) {
    this.revenueCenterService = revenueCenterService;
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

    const response = await this.revenueCenterService.findAll(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idRevenueCenterSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findById(request.data.idRevenueCenter);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createRevenueCenterSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.create(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateRevenueCenterSchema.safeParse({
      ...req.params,
      ...req.body,
    });
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.update(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idRevenueCenterSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.delete(request.data.idRevenueCenter);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllMaterial = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllMaterialSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllMaterial(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllInputs = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllInputsSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllInputs(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllEpp = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllEppSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllEpp(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllExpenditures = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllExpendituresSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllExpenditures(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllWorkTracking = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllWorkTrackingSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllWorkTracking(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllQuotation = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllQuotationSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllQuotation(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllRevenueCenterStatus = async (req: Request, res: Response): Promise<void> => {
    const response = await this.revenueCenterService.findAllRevenueCenterStatus();
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllInvoiceSummary = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllInvoiceSummarySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllInvoiceSummary(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllContractedSummary = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllContractedSummarySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllContractedSummary(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllMaterialSummaryDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllMaterialSummaryDetailSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.revenueCenterService.findAllMaterialSummaryDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}