import { Request, Response } from "express";
import { OrderService } from "./order.service";
import * as schemas from "./order.schema";
import { StatusCode, StatusValue } from "../interfaces";
import { formatZodError } from "../controllers/utils";
import { UploadedFile } from "express-fileupload";

export class OrderController {
  private readonly orderService: OrderService;
  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: {error: formatZodError(request.error)}
      });
      return;
    }

    const response = await this.orderService.findAll(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

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

  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.findById(request.data.idOrder);
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

  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createOrderSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.create(request.data);
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

    const filePath = req.files
      ? (req.files.document as UploadedFile).tempFilePath
      : undefined;

    const response = await this.orderService.createOrderItem(request.data, filePath);
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

  update = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.updateOrderSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.update(request.data);
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

    const filePath = req.files
      ? (req.files.document as UploadedFile).tempFilePath
      : undefined;

    const response = await this.orderService.updateOrderItem(request.data, filePath);
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

  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.orderService.delete(request.data.idOrder);
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
