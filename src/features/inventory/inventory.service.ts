import { InventoryRepository } from "./inventory.repository";
import * as dtos from "./inventory.interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { ResponseEntity } from "../employee/interface";
import sequelize from "sequelize";

export class InventoryService {
  private readonly inventoryRepository: InventoryRepository;

  constructor(inventoryRepository: InventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  // ============================================================================
  // Operaciones con Stored Procedures
  // ============================================================================

  /**
   * Registra entrada de material al inventario desde solicitud de compra
   */
  registerInventoryEntry = async (data: dtos.RegisterInventoryEntryDTO): Promise<ResponseEntity> => {
    try {
      await this.inventoryRepository.registerInventoryEntry(data);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
        message: "Entrada de inventario registrada correctamente",
        data: {
          idPurchaseRequest: data.idPurchaseRequest,
          idInput: data.idInput,
          idWarehouse: data.idWarehouse,
          quantity: data.quantity,
        },
      });
    } catch (error: any) {
      console.error("Error in registerInventoryEntry service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al registrar entrada de inventario",
        details: errorMessage,
      });
    }
  };

  /**
   * Asigna material del inventario a un proyecto
   */
  assignMaterialToProject = async (data: dtos.AssignMaterialToProjectDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.assignMaterialToProject(data);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
        message: "Material asignado al proyecto correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in assignMaterialToProject service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al asignar material al proyecto",
        details: errorMessage,
      });
    }
  };

  /**
   * Devuelve material no utilizado desde un proyecto
   */
  returnMaterialFromProject = async (data: dtos.ReturnMaterialFromProjectDTO): Promise<ResponseEntity> => {
    try {
      await this.inventoryRepository.returnMaterialFromProject(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Material devuelto correctamente",
        data: {
          idProjectAssignment: data.idProjectAssignment,
          quantityToReturn: data.quantityToReturn,
        },
      });
    } catch (error: any) {
      console.error("Error in returnMaterialFromProject service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al devolver material del proyecto",
        details: errorMessage,
      });
    }
  };

  /**
   * Consulta el inventario actual por bodega
   */
  getInventoryByWarehouse = async (idWarehouse?: number): Promise<ResponseEntity> => {
    try {
      const inventory = await this.inventoryRepository.getInventoryByWarehouse(idWarehouse);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inventory,
        totalItems: inventory.length,
      });
    } catch (error: any) {
      console.error("Error in getInventoryByWarehouse service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar inventario por bodega",
      });
    }
  };

  /**
   * Consulta materiales asignados a un proyecto
   */
  getProjectMaterialsAssigned = async (idCostCenterProject: number): Promise<ResponseEntity> => {
    try {
      const materials = await this.inventoryRepository.getProjectMaterialsAssigned(idCostCenterProject);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: materials,
        totalItems: materials.length,
      });
    } catch (error: any) {
      console.error("Error in getProjectMaterialsAssigned service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar materiales asignados al proyecto",
      });
    }
  };

  // ============================================================================
  // Consultas con filtros y paginación
  // ============================================================================

  /**
   * Encuentra todos los registros de inventario con filtros
   */
  findAllInventory = async (request: dtos.FindAllInventoryDTO): Promise<ResponseEntity> => {
    try {
      const page = request.page || 1;
      const pageSize = request.pageSize || 10;
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const filter = this.buildInventoryFilter(request);
      const inventory = await this.inventoryRepository.findAllInventory(filter, limit, offset);

      const response = {
        data: inventory.rows,
        totalItems: inventory.count,
        currentPage: page,
        totalPages: Math.ceil(inventory.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error: any) {
      console.error("Error in findAllInventory service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar inventario",
      });
    }
  };

  /**
   * Encuentra un inventario por ID
   */
  findInventoryById = async (idInventory: number): Promise<ResponseEntity> => {
    try {
      const inventory = await this.inventoryRepository.findInventoryById(idInventory);
      if (!inventory) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Inventario no encontrado",
        });
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, inventory);
    } catch (error: any) {
      console.error("Error in findInventoryById service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar inventario",
      });
    }
  };

  /**
   * Encuentra todos los movimientos de inventario con filtros
   */
  findAllInventoryMovement = async (request: dtos.FindAllInventoryMovementDTO): Promise<ResponseEntity> => {
    try {
      const page = request.page || 1;
      const pageSize = request.pageSize || 10;
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const filter = this.buildInventoryMovementFilter(request);
      const movements = await this.inventoryRepository.findAllInventoryMovement(filter, limit, offset);

      const response = {
        data: movements.rows,
        totalItems: movements.count,
        currentPage: page,
        totalPages: Math.ceil(movements.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error: any) {
      console.error("Error in findAllInventoryMovement service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar movimientos de inventario",
      });
    }
  };

  /**
   * Encuentra todas las asignaciones de proyecto con filtros
   */
  findAllProjectAssignment = async (request: dtos.FindAllProjectAssignmentDTO): Promise<ResponseEntity> => {
    try {
      const page = request.page || 1;
      const pageSize = request.pageSize || 10;
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const filter = this.buildProjectAssignmentFilter(request);
      const assignments = await this.inventoryRepository.findAllProjectAssignment(filter, limit, offset);

      const response = {
        data: assignments.rows,
        totalItems: assignments.count,
        currentPage: page,
        totalPages: Math.ceil(assignments.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error: any) {
      console.error("Error in findAllProjectAssignment service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar asignaciones de proyecto",
      });
    }
  };

  // ============================================================================
  // Métodos auxiliares
  // ============================================================================

  private buildInventoryFilter = (filter: dtos.FindAllInventoryDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    
    if (filter.idWarehouse) {
      where.idWarehouse = filter.idWarehouse;
    }
    
    if (filter.idInput) {
      where.idInput = filter.idInput;
    }
    
    if (filter.minStock !== undefined) {
      where.quantityAvailable = {
        [sequelize.Op.gte]: filter.minStock,
      };
    }
    
    return where;
  };

  private buildInventoryMovementFilter = (filter: dtos.FindAllInventoryMovementDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    
    if (filter.idInventory) {
      where.idInventory = filter.idInventory;
    }
    
    if (filter.idWarehouse) {
      where.idWarehouse = filter.idWarehouse;
    }
    
    if (filter.idInput) {
      where.idInput = filter.idInput;
    }
    
    if (filter.movementType) {
      where.movementType = filter.movementType;
    }
    
    if (filter.dateFrom || filter.dateTo) {
      where.dateMovement = {};
      if (filter.dateFrom) {
        where.dateMovement[sequelize.Op.gte] = new Date(filter.dateFrom);
      }
      if (filter.dateTo) {
        where.dateMovement[sequelize.Op.lte] = new Date(filter.dateTo);
      }
    }
    
    return where;
  };

  private buildProjectAssignmentFilter = (filter: dtos.FindAllProjectAssignmentDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};
    
    if (filter.idCostCenterProject) {
      where.idCostCenterProject = filter.idCostCenterProject;
    }
    
    if (filter.idInput) {
      where.idInput = filter.idInput;
    }
    
    if (filter.status) {
      where.status = filter.status;
    }
    
    return where;
  };

  private extractSqlErrorMessage = (error: any): string => {
    if (error.parent && error.parent.message) {
      return error.parent.message;
    }
    if (error.original && error.original.message) {
      return error.original.message;
    }
    if (error.message) {
      return error.message;
    }
    return "Error desconocido en la base de datos";
  };
}
