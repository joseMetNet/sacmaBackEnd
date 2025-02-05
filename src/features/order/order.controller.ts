import { Request, Response } from "express";
import { OrderService } from "./order.service";
import * as schemas from "./order.schema";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../employee/utils";
import { StatusCode, StatusValue } from "../../utils/general.interfase";

export class OrderController {
  private readonly orderService: OrderService;
  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  findAllOrderItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllOrderItemSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.findAllOrderItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findAllOrderItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllOrderItemDetailSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.findAllOrderItemDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findByIdOrderItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idOrderItemSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.findByIdOrderItem(request.data.idOrderItem);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findOrderItemStatus = async (req: Request, res: Response): Promise<void> => {
    const response = await this.orderService.findOrderItemStatus();
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  findByIdOrderItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idOrderItemDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.findByIdOrderItemDetail(request.data.idOrderItemDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  createOrderItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createOrderItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }
    const response = await this.orderService.createOrderItem(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  createOrderItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createOrderItemDetailSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.createOrderItemDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updateOrderItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateOrderItemSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const { document: uploadedDocument, orderDocument: uploadedOrderDocument } = req.files as {
      document?: UploadedFile;
      orderDocument?: UploadedFile;
    } || {};

    const filePath = uploadedDocument?.tempFilePath;
    const filePathOrder = uploadedOrderDocument?.tempFilePath;
    const fileExtension = uploadedDocument?.name.split(".").pop();
    const fileExtensionOrder = uploadedOrderDocument?.name.split(".").pop();

    const completedRequest = {
      data: request.data,
      filePath,
      fileExtension,
      filePathOrder,
      fileExtensionOrder
    };

    const response = await this.orderService.updateOrderItem(completedRequest);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  updateOrderItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateOrderItemDetailSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.updateOrderItemDetail(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deleteOrderItem = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idOrderItemSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.deleteOrderItem(request.data.idOrderItem);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  deleteOrderItemDetail = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idOrderItemDetailSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.deleteOrderItemDetail(request.data.idOrderItemDetail);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}