import { OrderRepository } from "./order.repository";
import * as dtos from "./order.interface";
import { ResponseEntity } from "../services/interface";
import { StatusCode, StatusValue } from "../interfaces";
import { BuildResponse } from "../services";
import { CustomError, deleteFile, uploadFile } from "../utils";
import sequelize from "sequelize";

export class OrderService {
  private orderRepository: OrderRepository;
  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  findAllOrderItem = async(
    request: dtos.FindAllOrderItemDTO
  ): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filter = this.buildItemFilter(request);
      const orderItems = await this.orderRepository.findAllOrderItem(filter, limit, offset);

      const response = {
        data: orderItems.rows,
        totalItems: orderItems.count,
        currentPage: page,
        totalPages: Math.ceil(orderItems.count / pageSize)
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders items" }
      );
    }
  };

  findAllOrderItemDetail = async(
    request: dtos.FindAllOrderItemDetailDTO
  ): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filter = this.buildItemDetailFilter(request);
      const orderItems = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);

      const response = {
        data: orderItems.rows,
        totalItems: orderItems.count,
        currentPage: page,
        totalPages: Math.ceil(orderItems.count / pageSize)
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  findByIdOrderItem = async (id: number): Promise<ResponseEntity> => {
    try {
      const orderItem = await this.orderRepository.findByIdOrderItem(id);
      if (!orderItem) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item not found" }
        };
      }

      return BuildResponse.buildSuccessResponse( StatusCode.Ok, orderItem );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders items" }
      );
    }
  };

  findOrderItemStatus = async (): Promise<ResponseEntity> => {
    try {
      const orderItemStatus = await this.orderRepository.findOrderItemStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, orderItemStatus);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching order item status" }
      );
    }
  };

  findByIdOrderItemDetail = async (id: number): Promise<ResponseEntity> => {
    try {
      const orderItemDetail = await this.orderRepository.findByIdOrderItemDetail(id);
      if (!orderItemDetail) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item detail not found" }
        };
      }

      return BuildResponse.buildSuccessResponse( StatusCode.Ok, orderItemDetail );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  createOrderItem = async (request: dtos.CreateOrderItem, filePath?: string): 
  Promise<ResponseEntity> => {
    try {
      if (filePath) {
        const identifier = crypto.randomUUID();
        await uploadFile(filePath, identifier, "application/pdf", "order");
        request.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.pdf`;
      }

      const newOrderItem = await this.orderRepository.createOrderItem(request);
      newOrderItem.setDataValue("consecutive", newOrderItem.idOrderItem);
      newOrderItem.setDataValue("idOrderItemStatus", 1);
      const response = await newOrderItem.save();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders items" }
      );
    }
  };

  createOrderItemDetail = async (orderItemDetail: dtos.CreateOrderItemDetail): Promise<ResponseEntity> => {
    try {
      const newOrderItemDetail = await this.orderRepository.createOrderItemDetail(orderItemDetail);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrderItemDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  updateOrderItem = async (request: dtos.UpdateOrderItem, filePath?: string)
  : Promise<ResponseEntity> => {
    try {
      const orderItemDb = await this.orderRepository.findByIdOrderItem(request.idOrderItem);
      if (!orderItemDb) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item not found" }
        };
      }

      if (filePath && orderItemDb.documentUrl) {
        const identifier = new URL(orderItemDb.documentUrl).pathname.split("/").pop();
        const deleteRequest = await deleteFile(identifier!, "order");
        if (deleteRequest instanceof CustomError) {
          console.error(deleteRequest);
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: "Error while deleting file" }
          );
        }
      }

      if (filePath) {
        const identifier = crypto.randomUUID();
        await uploadFile(filePath, identifier, "application/pdf", "order");
        request.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.pdf`;
      }

      const updatedOrderItem = await orderItemDb.update(request);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedOrderItem);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders items" }
      );
    }
  };

  updateOrderItemDetail = async (orderItemDetail: dtos.UpdateOrderItemDetail): Promise<ResponseEntity> => {
    try {
      const orderItemDetailDb = await this.orderRepository.findByIdOrderItemDetail(orderItemDetail.idOrderItemDetail);
      if (!orderItemDetailDb) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Order item detail not found" }
        );
      }

      const updatedOrderItemDetail = await orderItemDetailDb.update(orderItemDetail);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedOrderItemDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  deleteOrderItem = async (id: number): Promise<ResponseEntity> => {
    try {
      const orderItem = await this.orderRepository.findByIdOrderItem(id);
      if (!orderItem) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item not found" }
        };
      }
      
      await this.orderRepository.deleteOrderItem(id);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Order item deleted successfully" });

    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders items" }
      );
    }
  };

  deleteOrderItemDetail = async (id: number): Promise<ResponseEntity> => {
    try {
      const orderItemDetail = await this.orderRepository.findByIdOrderItemDetail(id);
      if (!orderItemDetail) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item detail not found" }
        };
      }
      
      await this.orderRepository.deleteOrderItemDetail(id);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Order item detail deleted successfully" });

    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error deleting fetching orders item details" }
      );
    }
  };

  private buildItemDetailFilter = (request: dtos.FindAllOrderItemDetailDTO) => {
    const filter: any = {};
    if (request.idOrderItem) {
      filter.idOrderItem = request.idOrderItem;
    }
    return filter;
  };

  private buildItemFilter = (request: dtos.FindAllOrderItemDTO) => {
    let where: { [key: string]: any } = {};
    if (request.consecutive) {
      where = {
        ...where,
        consecutive: sequelize.where(sequelize.col("consecutive"), "LIKE", `%${where.consecutive}%`),
      };
    }
    if (request.idOrderItemStatus) {
      where = {
        ...where, 
        idOrderItemStatus: request.idOrderItemStatus
      };
    }
    if (request.idCostCenterProject) {
      where = {
        ...where, 
        idCostCenterProject: request.idCostCenterProject
      };
    }
    return where;
  };

  private getPagination = (request: { page?: number, pageSize?: number }) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { page, pageSize, limit, offset };
  };
}
