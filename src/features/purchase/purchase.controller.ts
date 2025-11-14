import { Request, Response } from "express";
import { PurchaseService } from "./purchase.service";
import * as schemas from "./purchase.schema";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../employee/utils";
import { StatusCode, StatusValue } from "../../utils/general.interfase";

export class PurchaseController {
  private readonly purchaseService: PurchaseService;
  constructor(purchaseService: PurchaseService) {
    this.purchaseService = purchaseService;
  }

  findAllPurchaseRequest = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllPurchaseRequestSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findAllPurchaseRequest(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllPurchaseRequestDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllPurchaseRequestDetailSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findAllPurchaseRequestDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllPurchaseRequestDetailMachineryUsed = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllPurchaseRequestDetailMachinerySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findAllPurchaseRequestDetailMachineryUsed(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllPurchaseRequestDetailMachineryUsedPaginatorNot = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllPurchaseRequestDetailMachinerySchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findAllPurchaseRequestDetailMachineryUsedPaginatorNot(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findPurchaseRequestStatus = async (req: Request, res: Response): Promise<void> => {
    const response = await this.purchaseService.findPurchaseRequestStatus();
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findByIdPurchaseRequest = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idPurchaseRequestSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findByIdPurchaseRequest(request.data.idPurchaseRequest);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findByIdPurchaseRequestDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idPurchaseRequestDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.findByIdPurchaseRequestDetail(request.data.idPurchaseRequestDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  createPurchaseRequest = async (req: Request, res: Response): Promise<void> => {
    // Verificar si el request contiene items (array)
    // if (req.body.items && Array.isArray(req.body.items)) {
    //   // Usar el esquema para requests con items
    //   const request = schemas.createPurchaseRequestWithItemsSchema.safeParse(req.body);
    //   if (!request.success) {
    //     res.status(StatusCode.BadRequest).json({
    //       status: StatusValue.Failed,
    //       data: { error: formatZodError(request.error) }
    //     });
    //     return;
    //   }

    //   const response = await this.purchaseService.createPurchaseRequestWithItems(request.data);
    //   res.status(response.code).json({
    //     status: response.status,
    //     data: response.data
    //   });
    // } else {
    //   // Usar el esquema original para requests individuales
    //   const request = schemas.createPurchaseRequestSchema.safeParse(req.body);
    //   if (!request.success) {
    //     res.status(StatusCode.BadRequest).json({
    //       status: StatusValue.Failed,
    //       data: { error: formatZodError(request.error) }
    //     });
    //     return;
    //   }

    //   const response = await this.purchaseService.createPurchaseRequest(request.data);
    //   res.status(response.code).json({
    //     status: response.status,
    //     data: response.data
    //   });
    // }

    // Usar el esquema original para requests individuales
    const request = schemas.createPurchaseRequestSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.createPurchaseRequest(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  createPurchaseRequestDetail = async (req: Request, res: Response): Promise<void> => {

    // Verificar si el request contiene items (array)
    if (req.body.items && Array.isArray(req.body.items)) {
      // Usar el esquema para requests con items
      const request = schemas.createPurchaseRequestDetailWithItemsSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest).json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
        return;
      }

      const response = await this.purchaseService.CreatePurchaseRequestDetailWithItems(request.data);
      res.status(response.code).json({
        status: response.status,
        data: response.data
      });
    } else {
      // Usar el esquema original para requests individuales    
      const request = schemas.createPurchaseRequestDetailSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest).json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) }
        });
        return;
      }

      const response = await this.purchaseService.createPurchaseRequestDetail(request.data);
      res.status(response.code).json({
        status: response.status,
        data: response.data
      });



    }

  };

  createPurchaseRequestDetailMachineryUsed = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createPurchaseRequestDetailMachineryUsedSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.createPurchaseRequestDetailMachineryUsed(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updatePurchaseRequest = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updatePurchaseRequestSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const { document: uploadedDocument, requestDocument: uploadedRequestDocument } = req.files as {
      document?: UploadedFile;
      requestDocument?: UploadedFile;
    } || {};

    const filePath = uploadedDocument?.tempFilePath;
    const filePathRequest = uploadedRequestDocument?.tempFilePath;
    const fileExtension = uploadedDocument?.name.split(".").pop();
    const fileExtensionRequest = uploadedRequestDocument?.name.split(".").pop();

    const requestData = {
      data: request.data,
      filePath,
      fileExtension,
      filePathRequest,
      fileExtensionRequest
    };

    const response = await this.purchaseService.updatePurchaseRequest(requestData);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updatePurchaseRequestDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updatePurchaseRequestDetailSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.updatePurchaseRequestDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updatePurchaseRequestDetailMachineryUsed = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updatePurchaseRequestDetailMachinerySchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.updatePurchaseRequestDetailMachineryUsed(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deletePurchaseRequest = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idPurchaseRequestSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.deletePurchaseRequest(request.data.idPurchaseRequest);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deletePurchaseRequestDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idPurchaseRequestDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.deletePurchaseRequestDetail(request.data.idPurchaseRequestDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deletePurchaseRequestDetailMachineryUsed = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idPurchaseRequestDetailMachineryUsed.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.purchaseService.deletePurchaseRequestDetailMachineryUsed(request.data.idPurchaseRequestDetailMachineryUsed);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}