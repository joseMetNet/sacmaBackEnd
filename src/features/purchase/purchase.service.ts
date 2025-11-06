import { PurchaseRepository } from "./purchase.repository";
import * as dtos from "./purchase.interface";
import sequelize from "sequelize";
import { ResponseEntity } from "../employee/interface";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { CustomError, deleteFile, uploadFile } from "../../utils";
import { dbConnection } from "../../config";
import { BuildResponse } from "../../utils/build-response";
import { Op } from "sequelize";
// import { machineryService } from "../machinery/machinery.service";
import { machineryService } from "../machinery/machinery.service";

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

  createPurchaseRequest = async (request: dtos.CreatePurchaseRequest):
    Promise<ResponseEntity> => {
    try {
      const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequest(request);
      newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
      newPurchaseRequest.setDataValue("idPurchaseRequestStatus", 1);
      const response = await newPurchaseRequest.save();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase request" }
      );
    }
  };

  createPurchaseRequestWithItems = async (request: dtos.CreatePurchaseRequestWithItems):
    Promise<ResponseEntity> => {
    const transaction = await dbConnection.transaction();
    try {
      const createdRequests = [];
      const updatedRequests = [];
      const updatedInputCosts = [];
      
      for (const item of request.items) {
        // Validar que los IDs requeridos existan
        if (!request.idWarehouse || !request.idSupplier || !item.idInput) {
          continue; // Saltar items inválidos
        }

        // Validar si el precio cambió y actualizar costo en TB_Input
        if (item.price && item.originalPrice && item.price !== item.originalPrice) {
          try {
            await this.purchaseRepository.updateInputCost(item.idInput, item.price.toString());
            updatedInputCosts.push({
              idInput: item.idInput,
              oldCost: item.originalPrice,
              newCost: item.price
            });
          } catch (costError) {
            console.error(`Error updating cost for idInput ${item.idInput}:`, costError);
            // Continuar aunque falle la actualización de costo
          }
        }

        // Buscar si ya existe un registro con idWarehouse + idSupplier + idInput
        const existingRequest = await this.purchaseRepository.findPurchaseRequestByUnique(
          request.idWarehouse,
          request.idSupplier,
          item.idInput
        );

        if (existingRequest) {
          // Si existe, actualizar los campos que cambiaron
          const currentQuantity = parseFloat(existingRequest.quantity || "0");
          const newQuantity = parseFloat(item.quantity.toString());
          const updatedQuantity = (currentQuantity + newQuantity).toString();

          await this.purchaseRepository.updatePurchaseRequestById(
            existingRequest.idPurchaseRequest,
            {
              quantity: updatedQuantity,
              price: item.price.toString(),
              purchaseRequest: request.purchaseRequest
            }
          );

          // Obtener el registro actualizado
          const updated = await this.purchaseRepository.findByIdPurchaseRequest(
            existingRequest.idPurchaseRequest
          );
          updatedRequests.push(updated);
        } else {
          // Si no existe, crear nuevo registro
          const purchaseRequestData: dtos.CreatePurchaseRequest = {
            isActive: request.isActive,
            purchaseRequest: request.purchaseRequest,
            idWarehouse: request.idWarehouse,
            idSupplier: request.idSupplier,
            idInput: item.idInput,
            quantity: item.quantity.toString(),
            price: item.price.toString(),
          };

          const newPurchaseRequest = await this.purchaseRepository.createPurchaseRequest(purchaseRequestData);
          newPurchaseRequest.setDataValue("consecutive", `PR-${newPurchaseRequest.idPurchaseRequest}`);
          await newPurchaseRequest.save({ transaction });
          
          createdRequests.push(newPurchaseRequest);
        }
      }

      await transaction.commit();
      
      const totalOperations = createdRequests.length + updatedRequests.length;
      const responseData: any = {
        message: `${totalOperations} purchase requests processed (${createdRequests.length} created, ${updatedRequests.length} updated)`,
        created: createdRequests,
        updated: updatedRequests
      };

      // Agregar información de costos actualizados si hay
      if (updatedInputCosts.length > 0) {
        responseData.inputCostsUpdated = updatedInputCosts;
        responseData.message += ` - ${updatedInputCosts.length} input costs updated`;
      }

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

  createPurchaseRequestDetail = async (purchaseRequestDetail: dtos.CreatePurchaseRequestDetail): Promise<ResponseEntity> => {
    try {
      const newPurchaseRequestDetail = await this.purchaseRepository.createPurchaseRequestDetail(purchaseRequestDetail);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newPurchaseRequestDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating purchase request detail" }
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
      const { data, filePath, filePathRequest } = request;
      
      // Handle file uploads if provided
      if (filePath) {
        // Upload document logic here
        data.documentUrl = filePath; // Simplified for now
      }
      
      if (filePathRequest) {
        // Upload request document logic here
        data.requestDocumentUrl = filePathRequest; // Simplified for now
      }

      // Validar si viene idInput y price para actualizar el costo en TB_Input
      let costUpdated = false;
      if (data.idInput && data.price) {
        try {
          // Obtener el registro actual para comparar el precio
          const currentRequest = await this.purchaseRepository.findByIdPurchaseRequest(data.idPurchaseRequest);
          
          // Si el precio cambió, actualizar el costo en TB_Input
          if (currentRequest && currentRequest.price !== data.price) {
            await this.purchaseRepository.updateInputCost(data.idInput, data.price);
            costUpdated = true;
          }
        } catch (costError) {
          console.error(`Error updating cost for idInput ${data.idInput}:`, costError);
          // Continuar aunque falle la actualización de costo
        }
      }

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
    try {
      const updatedPurchaseRequestDetail = await this.purchaseRepository.updatePurchaseRequestDetail(purchaseRequestDetail);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedPurchaseRequestDetail);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating purchase request detail" }
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

  deletePurchaseRequest = async (id: number): Promise<ResponseEntity> => {
    try {
      const deletedPurchaseRequest = await this.purchaseRepository.deletePurchaseRequest(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Purchase request deleted successfully" });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting purchase request" }
      );
    }
  };

  deletePurchaseRequestDetail = async (id: number): Promise<ResponseEntity> => {
    try {
      const deletedPurchaseRequestDetail = await this.purchaseRepository.deletePurchaseRequestDetail(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Purchase request detail deleted successfully" });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting purchase request detail" }
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
}