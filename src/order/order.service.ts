import { OrderRepository } from "./order.repository";
import * as dtos from "./order.interface";
import { ResponseEntity } from "../services/interface";
import { StatusCode, StatusValue } from "../interfaces";
import { BuildResponse } from "../services";
import { or } from "sequelize";
import { CustomError, deleteFile, uploadFile } from "../utils";

export class OrderService {
  private orderRepository: OrderRepository;
  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  findAll = async(
    request: dtos.FindAllDTO
  ): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const orders = await this.orderRepository.findAll({}, limit, offset);

      const response = {
        data: orders.rows,
        totalItems: orders.count,
        currentPage: page,
        totalPages: Math.ceil(orders.count / pageSize)
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders" }
      );
    }
  };

  findAllOrderItem = async(
    request: dtos.FindAllOrderItemDTO
  ): Promise<ResponseEntity> => {
    try {
      console.log("FROM ORDER ITEM SERVICE");
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const orderItems = await this.orderRepository.findAllOrderItem({}, limit, offset);

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
      const orderItems = await this.orderRepository.findAllOrderItemDetail({}, limit, offset);

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

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order not found" }
        };
      }

      return BuildResponse.buildSuccessResponse( StatusCode.Ok, order );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders" }
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

  create = async (order: dtos.CreateOrder): Promise<ResponseEntity> => {
    try {
      const newOrder = await this.orderRepository.create(order);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrder);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders" }
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
      newOrderItem.setDataValue("consecutive", `ORD-${newOrderItem.idOrderItem}`);
      await newOrderItem.save();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrderItem);
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

  update = async (order: dtos.UpdateOrder): Promise<ResponseEntity> => {
    try {
      const orderDb = await this.orderRepository.findById(order.idOrder);
      if (!orderDb) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order not found" }
        };
      }

      const updatedOrder = await orderDb.update(order);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedOrder);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders" }
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

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order not found" }
        };
      }
      
      await this.orderRepository.delete(id);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Order deleted successfully" });

    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders" }
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

  private getPagination = (request: { page?: number, pageSize?: number }) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { page, pageSize, limit, offset };
  };
}
