import { InputMovementRepository } from "./input-movement.repository";
import * as dtos from "./input-movement.interface";
import { ResponseEntity } from "../employee/interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { Op } from "sequelize";

export class InputMovementService {
  private inputMovementRepository: InputMovementRepository;

  constructor(inputMovementRepository: InputMovementRepository) {
    this.inputMovementRepository = inputMovementRepository;
  }

  // Ejecutar movimiento de entrada o salida
  moveInput = async (request: dtos.MoveInputDTO): Promise<ResponseEntity> => {
    try {
      console.log('Executing moveInput with data:', request);
      
      const result = await this.inputMovementRepository.executeMoveInput(request);
      
      console.log('SP_MoveInput result:', result);
      
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        { 
          message: `Movimiento de ${request.movementType} registrado correctamente`,
          movementType: request.movementType,
          quantity: request.quantity,
          idPurchaseRequest: request.idPurchaseRequest,
          idPurchaseRequestDetail: request.idPurchaseRequestDetail
        }
      );
    } catch (err: any) {
      console.error("Error executing SP_MoveInput:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      
      // Manejo de errores específicos del procedimiento almacenado
      let errorMessage = "Error al registrar el movimiento";
      
      if (err.message) {
        if (err.message.includes("No existe la solicitud")) {
          errorMessage = "No existe la solicitud de compra especificada";
        } else if (err.message.includes("No hay suficiente stock")) {
          errorMessage = "No hay suficiente stock disponible para realizar la salida";
        } else if (err.message.includes("Tipo de movimiento no válido")) {
          errorMessage = "Tipo de movimiento no válido. Debe ser 'Entrada', 'Salida' o 'Retorno'";
        } else if (err.message.includes("El idPurchaseRequestDetail es obligatorio")) {
          errorMessage = "El idPurchaseRequestDetail es obligatorio para movimientos de Retorno";
        } else if (err.message.includes("No existe el registro de detalle")) {
          errorMessage = "No existe el registro de detalle especificado";
        } else {
          // Usar el mensaje original del error si no coincide con ningún patrón
          errorMessage = err.message;
        }
      }
      
      return BuildResponse.buildErrorResponse(
        StatusCode.BadRequest,
        { 
          message: errorMessage, 
          details: err.message || "",
          originalError: err.original?.message || ""
        }
      );
    }
  };

  // Obtener todos los movimientos con filtros y paginación
  findAll = async (request: dtos.FindAllInputMovementDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset, returnAll } = this.getPagination(request);
      const filter = this.buildFilter(request);

      if (returnAll) {
        const movements = await this.inputMovementRepository.findAll(filter);
        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          movements.rows
        );
      } else {
        const movements = await this.inputMovementRepository.findAll(filter, limit, offset);
        const response = {
          data: movements.rows,
          totalItems: movements.count,
          currentPage: page,
          totalPages: Math.ceil(movements.count / pageSize)
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
        { message: "Error al obtener movimientos de inventario" }
      );
    }
  };

  // Obtener movimiento por ID
  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const movement = await this.inputMovementRepository.findById(id);
      
      if (!movement) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Movimiento no encontrado" }
        );
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, movement);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error al obtener el movimiento" }
      );
    }
  };

  // Obtener historial por producto
  findByInput = async (idInput: number): Promise<ResponseEntity> => {
    try {
      const movements = await this.inputMovementRepository.findByInput(idInput);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, movements);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error al obtener historial del producto" }
      );
    }
  };

  // Obtener historial por bodega
  findByWarehouse = async (idWarehouse: number): Promise<ResponseEntity> => {
    try {
      const movements = await this.inputMovementRepository.findByWarehouse(idWarehouse);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, movements);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error al obtener historial de la bodega" }
      );
    }
  };

  private getPagination = (request: any) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    
    const returnAll = pageSize === -1;
    
    const limit = returnAll ? undefined : pageSize;
    const offset = returnAll ? undefined : (page - 1) * pageSize;
    
    return { page, pageSize, limit, offset, returnAll };
  };

  private buildFilter = (request: dtos.FindAllInputMovementDTO) => {
    const filter: { [key: string]: any } = {};

    if (request.idPurchaseRequest) {
      filter.idPurchaseRequest = request.idPurchaseRequest;
    }

    if (request.idInput) {
      filter.idInput = request.idInput;
    }

    if (request.idWarehouse) {
      filter.idWarehouse = request.idWarehouse;
    }

    if (request.movementType) {
      filter.movementType = request.movementType;
    }

    if (request.startDate || request.endDate) {
      filter.createdAt = {};
      if (request.startDate) {
        filter.createdAt[Op.gte] = new Date(request.startDate);
      }
      if (request.endDate) {
        filter.createdAt[Op.lte] = new Date(request.endDate);
      }
    }

    return filter;
  };
}
