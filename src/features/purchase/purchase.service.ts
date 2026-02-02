import { PurchaseRepository } from "./purchase.repository";
import * as dtos from "./purchase.interface";
import sequelize from "sequelize";
import { ResponseEntity } from "../employee/interface";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { CustomError, deleteFile, uploadFile } from "../../utils";
import { dbConnection } from "../../config";
import { BuildResponse } from "../../utils/build-response";
import { Op } from "sequelize";
import * as crypto from "crypto";
// import { machineryService } from "../machinery/machinery.service";
import { machineryService } from "../machinery/machinery.service";

interface FindAllInventoryPurchaseDTO {
  page?: number;
  pageSize?: number;
  idWarehouse?: number;
}

export class PurchaseService {
  private purchaseRepository: PurchaseRepository;
  constructor(
    purchaseRepository: PurchaseRepository,

  ) {
    this.purchaseRepository = purchaseRepository;
  }

  findAllPurchaseRequest = async (
    request: dtos.FindAllPurchaseRequestDTO
  ): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset, returnAll } = this.getPagination(request);
      const filter = this.buildRequestFilter(request);

      if (returnAll) {
        // Si pageSize es -1, retornar todos los registros sin paginación
        const purchaseRequests = await this.purchaseRepository.findAllPurchaseRequest(filter);
        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          purchaseRequests.rows
        );
      } else {
        // Paginación normal
        const purchaseRequests = await this.purchaseRepository.findAllPurchaseRequest(filter, limit, offset);
        const response = {
          data: purchaseRequests.rows,
          totalItems: purchaseRequests.count,
          currentPage: page,
          totalPages: Math.ceil(purchaseRequests.count / pageSize)
        };

        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          response
        );
      }
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase requests" }
      );
    }
  };

  findAllPurchaseRequestDetail = async (request: dtos.FindAllPurchaseRequestDetailDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filter = this.buildRequestDetailFilter(request);
      const purchaseRequests = await this.purchaseRepository.findAllPurchaseRequestDetail(filter, limit, offset);

      // Calcular totalGeneral: suma de (quantity * price) de cada detalle
      const totalGeneral = purchaseRequests.rows.reduce((sum, detail) => {
        const quantity = parseFloat(detail.quantity?.toString() || "0");
        const price = parseFloat(detail.price?.toString() || "0");
        return sum + (quantity * price);
      }, 0);

      // Si hay un idPurchaseRequest en el filtro, actualizar el precio en TB_PurchaseRequest
      if (request.idPurchaseRequest) {
        await this.purchaseRepository.updatePurchaseRequestPrice(
          request.idPurchaseRequest,
          totalGeneral.toFixed(2)
        );
      }

      // Obtener idWarehouse del primer detalle para actualizar el averageCost en TB_InventoryPurchase
      const idWarehouse = purchaseRequests.rows.length > 0 ? purchaseRequests.rows[0].idWarehouse : null;
      if (idWarehouse) {
        try {
          const averageCost = totalGeneral > 0 ? totalGeneral : null;
          await this.purchaseRepository.updateInventoryPurchaseAverageCost(
            idWarehouse,
            averageCost
          );
        } catch (inventoryErr: any) {
          console.error("Error updating inventory purchase average cost:", inventoryErr);
          console.error("Parameters:", {
            idWarehouse: idWarehouse,
            averageCost: totalGeneral
          });
          // No lanzar error para permitir que la consulta continúe aunque falle la actualización del inventario
        }
      }

      const response = {
        data: purchaseRequests.rows,
        totalItems: purchaseRequests.count,
        currentPage: page,
        totalPages: Math.ceil(purchaseRequests.count / pageSize),
        totalGeneral: totalGeneral.toFixed(2)
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase request details" }
      );
    }
  };

  findAllPurchaseRequestDetailMachineryUsed = async (request: dtos.FindAllPurchaseRequestDetailMachineryUsedDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filter = this.buildRequestDetailFilterMachinery(request);

      const purchaseRequests = await this.purchaseRepository.findAllPurchaseRequestDetailMachineryUsed(filter, limit, offset);

      const response = {
        data: purchaseRequests.rows,
        totalItems: purchaseRequests.count,
        currentPage: page,
        totalPages: Math.ceil(purchaseRequests.count / pageSize)
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase request details machineries" }
      );
    }
  };

  findAllPurchaseRequestDetailMachineryUsedPaginatorNot = async (request: dtos.FindAllPurchaseRequestDetailMachineryUsedDTOPs): Promise<ResponseEntity> => {
    try {
      const filter = this.buildRequestDetailFilterMachinery(request);

      const purchaseRequests = await this.purchaseRepository.findAllPurchaseRequestDetailMachineryWhitoutPaginator(filter);

      const response = {
        data: purchaseRequests.rows,
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase request details machineries" }
      );
    }
  };

  findByIdPurchaseRequest = async (id: number): Promise<ResponseEntity> => {
    try {
      const purchaseRequest = await this.purchaseRepository.findByIdPurchaseRequest(id);
      if (!purchaseRequest) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Purchase request not found" }
        };
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, purchaseRequest);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase requests" }
      );
    }
  };

  findPurchaseRequestStatus = async (): Promise<ResponseEntity> => {
    try {
      const purchaseRequestStatus = await this.purchaseRepository.findPurchaseRequestStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, purchaseRequestStatus);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase request status" }
      );
    }
  };

  findByIdPurchaseRequestDetail = async (id: number): Promise<ResponseEntity> => {
    try {
      const purchaseRequestDetail = await this.purchaseRepository.findByIdPurchaseRequestDetail(id);
      if (!purchaseRequestDetail) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Purchase request detail not found" }
        };
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, purchaseRequestDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching purchase request details" }
      );
    }
  };

  createPurchaseRequest = async (request: dtos.CreatePurchaseRequest): Promise<ResponseEntity> => {
    try {
      const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequest(request);
      newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
      newPurchaseRequest.setDataValue("idPurchaseRequestStatus", 1);
      const response = await newPurchaseRequest.save();

      // Crear registro en TB_InventoryPurchase si hay idWarehouse
      if (request.idWarehouse) {
        try {
          const averageCost = request.price && request.price.trim() !== "" ? parseFloat(request.price) : null;
          await this.purchaseRepository.createInventoryPurchase(
            request.idWarehouse,
            averageCost
          );
        } catch (inventoryErr: any) {
          console.error("Error creating inventory purchase:", inventoryErr);
          console.error("Parameters:", {
            idWarehouse: request.idWarehouse,
            averageCost: request.price
          });
          // No lanzar error para permitir que la compra se cree aunque falle el inventario
        }
      }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.error("Error in createPurchaseRequest:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase request", error: err.message }
      );
    }
  };

  // createPurchaseRequestWithItems = async (request: dtos.CreatePurchaseRequestWithItems): Promise<ResponseEntity> => {
  //   const transaction = await dbConnection.transaction();
  //   try {
  //     const createdRequests = [];
  //     const updatedRequests = [];
  //     const updatedInputCosts = [];

  //     for (const item of request.items) {
  //       // Validar que los IDs requeridos existan
  //       if (!request.idWarehouse || !request.idSupplier || !item.idInput) {
  //         continue; // Saltar items inválidos
  //       }

  //       // Validar si el precio cambió y actualizar costo en TB_Input
  //       if (item.price && item.originalPrice && item.price !== item.originalPrice) {
  //         try {
  //           await this.purchaseRepository.updateInputCost(item.idInput, item.price.toString());
  //           updatedInputCosts.push({
  //             idInput: item.idInput,
  //             oldCost: item.originalPrice,
  //             newCost: item.price
  //           });
  //         } catch (costError) {
  //           console.error(`Error updating cost for idInput ${item.idInput}:`, costError);
  //           // Continuar aunque falle la actualización de costo
  //         }
  //       }

  //       // Buscar si ya existe un registro con idWarehouse + idSupplier + idInput
  //       const existingRequest = await this.purchaseRepository.findPurchaseRequestByUnique(
  //         request.idWarehouse,
  //         request.idSupplier,
  //         item.idInput
  //       );

  //       if (existingRequest) {
  //         // Si existe, actualizar los campos que cambiaron
  //         const currentQuantity = parseFloat(existingRequest.quantity || "0");
  //         const newQuantity = parseFloat(item.quantity.toString());
  //         const updatedQuantity = (currentQuantity + newQuantity).toString();

  //         await this.purchaseRepository.updatePurchaseRequestById(
  //           existingRequest.idPurchaseRequest,
  //           {
  //             quantity: updatedQuantity,
  //             price: item.price.toString(),
  //             purchaseRequest: request.purchaseRequest
  //           }
  //         );

  //         // Obtener el registro actualizado
  //         const updated = await this.purchaseRepository.findByIdPurchaseRequest(
  //           existingRequest.idPurchaseRequest
  //         );
  //         updatedRequests.push(updated);
  //       } else {
  //         // Si no existe, crear nuevo registro
  //         const purchaseRequestData: dtos.CreatePurchaseRequest = {
  //           isActive: request.isActive,
  //           purchaseRequest: request.purchaseRequest,
  //           idWarehouse: request.idWarehouse,
  //           idSupplier: request.idSupplier,
  //           idInput: item.idInput,
  //           quantity: item.quantity.toString(),
  //           price: item.price.toString(),
  //         };

  //         const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequest(purchaseRequestData);
  //         newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
  //         await newPurchaseRequest.save({ transaction });

  //         createdRequests.push(newPurchaseRequest);
  //       }
  //     }

  //     await transaction.commit();

  //     const totalOperations = createdRequests.length + updatedRequests.length;
  //     const responseData: any = {
  //       message: `${totalOperations} purchase requests processed (${createdRequests.length} created, ${updatedRequests.length} updated)`,
  //       created: createdRequests,
  //       updated: updatedRequests
  //     };

  //     // Agregar información de costos actualizados si hay
  //     if (updatedInputCosts.length > 0) {
  //       responseData.inputCostsUpdated = updatedInputCosts;
  //       responseData.message += ` - ${updatedInputCosts.length} input costs updated`;
  //     }

  //     return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, responseData);
  //   } catch (err: any) {
  //     await transaction.rollback();
  //     console.error(err);
  //     return BuildResponse.buildErrorResponse(
  //       StatusCode.InternalErrorServer,
  //       { message: "Error while creating purchase requests with items" }
  //     );
  //   }
  // };

  createPurchaseRequestDetail = async (purchaseRequestDetail: dtos.CreatePurchaseRequestDetail): Promise<ResponseEntity> => {
    try {
      const newPurchaseRequestDetail = await this.purchaseRepository.createPurchaseRequestDetail(purchaseRequestDetail);

       // Crear registro en TB_InventoryPurchase si hay idWarehouse
      // if (purchaseRequestDetail.idWarehouse) {
      //   try {
      //     const averageCost = purchaseRequestDetail.price && purchaseRequestDetail.price.trim() !== "" ? parseFloat(purchaseRequestDetail.price) : null;
      //     await this.purchaseRepository.updateInventoryPurchaseAverageCost(
      //       purchaseRequestDetail.idWarehouse,
      //       averageCost
      //     );
      //   } catch (inventoryErr: any) {
      //     console.error("Error creating inventory purchase:", inventoryErr);
      //     console.error("Parameters:", {
      //       idWarehouse: request.idWarehouse,
      //       averageCost: request.price
      //     });
      //     // No lanzar error para permitir que la compra se cree aunque falle el inventario
      //   }
      // }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newPurchaseRequestDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase request detail" }
      );
    }
  };

  CreatePurchaseRequestDetailWithItems = async (request: dtos.CreatePurchaseRequestDetailWithItems): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      const createdRequests = [];
      // const updatedRequests = [];
      // const updatedInputCosts = [];

      for (const item of request.items) {
        // Validar que los IDs requeridos existan
        if (!request.idWarehouse || !request.idSupplier || !item.idInput) {
          continue; // Saltar items inválidos
        }

        // Validar si el precio cambió y actualizar costo en TB_Input
        // if (item.price && item.originalPrice && item.price !== item.originalPrice) {
        //   try {
        //     await this.purchaseRepository.updateInputCost(item.idInput, item.price.toString());
        //     updatedInputCosts.push({
        //       idInput: item.idInput,
        //       oldCost: item.originalPrice,
        //       newCost: item.price
        //     });
        //   } catch (costError) {
        //     console.error(`Error updating cost for idInput ${item.idInput}:`, costError);
        //     // Continuar aunque falle la actualización de costo
        //   }
        // }

        // // Buscar si ya existe un registro con idWarehouse + idSupplier + idInput
        // const existingRequest = await this.purchaseRepository.findPurchaseRequestByUnique(
        //   request.idWarehouse,
        //   request.idSupplier,
        //   item.idInput
        // );

        // if (existingRequest) {
        //   // Si existe, actualizar los campos que cambiaron
        //   const currentQuantity = parseFloat(existingRequest.quantity || "0");
        //   const newQuantity = parseFloat(item.quantity.toString());
        //   const updatedQuantity = (currentQuantity + newQuantity).toString();

        //   await this.purchaseRepository.updatePurchaseRequestById(
        //     existingRequest.idPurchaseRequest,
        //     {
        //       quantity: updatedQuantity,
        //       price: item.price.toString(),
        //       purchaseRequest: request.purchaseRequest
        //     }
        //   );

        //   // Obtener el registro actualizado
        //   const updated = await this.purchaseRepository.findByIdPurchaseRequest(
        //     existingRequest.idPurchaseRequest
        //   );
        //   updatedRequests.push(updated);
        // } else {
        //   // Si no existe, crear nuevo registro
        //   const purchaseRequestData: dtos.CreatePurchaseRequestDetail = {
        //     idPurchaseRequest: request.idPurchaseRequest,
        //     isActive: request.isActive,
        //     purchaseRequest: request.purchaseRequest,
        //     idWarehouse: request.idWarehouse,
        //     idSupplier: request.idSupplier,
        //     idInput: item.idInput,
        //     quantity: item.quantity.toString(),
        //     price: item.price.toString(),
        //   };

        //   const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequestDetail(purchaseRequestData);
        //   newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
        //   await newPurchaseRequest.save({ transaction });

        //   createdRequests.push(newPurchaseRequest);
        // }

        // bloque de copia para solamente guardar
        // Si no existe, crear nuevo registro
        const purchaseRequestData: dtos.CreatePurchaseRequestDetail = {
          idPurchaseRequest: request.idPurchaseRequest,
          isActive: request.isActive,
          purchaseRequest: request.purchaseRequest,
          idWarehouse: request.idWarehouse,
          idSupplier: request.idSupplier,
          idInput: item.idInput,
          quantity: item.quantity.toString(),
          price: item.price.toString(),
        };

        const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequestDetail(purchaseRequestData);
        newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
        await newPurchaseRequest.save({ transaction });

        createdRequests.push(newPurchaseRequest);


      }

      await transaction.commit();

      const totalOperations = createdRequests.length ;
      const responseData: any = {
        message: `${totalOperations} purchase requests processed (${createdRequests.length} created)`,
        created: createdRequests,
        // updated: updatedRequests
      };

      // Agregar información de costos actualizados si hay
      // if (updatedInputCosts.length > 0) {
      //   responseData.inputCostsUpdated = updatedInputCosts;
      //   responseData.message += ` - ${updatedInputCosts.length} input costs updated`;
      // }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, responseData);
    } catch (err: any) {
      await transaction.rollback();
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase requests with items" }
      );
    }
  };


  createPurchaseRequestDetailMachineryUsed = async (purchaseRequestDetailMachineryUsed: dtos.CreatePurchaseRequestDetailMachineryUsed): Promise<ResponseEntity> => {
    try {
      const newPurchaseRequestDetailMachineryUsed = await this.purchaseRepository.createPurchaseRequestDetailMachineryUsed(purchaseRequestDetailMachineryUsed);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newPurchaseRequestDetailMachineryUsed);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase request detail machinery used" }
      );
    }
  };

  updatePurchaseRequest = async (request: dtos.UpdatePurchaseRequestIn): Promise<ResponseEntity> => {
    try {
      const { data, filePath, fileExtension, filePathRequest, fileExtensionRequest } = request;

      // Obtener el registro actual para verificar archivos existentes
      const purchaseRequestDb = await this.purchaseRepository.findByIdPurchaseRequest(data.idPurchaseRequest);
      if (!purchaseRequestDb) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Purchase request not found" }
        };
      }

      // Manejo del documento principal (document)
      if (filePath && purchaseRequestDb.documentUrl) {
        // Eliminar el archivo anterior si existe
        const identifier = new URL(purchaseRequestDb.documentUrl).pathname.split("/").pop();
        const deleteRequest = await deleteFile(identifier!, "purchase");
        if (deleteRequest instanceof CustomError) {
          console.error(deleteRequest);
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: "Error while deleting document file" }
          );
        }
      }

      if (filePath) {
        // Subir el nuevo archivo
        const identifier = crypto.randomUUID();
        const contentType = fileExtension === "pdf" ? "application/pdf" : "image/jpeg";
        await uploadFile(filePath, identifier, contentType, "order");
        data.documentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${fileExtension === "pdf" ? "pdf" : "png"}`;
      }

      // Manejo del documento de solicitud (requestDocument)
      if (filePathRequest && purchaseRequestDb.requestDocumentUrl) {
        // Eliminar el archivo anterior si existe
        const identifier = new URL(purchaseRequestDb.requestDocumentUrl).pathname.split("/").pop();
        const deleteRequest = await deleteFile(identifier!, "purchase");
        if (deleteRequest instanceof CustomError) {
          console.error(deleteRequest);
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: "Error while deleting request document file" }
          );
        }
      }

      if (filePathRequest) {
        // Subir el nuevo archivo
        const identifier = crypto.randomUUID();
        const contentType = fileExtensionRequest === "pdf" ? "application/pdf" : "image/jpeg";
        await uploadFile(filePathRequest, identifier, contentType, "order");
        data.requestDocumentUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${fileExtensionRequest === "pdf" ? "pdf" : "png"}`;
      }

      // Validar si viene idInput y price para actualizar el costo en TB_Input
      let costUpdated = false;
      if (data.idInput && data.price) {
        try {
          // Si el precio cambió, actualizar el costo en TB_Input
          if (purchaseRequestDb.price !== data.price) {
            await this.purchaseRepository.updateInputCost(data.idInput, data.price);
            costUpdated = true;
          }
        } catch (costError) {
          console.error(`Error updating cost for idInput ${data.idInput}:`, costError);
          // Continuar aunque falle la actualización de costo
        }
      }

      // Actualizar el purchase request
      const updatedPurchaseRequest = await this.purchaseRepository.updatePurchaseRequest(data);

      const responseData: any = updatedPurchaseRequest;
      if (costUpdated) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
          ...responseData,
          costUpdated: true,
          message: "Purchase request updated and input cost synchronized"
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedPurchaseRequest);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating purchase request" }
      );
    }
  };

  updatePurchaseRequestDetail = async (purchaseRequestDetail: dtos.UpdatePurchaseRequestDetail): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      // 1. Obtener el detalle actual para conocer el idPurchaseRequest y valores previos
      const currentDetail = await this.purchaseRepository.findByIdPurchaseRequestDetail(purchaseRequestDetail.idPurchaseRequestDetail);
      
      if (!currentDetail) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Purchase request detail not found" }
        );
      }

      const idPurchaseRequest = currentDetail.idPurchaseRequest;
      const oldQuantity = parseFloat(currentDetail.quantity?.toString() || "0");
      const oldPrice = parseFloat(currentDetail.price?.toString() || "0");
      const newQuantity = parseFloat(purchaseRequestDetail.quantity?.toString() || "0");
      const newPrice = parseFloat(purchaseRequestDetail.price?.toString() || "0");
      
      // Obtener idInput del detalle actual o del request
      const idInput = purchaseRequestDetail.idInput || currentDetail.idInput;
      const idWarehouse = purchaseRequestDetail.idWarehouse;

      console.log("=== UPDATE PURCHASE REQUEST DETAIL DEBUG ===");
      console.log("shouldUpdateInventory:", purchaseRequestDetail.shouldUpdateInventory);
      console.log("idWarehouse:", idWarehouse);
      console.log("idInput:", idInput);
      console.log("oldQuantity:", oldQuantity, "newQuantity:", newQuantity);
      console.log("oldPrice:", oldPrice, "newPrice:", newPrice);
      console.log("Has changes?", oldQuantity !== newQuantity || oldPrice !== newPrice);

      // 2. Si hay cambios en cantidad o precio Y se debe actualizar inventario (ANTES de actualizar el detalle)
      let inventoryWasUpdated = false;
      if ((oldQuantity !== newQuantity || oldPrice !== newPrice) && purchaseRequestDetail.shouldUpdateInventory && idWarehouse && idInput) {
        console.log("Attempting to update inventory...");
        
        // Buscar inventario existente (SIN transacción, es solo lectura)
        const inventory = await this.purchaseRepository.findInventoryByInputAndWarehouse(
          idInput,
          idWarehouse
        );

        console.log("Inventory found:", inventory ? `ID: ${inventory.idInventory}` : "NOT FOUND");

        if (inventory) {
          const quantityDifference = newQuantity - oldQuantity;
          const stockBefore = parseFloat(inventory.quantityAvailable?.toString() || "0");
          const stockAfter = stockBefore + quantityDifference;

          console.log("quantityDifference:", quantityDifference);
          console.log("stockBefore:", stockBefore, "stockAfter:", stockAfter);

          // Calcular nuevo costo promedio ponderado si cambió el precio o cantidad
          let newAverageCost = parseFloat(inventory.averageCost?.toString() || "0");
          if (quantityDifference !== 0 || oldPrice !== newPrice) {
            const currentStockValue = stockBefore * parseFloat(inventory.averageCost?.toString() || "0");
            const newStockValue = quantityDifference * newPrice;
            const totalQuantity = stockBefore + quantityDifference;
            
            if (totalQuantity > 0) {
              newAverageCost = (currentStockValue + newStockValue) / totalQuantity;
            }
            
            console.log("New average cost calculated:", newAverageCost);
          }

          // Actualizar inventario (CON transacción)
          await this.purchaseRepository.updateInventory({
            idInventory: inventory.idInventory,
            quantityAvailable: stockAfter.toString(),
            averageCost: newAverageCost.toString(),
            lastMovementDate: new Date()
          }, transaction);

          console.log("Inventory updated successfully");

            // Registrar movimiento en TB_InventoryMovement (CON transacción)
            await this.purchaseRepository.createInventoryMovement({
              idInventory: inventory.idInventory,
              idPurchaseRequest: idPurchaseRequest,
              idPurchaseRequestDetail: purchaseRequestDetail.idPurchaseRequestDetail,
              idInput: idInput,
              idWarehouse: idWarehouse,
              movementType: quantityDifference >= 0 ? 'Entrada' : 'Ajuste',
              quantity: Math.abs(quantityDifference).toString(),
              unitPrice: newPrice.toString(),
              totalPrice: (Math.abs(quantityDifference) * newPrice).toString(),
              stockBefore: stockBefore.toString(),
              stockAfter: stockAfter.toString(),
              remarks: purchaseRequestDetail.remarks || `Ajuste por edición de detalle de compra. Cantidad anterior: ${oldQuantity}, nueva: ${newQuantity}. Precio anterior: ${oldPrice}, nuevo: ${newPrice}`,
              documentReference: `EDIT-PRD-${purchaseRequestDetail.idPurchaseRequestDetail}`,
              dateMovement: new Date(),
              createdBy: purchaseRequestDetail.createdBy
            }, transaction);          console.log("Inventory movement created successfully");
          inventoryWasUpdated = true;
        } else {
          console.log("WARNING: No inventory found for idInput:", idInput, "idWarehouse:", idWarehouse);
        }
      } else {
        console.log("Skipping inventory update. Conditions not met.");
      }

      // 3. Actualizar el detalle (CON transacción)
      await this.purchaseRepository.updatePurchaseRequestDetail(purchaseRequestDetail, transaction);

      // 4. Recalcular el precio total de TB_PurchaseRequest (SIN transacción, es solo lectura)
      const totalPrice = await this.purchaseRepository.calculateTotalPriceForPurchaseRequest(idPurchaseRequest);

      // 5. Actualizar el precio en TB_PurchaseRequest (CON transacción)
      await this.purchaseRepository.updatePurchaseRequestPrice(idPurchaseRequest, totalPrice.toString(), transaction);

      await transaction.commit();
      console.log("Transaction committed successfully");

      // 6. Obtener el detalle actualizado para retornarlo (SIN transacción, después del commit)
      const updatedDetail = await this.purchaseRepository.findByIdPurchaseRequestDetail(purchaseRequestDetail.idPurchaseRequestDetail);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        ...updatedDetail?.toJSON(),
        message: "Purchase request detail updated successfully",
        totalPriceRecalculated: totalPrice,
        inventoryUpdated: inventoryWasUpdated
      });
    } catch (err: any) {
      // Manejar el rollback de forma segura
      try {
        await transaction.rollback();
      } catch (rollbackError: any) {
        // Si falla el rollback es porque ya se hizo commit o ya se hizo rollback
        if (rollbackError.message?.includes('no corresponding BEGIN TRANSACTION')) {
          console.log("Transaction already finished, skipping rollback");
        } else {
          console.error("Error during rollback:", rollbackError);
        }
      }
      
      console.error("ERROR in updatePurchaseRequestDetail:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating purchase request detail", error: err.message }
      );
    }
  };

  updatePurchaseRequestDetailMachineryUsed = async (purchaseRequestDetailMachineryUsed: dtos.UpdatePurchaseRequestDetailMachineryUsed): Promise<ResponseEntity> => {
    try {
      const updatedPurchaseRequestDetailMachineryUsed = await this.purchaseRepository.updatePurchaseRequestDetailMachineryUsed(purchaseRequestDetailMachineryUsed);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedPurchaseRequestDetailMachineryUsed);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating purchase request detail machinery used" }
      );
    }
  };

  deletePurchaseRequest = async (id: number, shouldUpdateInventory?: boolean, createdBy?: string): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      // 1. Obtener el purchase request para validar que existe
      const purchaseRequest = await this.purchaseRepository.findByIdPurchaseRequest(id);
      
      if (!purchaseRequest) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Purchase request not found" }
        );
      }

      const idWarehouse = purchaseRequest.idWarehouse;

      // 2. Obtener todos los detalles asociados al purchase request
      const details = await this.purchaseRepository.findAllPurchaseRequestDetail(
        { idPurchaseRequest: id }
      );

      console.log("=== DELETE PURCHASE REQUEST DEBUG ===");
      console.log("idPurchaseRequest:", id);
      console.log("idWarehouse:", idWarehouse);
      console.log("Details found:", details.rows.length);
      console.log("shouldUpdateInventory:", shouldUpdateInventory);

      let totalInventoryMovements = 0;
      let inventoryErrors = [];

      // 3. Si se debe actualizar inventario, procesar cada detalle
      if (shouldUpdateInventory && idWarehouse) {
        for (const detail of details.rows) {
          const idInput = detail.idInput;
          const quantityToRemove = parseFloat(detail.quantity?.toString() || "0");
          const priceToRemove = parseFloat(detail.price?.toString() || "0");
          const amountToSubtract = quantityToRemove * priceToRemove;

          console.log(`Processing detail ${detail.idPurchaseRequestDetail}: idInput=${idInput}, quantity=${quantityToRemove}`);

          if (idInput && quantityToRemove > 0) {
            try {
              // Buscar inventario existente
              const inventory = await this.purchaseRepository.findInventoryByInputAndWarehouse(
                idInput,
                idWarehouse
              );

              if (inventory) {
                const stockBefore = parseFloat(inventory.quantityAvailable?.toString() || "0");
                const currentAverageCost = parseFloat(inventory.averageCost?.toString() || "0");
                const stockAfter = Math.max(0, stockBefore - quantityToRemove);

                console.log(`Inventory found: idInventory=${inventory.idInventory}, stockBefore=${stockBefore}, stockAfter=${stockAfter}`);

                // Actualizar inventario restando la cantidad
                await this.purchaseRepository.updateInventory({
                  idInventory: inventory.idInventory,
                  quantityAvailable: stockAfter.toString(),
                  averageCost: currentAverageCost.toString(),
                  lastMovementDate: new Date()
                }, transaction);

                console.log(`Inventory updated: quantity reduced from ${stockBefore} to ${stockAfter}`);

                // Registrar movimiento de ajuste (salida)
                await this.purchaseRepository.createInventoryMovement({
                  idInventory: inventory.idInventory,
                  idPurchaseRequest: id,
                  idPurchaseRequestDetail: detail.idPurchaseRequestDetail,
                  idInput: idInput,
                  idWarehouse: idWarehouse,
                  movementType: 'Ajuste',
                  quantity: quantityToRemove.toString(),
                  unitPrice: priceToRemove.toString(),
                  totalPrice: (quantityToRemove * priceToRemove).toString(),
                  stockBefore: stockBefore.toString(),
                  stockAfter: stockAfter.toString(),
                  remarks: `Ajuste por eliminación de solicitud de compra #${id}. Cantidad restada: ${quantityToRemove}`,
                  documentReference: `DELETE-PR-${id}-DET-${detail.idPurchaseRequestDetail}`,
                  dateMovement: new Date(),
                  createdBy: createdBy
                }, transaction);

                totalInventoryMovements++;
                console.log(`Inventory movement created successfully for detail ${detail.idPurchaseRequestDetail}`);
              } else {
                console.log(`WARNING: No inventory found for idInput: ${idInput}`);
              }
            } catch (inventoryErr: any) {
              console.error(`Error processing inventory for detail ${detail.idPurchaseRequestDetail}:`, inventoryErr);
              inventoryErrors.push({
                idInput,
                error: inventoryErr.message
              });
            }
          }
        }
      } else {
        console.log("Skipping inventory update. Conditions not met.");
      }

      // 4. Eliminar todos los detalles
      for (const detail of details.rows) {
        await this.purchaseRepository.deletePurchaseRequestDetail(detail.idPurchaseRequestDetail, transaction);
      }
      console.log(`Deleted ${details.rows.length} purchase request details`);

      // 5. Eliminar el purchase request
      await this.purchaseRepository.deletePurchaseRequest(id, transaction);

      await transaction.commit();
      console.log("Transaction committed successfully");

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
        message: "Purchase request and all details deleted successfully",
        deletedDetails: details.rows.length,
        inventoryMovements: totalInventoryMovements,
        inventoryQuantityReduced: totalInventoryMovements > 0,
        inventoryUpdated: shouldUpdateInventory && idWarehouse ? true : false
      });
    } catch (err: any) {
      // Manejar el rollback de forma segura
      try {
        await transaction.rollback();
      } catch (rollbackError: any) {
        if (rollbackError.message?.includes('no corresponding BEGIN TRANSACTION')) {
          console.log("Transaction already finished, skipping rollback");
        } else {
          console.error("Error during rollback:", rollbackError);
        }
      }
      
      console.error("ERROR in deletePurchaseRequest:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting purchase request", error: err.message }
      );
    }
  };

  deletePurchaseRequestDetail = async (id: number, shouldUpdateInventory?: boolean, idWarehouse?: number, createdBy?: string): Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      // 1. Obtener el detalle antes de eliminarlo para tener la información del cálculo
      const detail = await this.purchaseRepository.findByIdPurchaseRequestDetail(id);
      
      if (!detail) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Purchase request detail not found" }
        );
      }

      const idPurchaseRequest = detail.idPurchaseRequest;
      const quantityToRemove = parseFloat(detail.quantity?.toString() || "0");
      const priceToRemove = parseFloat(detail.price?.toString() || "0");
      const amountToSubtract = quantityToRemove * priceToRemove;
      const idInput = detail.idInput;

      console.log("=== DELETE PURCHASE REQUEST DETAIL DEBUG ===");
      console.log("shouldUpdateInventory:", shouldUpdateInventory);
      console.log("idWarehouse:", idWarehouse);
      console.log("idInput:", idInput);
      console.log("quantityToRemove:", quantityToRemove);
      console.log("priceToRemove:", priceToRemove);

      // 2. Si se debe actualizar inventario, restar la cantidad del inventario ANTES de eliminar
      let inventoryWasUpdated = false;
      if (shouldUpdateInventory && idWarehouse && idInput) {
        console.log("Attempting to update inventory...");
        
        // Buscar inventario existente (SIN transacción, es solo lectura)
        const inventory = await this.purchaseRepository.findInventoryByInputAndWarehouse(
          idInput,
          idWarehouse
        );

        console.log("Inventory found:", inventory ? `ID: ${inventory.idInventory}` : "NOT FOUND");

        if (inventory) {
          const stockBefore = parseFloat(inventory.quantityAvailable?.toString() || "0");
          const stockAfter = stockBefore - quantityToRemove; // Restamos porque estamos eliminando

          console.log("stockBefore:", stockBefore, "stockAfter:", stockAfter);

          // if (stockAfter < 0) {
          //   await transaction.rollback();
          //   return BuildResponse.buildErrorResponse(
          //     StatusCode.BadRequest,
          //     { 
          //       message: "Cannot delete: insufficient inventory",
          //       currentStock: stockBefore,
          //       quantityToRemove: quantityToRemove
          //     }
          //   );
          // }

          // Calcular nuevo costo promedio (mantiene el mismo costo promedio)
          const currentAverageCost = parseFloat(inventory.averageCost?.toString() || "0");

          // Actualizar inventario (CON transacción)
          await this.purchaseRepository.updateInventory({
            idInventory: inventory.idInventory,
            quantityAvailable: stockAfter.toString(),
            averageCost: currentAverageCost.toString(),
            lastMovementDate: new Date()
          }, transaction);

          console.log("Inventory updated successfully");

          // Registrar movimiento de salida en TB_InventoryMovement (CON transacción)
          await this.purchaseRepository.createInventoryMovement({
            idInventory: inventory.idInventory,
            idPurchaseRequest: idPurchaseRequest,
            idPurchaseRequestDetail: id,
            idInput: idInput,
            idWarehouse: idWarehouse,
            movementType: 'Ajuste',
            quantity: quantityToRemove.toString(),
            unitPrice: priceToRemove.toString(),
            totalPrice: amountToSubtract.toString(),
            stockBefore: stockBefore.toString(),
            stockAfter: stockAfter.toString(),
            remarks: `Ajuste por eliminación de detalle de compra. Cantidad eliminada: ${quantityToRemove}, precio: ${priceToRemove}`,
            documentReference: `DELETE-PRD-${id}`,
            dateMovement: new Date(),
            createdBy: createdBy
          }, transaction);

          console.log("Inventory movement created successfully");
          inventoryWasUpdated = true;
        } else {
          console.log("WARNING: No inventory found for idInput:", idInput, "idWarehouse:", idWarehouse);
        }
      } else {
        console.log("Skipping inventory update. Conditions not met.");
      }

      // 3. Eliminar el detalle (CON transacción)
      await this.purchaseRepository.deletePurchaseRequestDetail(id, transaction);

      // 4. Recalcular el precio total de TB_PurchaseRequest (SIN transacción, es solo lectura)
      const totalPrice = await this.purchaseRepository.calculateTotalPriceForPurchaseRequest(idPurchaseRequest);

      // 5. Actualizar el precio en TB_PurchaseRequest (CON transacción)
      await this.purchaseRepository.updatePurchaseRequestPrice(idPurchaseRequest, totalPrice.toString(), transaction);

      await transaction.commit();
      console.log("Transaction committed successfully");

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
        message: "Purchase request detail deleted successfully",
        amountSubtracted: amountToSubtract,
        newTotalPrice: totalPrice,
        inventoryUpdated: inventoryWasUpdated
      });
    } catch (err: any) {
      // Manejar el rollback de forma segura
      try {
        await transaction.rollback();
      } catch (rollbackError: any) {
        if (rollbackError.message?.includes('no corresponding BEGIN TRANSACTION')) {
          console.log("Transaction already finished, skipping rollback");
        } else {
          console.error("Error during rollback:", rollbackError);
        }
      }
      
      console.error("ERROR in deletePurchaseRequestDetail:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting purchase request detail", error: err.message }
      );
    }
  };

  deletePurchaseRequestDetailMachineryUsed = async (id: number): Promise<ResponseEntity> => {
    try {
      const deletedPurchaseRequestDetailMachineryUsed = await this.purchaseRepository.deletePurchaseRequestDetailMachineryUsed(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Purchase request detail machinery used deleted successfully" });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting purchase request detail machinery used" }
      );
    }
  };
  private getPagination = (request: any) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    // Si pageSize es -1, significa que quiere todos los registros
    const returnAll = pageSize === -1;

    const limit = returnAll ? undefined : pageSize;
    const offset = returnAll ? undefined : (page - 1) * pageSize;

    return { page, pageSize, limit, offset, returnAll };
  };

  private buildRequestFilter = (request: dtos.FindAllPurchaseRequestDTO) => {
    const filter: { [key: string]: any } = {};

    if (request.consecutive) {
      filter.consecutive = { [Op.like]: `%${request.consecutive}%` };
    }

    if (request.purchaseRequest) {
      filter.purchaseRequest = { [Op.like]: `%${request.purchaseRequest}%` };
    }

    if (request.idInput) {
      filter.idInput = request.idInput;
    }

    if (request.idWarehouse) {
      filter.idWarehouse = request.idWarehouse;
    }

    if (request.idSupplier) {
      filter.idSupplier = request.idSupplier;
    }

    if (request.isActive !== undefined) {
      filter.isActive = request.isActive;
    }

    return filter;
  };

  private buildRequestDetailFilter = (request: dtos.FindAllPurchaseRequestDetailDTO) => {
    const filter: { [key: string]: any } = {};

    if (request.idPurchaseRequest) {
      filter.idPurchaseRequest = request.idPurchaseRequest;
    }

    return filter;
  };

  private buildRequestDetailFilterMachinery = (request: any) => {
    const filter: { [key: string]: any } = {};

    if (request.idPurchaseRequest) {
      filter.idPurchaseRequest = request.idPurchaseRequest;
    }

    return filter;
  };

  findAllInventoryPurchase = async (
    request: FindAllInventoryPurchaseDTO
  ): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset, returnAll } = this.getPagination(request);
      const filter: any = {};

      if (request.idWarehouse) {
        filter.idWarehouse = request.idWarehouse;
      }

      if (returnAll) {
        const inventoryPurchases = await this.purchaseRepository.findAllInventoryPurchase(filter);
        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          inventoryPurchases.rows
        );
      } else {
        const inventoryPurchases = await this.purchaseRepository.findAllInventoryPurchase(filter, limit, offset);
        const response = {
          data: inventoryPurchases.rows,
          totalItems: inventoryPurchases.count,
          currentPage: page,
          totalPages: Math.ceil(inventoryPurchases.count / pageSize)
        };

        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          response
        );
      }
    } catch (error: any) {
      console.error("Error in findAllInventoryPurchase:", error);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error al consultar los registros de inventory purchase" }
      );
    }
  };
}