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
    const transaction = await dbConnection.transaction();
    try {
      // 1. Obtener el detalle actual
      const orderItemDetailDb = await this.orderRepository.findByIdOrderItemDetail(orderItemDetail.idOrderItemDetail);
      if (!orderItemDetailDb) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Order item detail not found" }
        );
      }

      const oldQuantity = parseFloat(orderItemDetailDb.quantity?.toString() || "0");
      const newQuantity = orderItemDetail.quantity !== undefined ? parseFloat(orderItemDetail.quantity.toString()) : oldQuantity;
      const idInput = orderItemDetail.idInput || orderItemDetailDb.idInput;
      const idWarehouse = orderItemDetail.idWarehouse;

      console.log("=== UPDATE ORDER ITEM DETAIL DEBUG ===");
      console.log("shouldUpdateInventory:", orderItemDetail.shouldUpdateInventory);
      console.log("idWarehouse:", idWarehouse);
      console.log("idInput:", idInput);
      console.log("oldQuantity:", oldQuantity, "newQuantity:", newQuantity);

      // 2. Si hay cambios en cantidad Y se debe actualizar inventario
      let inventoryWasUpdated = false;
      if (oldQuantity !== newQuantity && orderItemDetail.shouldUpdateInventory && idWarehouse && idInput) {
        console.log("Attempting to update inventory...");
        
        // Buscar inventario existente (SIN transacción, es solo lectura)
        const inventory = await this.orderRepository.findInventoryByInputAndWarehouse(
          idInput,
          idWarehouse
        );

        console.log("Inventory found:", inventory ? `ID: ${inventory.idInventory}` : "NOT FOUND");

        if (inventory) {
          const quantityDifference = newQuantity - oldQuantity;
          const stockBefore = parseFloat(inventory.quantityAvailable?.toString() || "0");
          // IMPORTANTE: Restar la diferencia porque al asignar a orden, el inventario DISMINUYE
          const stockAfter = stockBefore - quantityDifference;
          const currentAverageCost = parseFloat(inventory.averageCost?.toString() || "0");

          console.log("quantityDifference:", quantityDifference);
          console.log("stockBefore:", stockBefore, "stockAfter:", stockAfter);

          // Actualizar solo la cantidad en inventario, mantener el costo promedio actual
          await this.orderRepository.updateInventory({
            idInventory: inventory.idInventory,
            quantityAvailable: stockAfter.toString(),
            averageCost: currentAverageCost.toString(),
            lastMovementDate: new Date()
          }, transaction);

          console.log("Inventory updated successfully");

          // Registrar movimiento en TB_InventoryMovement (CON transacción)
          await this.orderRepository.createInventoryMovement({
            idInventory: inventory.idInventory,
            idOrderItem: orderItemDetailDb.idOrderItem,
            idOrderItemDetail: orderItemDetail.idOrderItemDetail,
            idInput: idInput,
            idWarehouse: idWarehouse,
            // Si quantityDifference > 0: aumentó solicitud (más salida) = 'Salida'
            // Si quantityDifference < 0: disminuyó solicitud (devuelve al inventario) = 'Ajuste'
            movementType: quantityDifference >= 0 ? 'Salida' : 'Ajuste',
            quantity: Math.abs(quantityDifference).toString(),
            unitPrice: "0",
            totalPrice: "0",
            stockBefore: stockBefore.toString(),
            stockAfter: stockAfter.toString(),
            remarks: orderItemDetail.remarks || `Ajuste por edición de orden. Cantidad anterior: ${oldQuantity}, nueva: ${newQuantity}`,
            documentReference: `EDIT-OID-${orderItemDetail.idOrderItemDetail}`,
            dateMovement: new Date(),
            createdBy: orderItemDetail.createdBy
          }, transaction);

          console.log("Inventory movement created successfully");
          inventoryWasUpdated = true;
        } else {
          console.log("WARNING: No inventory found for idInput:", idInput, "idWarehouse:", idWarehouse);
        }
      } else {
        console.log("Skipping inventory update. Conditions not met.");
      }

      // 3. Actualizar el detalle
      const updatedOrderItemDetail = await orderItemDetailDb.update(orderItemDetail, { transaction });

      await transaction.commit();
      console.log("Transaction committed successfully");

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        ...updatedOrderItemDetail.toJSON(),
        message: "Order item detail updated successfully",
        inventoryUpdated: inventoryWasUpdated
      });
    } catch (err: any) {
      // Manejar rollback de forma segura
      try {
        await transaction.rollback();
      } catch (rollbackError: any) {
        if (rollbackError.message?.includes('no corresponding BEGIN TRANSACTION')) {
          console.log("Transaction already finished, skipping rollback");
        } else {
          console.error("Error during rollback:", rollbackError);
        }
      }
      
      console.error("ERROR in updateOrderItemDetail:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating order item detail", error: err.message }
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

  deleteOrderItemDetail = async (data: { 
    idOrderItemDetail: number; 
    shouldUpdateInventory?: boolean;
    idWarehouse?: number;
    idInput?: number;
    quantity?: number;
    remarks?: string;
    createdBy?: string;
  }): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      const { idOrderItemDetail, shouldUpdateInventory, idWarehouse, idInput, quantity, remarks, createdBy } = data;
      
      const orderItemDetail = await this.orderRepository.findByIdOrderItemDetail(idOrderItemDetail);
      if (!orderItemDetail) {
        await transaction.rollback();
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Order item detail not found" }
        };
      }

      const quantityToReturn = quantity || parseFloat(orderItemDetail.quantity?.toString() || "0");
      const inputId = idInput || orderItemDetail.idInput;
      const warehouseId = idWarehouse;

      console.log("=== DELETE ORDER ITEM DETAIL DEBUG ===");
      console.log("shouldUpdateInventory:", shouldUpdateInventory);
      console.log("idWarehouse:", warehouseId);
      console.log("idInput:", inputId);
      console.log("quantityToReturn:", quantityToReturn);

      let inventoryWasUpdated = false;

      // Si se debe actualizar inventario, devolver la cantidad
      if (shouldUpdateInventory && warehouseId && inputId && quantityToReturn > 0) {
        console.log("Attempting to return stock to inventory...");

        // Buscar inventario existente
        const inventory = await this.orderRepository.findInventoryByInputAndWarehouse(
          inputId,
          warehouseId
        );

        console.log("Inventory found:", inventory ? `ID: ${inventory.idInventory}` : "NOT FOUND");

        if (inventory) {
          const stockBefore = parseFloat(inventory.quantityAvailable?.toString() || "0");
          // Devolver la cantidad al inventario (SUMAR porque se está devolviendo)
          const stockAfter = stockBefore + quantityToReturn;
          const currentAverageCost = parseFloat(inventory.averageCost?.toString() || "0");

          console.log("stockBefore:", stockBefore, "stockAfter:", stockAfter);

          // Actualizar inventario
          await this.orderRepository.updateInventory({
            idInventory: inventory.idInventory,
            quantityAvailable: stockAfter.toString(),
            averageCost: currentAverageCost.toString(),
            lastMovementDate: new Date()
          }, transaction);

          console.log("Inventory updated successfully");

          // Registrar movimiento en TB_InventoryMovement
          await this.orderRepository.createInventoryMovement({
            idInventory: inventory.idInventory,
            idOrderItem: orderItemDetail.idOrderItem,
            idOrderItemDetail: idOrderItemDetail,
            idInput: inputId,
            idWarehouse: warehouseId,
            movementType: 'Ajuste',
            quantity: quantityToReturn.toString(),
            unitPrice: "0",
            totalPrice: "0",
            stockBefore: stockBefore.toString(),
            stockAfter: stockAfter.toString(),
            remarks: remarks || `Devolución por eliminación de orden. Cantidad devuelta: ${quantityToReturn}`,
            documentReference: `DELETE-OID-${idOrderItemDetail}`,
            dateMovement: new Date(),
            createdBy: createdBy
          }, transaction);

          console.log("Inventory movement created successfully");
          inventoryWasUpdated = true;
        } else {
          console.log("WARNING: No inventory found for idInput:", inputId, "idWarehouse:", warehouseId);
        }
      }

      // Eliminar el OrderItemDetail
      await this.orderRepository.deleteOrderItemDetail(idOrderItemDetail);

      await transaction.commit();
      console.log("Transaction committed successfully");

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
        message: "Order item detail deleted successfully",
        returnedQuantity: quantityToReturn,
        inventoryUpdated: inventoryWasUpdated
      });

    } catch (err: any) {
      // Manejar rollback de forma segura
      try {
        await transaction.rollback();
      } catch (rollbackError: any) {
        if (rollbackError.message?.includes('no corresponding BEGIN TRANSACTION')) {
          console.log("Transaction already finished, skipping rollback");
        } else {
          console.error("Error during rollback:", rollbackError);
        }
      }

      console.error("ERROR in deleteOrderItemDetail:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error deleting order item detail", error: err.message }
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
