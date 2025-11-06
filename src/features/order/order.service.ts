import { OrderRepository } from "./order.repository";
import * as dtos from "./order.interface";
import sequelize from "sequelize";
import { ResponseEntity } from "../employee/interface";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { CustomError, deleteFile, uploadFile } from "../../utils";
import { dbConnection } from "../../config";
import { BuildResponse } from "../../utils/build-response";
import { Op } from "sequelize";
// import { machineryService } from "../machinery/machinery.service";
import { machineryService } from "../machinery/machinery.service";

export class OrderService {
  private orderRepository: OrderRepository;
  constructor(
    orderRepository: OrderRepository,
    
  ) {
    this.orderRepository = orderRepository;
  }

  findAllOrderItem = async (
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

  findAllOrderItemDetail = async (request: dtos.FindAllOrderItemDetailDTO): Promise<ResponseEntity> => {
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

  findAllOrderItemDetailMachineryUsed = async (request: dtos.FindAllOrderItemDetailMachineryUsedDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filter = this.buildItemDetailFilterMachinery(request);

      const orderItems = await this.orderRepository.findAllOrderItemDetailMachineryUsed(filter, limit, offset);

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
        { message: "Error while fetching orders item details machineries" }
      );
    }
  };

  findAllOrderItemDetailMachineryUsedPaginatorNot = async (request: dtos.FindAllOrderItemDetailMachineryUsedDTOPs): Promise<ResponseEntity> => {
    try {
      const filter = this.buildItemDetailFilterMachinery(request);

      const orderItems = await this.orderRepository.findAllOrderItemDetailMachineryWhitoutPaginator(filter);

      const response = {
        data: orderItems.rows,
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details machineries" }
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

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, orderItem);
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

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, orderItemDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  createOrderItem = async (request: dtos.CreateOrderItem):
    Promise<ResponseEntity> => {
    try {
      const newOrderItem = await this.orderRepository.createOrderItem(request);
      newOrderItem.setDataValue("consecutive", `OC-${newOrderItem.idOrderItem}`);
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

  // createOrderItemDetailMachineryUsed = async (orderItemDetailMachineryUsed: dtos.CreateOrderItemDetailMachineryUsed): Promise<ResponseEntity> => {
  //   try {
  //     const newOrderItemDetail = await this.orderRepository.createOrderItemDetailMachineryUsed(orderItemDetailMachineryUsed);
  //     return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrderItemDetail);
  //   } catch (err: any) {
  //     console.error(err);
  //     return BuildResponse.buildErrorResponse(
  //       StatusCode.InternalErrorServer,
  //       { message: "Error while fetching orders item details" }
  //     );
  //   }
  // };

  createOrderItemDetailMachineryUsed = async (orderItemDetailMachineryUsed: dtos.CreateOrderItemDetailMachineryUsed): Promise<ResponseEntity> => {
    try {
      // crea el registro principal
      const newOrderItemDetail = await this.orderRepository.createOrderItemDetailMachineryUsed(orderItemDetailMachineryUsed);

      // prepara DTO para la ubicación de la maquinaria
      const machineryLocationDto: any = {
        idMachinery: orderItemDetailMachineryUsed.idMachinery,
        idCostCenterProject: orderItemDetailMachineryUsed.idCostCenterProject,
        // si tienes el idEmpleado en el request o en el contexto, úsalo aquí; si no, omítelo o toma un fallback.
        idEmployee: (orderItemDetailMachineryUsed as any).idEmployee ?? 0,
        assignmentDate: new Date().toISOString()
      };

      // crea la ubicación sólo si hay datos mínimos requeridos
      if (machineryLocationDto.idMachinery && machineryLocationDto.idCostCenterProject) {
        try {
          await machineryService.createMachineryLocation(machineryLocationDto);
        } catch (errLoc) {
          // opcional: loguear el error pero no abortar la creación principal,
          // o propagar según la política que prefieras (rollback/transacción).
          console.error('Error creando MachineryLocation:', errLoc);
        }
      }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrderItemDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching orders item details" }
      );
    }
  };

  // createOrderItemDetailMachineryUsed = async (orderItemDetailMachineryUsed: dtos.CreateOrderItemDetailMachineryUsed): Promise<ResponseEntity> => {
  //   const transaction = await dbConnection.transaction();
  //   try {
  //     // crea el registro principal dentro de la transacción
  //     const newOrderItemDetail = await this.orderRepository.createOrderItemDetailMachineryUsed(orderItemDetailMachineryUsed, transaction);

  //     // prepara DTO para la ubicación de la maquinaria
  //     const machineryLocationDto: any = {
  //       idMachinery: orderItemDetailMachineryUsed.idMachinery,
  //       idCostCenterProject: orderItemDetailMachineryUsed.idCostCenterProject,
  //       idEmployee: (orderItemDetailMachineryUsed as any).idEmployee ?? undefined,
  //       assignmentDate: new Date().toISOString()
  //     };

  //     // crea la ubicación sólo si hay datos mínimos requeridos
  //     if (machineryLocationDto.idMachinery && machineryLocationDto.idCostCenterProject) {
  //       const machineryResp = await this.machineryServices.createMachineryLocation(machineryLocationDto, transaction);
  //       // si hay error en la creación de la ubicación, la función devuelve BuildResponse con status Failed
  //       if (machineryResp && (machineryResp as any).status === StatusValue.Failed) {
  //         await transaction.rollback();
  //         return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: 'Error creating machinery location', error: (machineryResp as any).data });
  //       }
  //     }

  //     await transaction.commit();
  //     return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newOrderItemDetail ? newOrderItemDetail.toJSON() : {});
  //   } catch (err: any) {
  //     await transaction.rollback();
  //     console.error(err);
  //     return BuildResponse.buildErrorResponse(
  //       StatusCode.InternalErrorServer,
  //       { message: "Error while fetching orders item details" }
  //     );
  //   }
  // };

  updateOrderItem = async (request: dtos.UpdateOrderItemIn)
    : Promise<ResponseEntity> => {
    try {
      const orderItemDb = await this.orderRepository.findByIdOrderItem(request.data.idOrderItem);
      if (!orderItemDb) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item not found" }
        };
      }

      if (request.filePath && orderItemDb.documentUrl) {
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

      if (request.filePath) {
        const identifier = crypto.randomUUID();
        const contentType = request.fileExtension === "pdf" ? "application/pdf" : "image/jpeg";
        await uploadFile(request.filePath, identifier, contentType, "order");
        request.data.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${request.fileExtension === "pdf" ? "pdf" : "png"}`;
        request.data.idOrderItemStatus = 2;
      }

      if (request.filePathOrder && orderItemDb.orderDocumentUrl) {
        const identifier = new URL(orderItemDb.orderDocumentUrl).pathname.split("/").pop();
        const deleteRequest = await deleteFile(identifier!, "order");
        if (deleteRequest instanceof CustomError) {
          console.error(deleteRequest);
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: "Error while deleting file" }
          );
        }
      }

      if (request.filePathOrder) {
        const identifier = crypto.randomUUID();
        const contentType = request.fileExtensionOrder === "pdf" ? "application/pdf" : "image/jpeg";
        await uploadFile(request.filePathOrder, identifier, contentType, "order");
        request.data.orderDocumentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${request.fileExtensionOrder === "pdf" ? "pdf" : "png"}`;
        request.data.idOrderItemStatus = 2;
      }

      const updatedOrderItem = await orderItemDb.update(request.data);

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

  updateOrderItemDetailMachineryUsed = async (orderItemDetailMachineryUsed: dtos.UpdateOrderItemDetailMachineryUsed): Promise<ResponseEntity> => {
    try {
      const orderItemDetailDb = await this.orderRepository.findByIdOrderItemDetailMachineryUsed(orderItemDetailMachineryUsed.idOrderItemDetailMachineryUsed);
      if (!orderItemDetailDb) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Order item detail not found" }
        );
      }

      const updatedOrderItemDetail = await orderItemDetailDb.update(orderItemDetailMachineryUsed);

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
    const transaction = await dbConnection.transaction();
    try {
      const orderItem = await this.orderRepository.findByIdOrderItem(id);
      if (!orderItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Order item not found" });
      }

      const orderItemDetails = await this.orderRepository.findAllOrderItemDetail({ idOrderItem: id });

      await Promise.all(orderItemDetails.rows.map(orderItemDetail => orderItemDetail.destroy({ transaction })));
      await orderItem.destroy({ transaction });
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Order item deleted successfully" });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error deleting order item:", err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to delete order item", error: err.message });
    }
  };

  deleteOrderItemDetail = async (data: { idOrderItemDetail: number; quantity?: number; idPurchaseRequest?: number }): Promise<ResponseEntity> => {
    try {
      const { idOrderItemDetail, quantity, idPurchaseRequest } = data;
      
      const orderItemDetail = await this.orderRepository.findByIdOrderItemDetail(idOrderItemDetail);
      if (!orderItemDetail) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item detail not found" }
        };
      }

      // Si viene idPurchaseRequest y quantity, devolver stock antes de eliminar
      if (idPurchaseRequest && quantity) {
        try {
          const newQuantity = await this.orderRepository.returnStockToPurchaseRequest(
            idPurchaseRequest,
            quantity
          );
          
          // Eliminar el OrderItemDetail
          await this.orderRepository.deleteOrderItemDetail(idOrderItemDetail);

          return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
            message: "Order item detail deleted and stock returned successfully",
            returnedQuantity: quantity,
            newStockQuantity: newQuantity
          });
        } catch (stockError: any) {
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: `Error returning stock: ${stockError.message}` }
          );
        }
      } else {
        // Si solo viene idOrderItemDetail, eliminar directamente
        await this.orderRepository.deleteOrderItemDetail(idOrderItemDetail);
        
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
          message: "Order item detail deleted successfully (no stock returned)" 
        });
      }

    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error deleting order item detail" }
      );
    }
  };

  deleteOrderItemDetailMachineryUsed = async (id: number): Promise<ResponseEntity> => {
    try {
      const orderItemDetailMachineryUsed = await this.orderRepository.findByIdOrderItemDetailMachineryUsed(id);
      if (!orderItemDetailMachineryUsed) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item detail not found" }
        };
      }

      await this.orderRepository.deleteOrderItemDetailMachineryUsed(id);

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
  private buildItemDetailFilterMachinery = (request: dtos.FindAllOrderItemDetailMachineryUsedDTO) => {
    const filter: any = {};
    if (request.idOrderItem) {
      filter.idOrderItem = request.idOrderItem;
    }
    return filter;
  };

  // private buildFindAllFilter(request: dtos.FindAllOrderItemDetailMachineryUsedDTO): { [key: string]: any } {
  //   let filter: { [key: string]: any } = {};
  //   for (const key of Object.getOwnPropertyNames(request)) {
  //     if (/^id/.test(key)) {
  //       filter = {
  //         ...filter,
  //         [key]: request[key as keyof dtos.FindAllOrderItemDetailMachineryUsedDTO],
  //       };
  //     } else if (key === "serial") {
  //       filter = {
  //         ...filter,
  //         serial: {
  //           [Op.like]: `%${request.serial}%`,
  //         },
  //       };
  //     } else if (key === "machineryBrand") {
  //       filter = {
  //         ...filter,
  //         machineryBrand: {
  //           [Op.like]: `%${request.machineryBrand}%`,
  //         },
  //       };
  //     }
  //   }
  //   return filter;
  // }

  private buildItemFilter = (request: dtos.FindAllOrderItemDTO) => {
    let where: { [key: string]: any } = {};
    if (request.consecutive) {
      where = {
        ...where,
        consecutive: sequelize.where(sequelize.col("consecutive"), "LIKE", `%${request.consecutive}%`),
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
    if (request.orderRequest) {
      where = {
        ...where,
        orderRequest: sequelize.where(sequelize.col("orderRequest"), "LIKE", `%${request.orderRequest}%`),
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
