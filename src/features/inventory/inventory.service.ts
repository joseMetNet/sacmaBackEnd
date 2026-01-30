import { InventoryRepository } from "./inventory.repository";
import * as dtos from "./inventory.interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { ResponseEntity } from "../employee/interface";
import sequelize from "sequelize";
import { PurchaseRepository } from "../purchase/purchase.repository";
import { RevenueCenterRepository } from "../revenue-center/revenue-center.repository";
import { uploadFile, deleteFile } from "../../utils/upload-files";
import { CustomError } from "../../utils/custom-error";
import crypto from "crypto";

export class InventoryService {
  private readonly inventoryRepository: InventoryRepository;
  private readonly purchaseRepository: PurchaseRepository;
  private readonly revenueCenterRepository: RevenueCenterRepository;

  constructor(inventoryRepository: InventoryRepository) {
    this.inventoryRepository = inventoryRepository;
    this.purchaseRepository = new PurchaseRepository();
    this.revenueCenterRepository = new RevenueCenterRepository();
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
          idPurchaseRequest: data?.idPurchaseRequest,
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
      
      // Verificar si el resultado indica éxito (tiene idProjectAssignment)
      if (result && result.idProjectAssignment) {
        return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
          message: "Material asignado al proyecto correctamente",
          data: result,
        });
      }
      
      // Si no hay idProjectAssignment, algo falló
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al asignar material al proyecto",
        details: "No se pudo completar la asignación",
      });
    } catch (error: any) {
      console.error("Error in assignMaterialToProject service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      
      // Log adicional para debugging
      console.log("Error details:", {
        message: error.message,
        parent: error.parent?.message,
        original: error.original?.message
      });
      
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
      const result = await this.inventoryRepository.returnMaterialFromProject(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: result.message || "Material devuelto correctamente",
        data: result,
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
   * Registra el uso/consumo de material en un proyecto
   */
  useMaterialInProject = async (data: dtos.UseMaterialInProjectDTO): Promise<ResponseEntity> => {
    try {
      await this.inventoryRepository.useMaterialInProject(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Uso de material registrado correctamente",
        data: {
          idProjectAssignment: data.idProjectAssignment,
          quantityUsed: data.quantityUsed,
        },
      });
    } catch (error: any) {
      console.error("Error in useMaterialInProject service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al registrar uso de material en proyecto",
        details: errorMessage,
      });
    }
  };

  /**
   * Registra el saldo de material en un proyecto basado en inventario físico
   */
  recordProjectMaterialBalance = async (data: dtos.RecordProjectMaterialBalanceDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.recordProjectMaterialBalance(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: result.message || "Saldo de material en proyecto registrado correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in recordProjectMaterialBalance service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al registrar saldo de material en proyecto",
        details: errorMessage,
      });
    }
  };

  /**
   * Ajusta el balance del proyecto basado en cantidad pendiente
   */
  editProjectMaterialAssignment = async (data: dtos.EditProjectMaterialAssignmentDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.editProjectMaterialAssignment(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: result.message || "Balance del proyecto ajustado correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in editProjectMaterialAssignment service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al ajustar balance del proyecto",
        details: errorMessage,
      });
    }
  };

  /**
   * Edita la cantidad devuelta de un proyecto
   */
  editReturnedMaterial = async (data: dtos.EditReturnedMaterialDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.editReturnedMaterial(data);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: result.message || "Cantidad devuelta actualizada correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in editReturnedMaterial service:", error);
      const errorMessage = this.extractSqlErrorMessage(error);
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
        message: "Error al editar cantidad devuelta",
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
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const filter = this.buildInventoryFilter(request);

      // Si pageSize es -1, retornar todos los registros sin paginación
      if (pageSize === -1) {
        const inventory = await this.inventoryRepository.findAllInventoryWithoutPagination(filter);
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: inventory.rows });
      }

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
   * Encuentra todos los inventarios de una bodega específica
   */
  findInventoryByWarehouse = async (idWarehouse: number, request: dtos.FindInventoryByWarehouseDTO): Promise<ResponseEntity> => {
    try {
      let page = 1;
      if (request.page) {
        page = request.page;
      }
      let pageSize = 10;
      if (request.pageSize) {
        pageSize = request.pageSize;
      }
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const filter = this.buildInventoryByWarehouseFilter(request);

      // Si pageSize es -1, retornar todos los registros sin paginación
      if (pageSize === -1) {
        const inventories = await this.inventoryRepository.findAllInventoryByWarehouse(idWarehouse, filter);
        
        // Calcular priceAvailable para cada item y totalAvailable
        const dataWithPrices = inventories.rows.map((item: any) => {
          const cost = parseFloat(item.Input?.cost || "0");
          const quantityAvailable = parseFloat(item.quantityAvailable?.toString() || "0");
          const priceAvailable = cost * quantityAvailable;
          
          return {
            ...item.toJSON(),
            priceAvailable: priceAvailable.toFixed(2)
          };
        });

        // Calcular totalAvailable
        const totalAvailable = dataWithPrices.reduce((sum, item) => {
          return sum + parseFloat(item.priceAvailable);
        }, 0);

        // Actualizar averageCost en TB_InventoryPurchase
        try {
          await this.purchaseRepository.updateInventoryPurchaseAverageCost(idWarehouse, totalAvailable);
        } catch (updateError) {
          console.error("Error updating averageCost in TB_InventoryPurchase:", updateError);
          // No fallar la petición si la actualización falla
        }

        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { 
          data: dataWithPrices,
          totalAvailable: totalAvailable.toFixed(2)
        });
      }

      const inventories = await this.inventoryRepository.findInventoryByWarehouse(idWarehouse, filter, limit, offset);
      
      // Calcular priceAvailable para cada item y totalAvailable
      const dataWithPrices = inventories.rows.map((item: any) => {
        // const cost = parseFloat(item.averageCost || "0");
        const cost = parseFloat(item.Input?.cost || "0");
        const quantityAvailable = parseFloat(item.quantityAvailable?.toString() || "0");
        const priceAvailable = cost * quantityAvailable;
        
        return {
          ...item.toJSON(),
          priceAvailable: priceAvailable.toFixed(2)
        };
      });

      // Calcular totalAvailable
      const totalAvailable = dataWithPrices.reduce((sum, item) => {
        return sum + parseFloat(item.priceAvailable);
      }, 0);

      // Actualizar averageCost en TB_InventoryPurchase
      try {
        await this.purchaseRepository.updateInventoryPurchaseAverageCost(idWarehouse, totalAvailable);
      } catch (updateError) {
        console.error("Error updating averageCost in TB_InventoryPurchase:", updateError);
        // No fallar la petición si la actualización falla
      }

      const response = {
        data: dataWithPrices,
        totalItems: inventories.count,
        currentPage: page,
        totalPages: Math.ceil(inventories.count / pageSize),
        totalAvailable: totalAvailable.toFixed(2)
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error: any) {
      console.error("Error in findInventoryByWarehouse service:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar inventario por bodega",
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

  private buildInventoryByWarehouseFilter = (filter: dtos.FindInventoryByWarehouseDTO): { [key: string]: any } => {
    let where: { [key: string]: any } = {};

    if (filter.inputName) {
      where.name = { [sequelize.Op.like]: `%${filter.inputName}%` };
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

  /**
   * Obtiene todos los centros de ingresos sin paginación
   */
  findAllRevenueCenters = async (): Promise<ResponseEntity> => {
    try {
      const revenueCenters = await this.revenueCenterRepository.findAll(999999, 0);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, revenueCenters.rows);
    } catch (error: any) {
      console.error("Error in findAllRevenueCenters:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar los centros de ingresos"
      });
    }
  };

  /**
   * Obtiene resumen de materiales por proyecto con datos de cotización
   */
  getMaterialsSummaryByProject = async (
    idCostCenterProject: number,
    page?: number,
    pageSize?: number
  ): Promise<ResponseEntity> => {
    try {
      const currentPage = page || 1;
      const currentPageSize = pageSize || 10;
      const returnAll = currentPageSize === -1;

      let result;
      if (returnAll) {
        // Sin paginación, retornar todo
        result = await this.inventoryRepository.findMaterialsSummaryByProject(idCostCenterProject);
      } else {
        // Con paginación
        const limit = currentPageSize;
        const offset = (currentPage - 1) * currentPageSize;
        result = await this.inventoryRepository.findMaterialsSummaryByProject(idCostCenterProject, limit, offset);
      }

      // Calcular totales
      const totals = {
        totalShipped: result.rows.reduce((sum: number, item: any) => sum + (parseFloat(item.shipped) || 0), 0),
        totalCostSend: result.rows.reduce((sum: number, item: any) => sum + (parseFloat(item.totalCostSend) || 0), 0),
        totalBudgeted: result.rows.reduce((sum: number, item: any) => sum + (parseFloat(item.budgeted) || 0), 0),
        totalContracted: result.rows.reduce((sum: number, item: any) => sum + (parseFloat(item.contracted) || 0), 0),
      };

      // Retornar siempre la estructura completa con paginación
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: result.rows,
        totals: totals,
        totalItems: result.count,
        currentPage: returnAll ? 1 : currentPage,
        totalPages: returnAll ? 1 : Math.ceil(result.count / currentPageSize)
      });
    } catch (error: any) {
      console.error("Error in getMaterialsSummaryByProject:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar el resumen de materiales del proyecto"
      });
    }
  };

  /**
   * Obtiene asignaciones de proyecto con devoluciones
   */
  getProjectAssignmentsWithReturns = async (
    idCostCenterProject: number,
    page?: number,
    pageSize?: number
  ): Promise<ResponseEntity> => {
    try {
      const currentPage = page || 1;
      const currentPageSize = pageSize || 10;
      const returnAll = currentPageSize === -1;

      let result;
      if (returnAll) {
        // Sin paginación, retornar todo
        result = await this.inventoryRepository.findProjectAssignmentsWithReturns(idCostCenterProject);
      } else {
        // Con paginación
        const limit = currentPageSize;
        const offset = (currentPage - 1) * currentPageSize;
        result = await this.inventoryRepository.findProjectAssignmentsWithReturns(idCostCenterProject, limit, offset);
      }

      // Calcular total del valor devuelto
      const totalValorDevuelto = result.rows.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.ValorDevuelto) || 0), 0
      );

      // Retornar siempre la estructura completa con paginación
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: result.rows,
        totalItems: result.count,
        currentPage: returnAll ? 1 : currentPage,
        totalPages: returnAll ? 1 : Math.ceil(result.count / currentPageSize),
        totalValorDevuelto: totalValorDevuelto.toFixed(2)
      });
    } catch (error: any) {
      console.error("Error in getProjectAssignmentsWithReturns:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar asignaciones con devoluciones"
      });
    }
  };

  // ============================================================================
  // Métodos para documentos y motivos de devolución
  // ============================================================================

  /**
   * Guarda un documento de inventario (fotos/PDFs de evidencia)
   */
  saveInventoryDocument = async (request: {
    data: dtos.UploadInventoryDocumentDTO;
    filePath?: string;
    fileExtension?: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
  }): Promise<ResponseEntity> => {
    try {
      if (!request.filePath) {
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
          message: "No se proporcionó archivo para subir",
        });
      }

      // Generar identificador único para el archivo
      const identifier = crypto.randomUUID();
      const contentType = request.fileExtension === "pdf" ? "application/pdf" : "image/jpeg";
      
      // Subir archivo a Azure Blob Storage (contenedor "inventory")
      const uploadResponse = await uploadFile(
        request.filePath,
        identifier,
        contentType,
        "order"
      );

      if (uploadResponse instanceof CustomError) {
        console.error(uploadResponse);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
          message: "Error al subir el archivo a Azure Blob Storage",
        });
      }

      // Construir URL del archivo en Azure
      const fileUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${request.fileExtension === "pdf" ? "pdf" : "png"}`;

      // Guardar metadata en base de datos
      const result = await this.inventoryRepository.saveInventoryDocument({
        ...request.data,
        fileName: `${identifier}.${request.fileExtension}`,
        fileExtension: `.${request.fileExtension}`,
        filePath: fileUrl,
        fileSize: request.fileSize,
        mimeType: request.mimeType,
      });

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, result);
    } catch (error: any) {
      console.error("Error in saveInventoryDocument:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al guardar el documento",
        details: error.message,
      });
    }
  };

  /**
   * Consulta documentos de inventario
   */
  findInventoryDocuments = async (filter: {
    idInventoryMovement?: number;
    idProjectAssignment?: number;
    documentType?: string;
  }): Promise<ResponseEntity> => {
    try {
      const documents = await this.inventoryRepository.findInventoryDocuments(filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: documents,
        count: documents.length,
      });
    } catch (error: any) {
      console.error("Error in findInventoryDocuments:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar documentos",
      });
    }
  };

  /**
   * Obtiene todos los motivos de devolución
   */
  getAllReturnReasons = async (): Promise<ResponseEntity> => {
    try {
      const reasons = await this.inventoryRepository.findAllReturnReasons();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, reasons);
    } catch (error: any) {
      console.error("Error in getAllReturnReasons:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar motivos de devolución",
      });
    }
  };

  /**
   * Obtiene documentos de inventario físico por proyecto y fecha con paginación
   */
  getPhysicalInventoryDocuments = async (data: dtos.FindPhysicalInventoryDocumentsDTO): Promise<ResponseEntity> => {
    try {
      const page = data.page || 1;
      const pageSize = data.pageSize || 10;

      let result;
      if (pageSize === -1) {
        // Sin paginación
        result = await this.inventoryRepository.findPhysicalInventoryDocuments(data.idCostCenterProject, data.date);
      } else {
        // Con paginación
        const offset = (page - 1) * pageSize;
        result = await this.inventoryRepository.findPhysicalInventoryDocuments(
          data.idCostCenterProject,
          data.date,
          pageSize,
          offset
        );
      }

      const totalPages = pageSize === -1 ? 1 : Math.ceil(result.count / pageSize);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: result.rows,
        totalItems: result.count,
        currentPage: pageSize === -1 ? 1 : page,
        totalPages,
      });
    } catch (error: any) {
      console.error("Error in getPhysicalInventoryDocuments:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar documentos de inventario físico",
      });
    }
  };

  /**
   * Actualiza el archivo de un documento de inventario (reemplaza el archivo existente)
   */
  updateInventoryDocument = async (request: {
    idInventoryDocument: number;
    filePath?: string;
    fileExtension?: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
  }): Promise<ResponseEntity> => {
    try {
      if (!request.filePath) {
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
          message: "No se proporcionó archivo para actualizar",
        });
      }

      // Generar identificador único para el nuevo archivo
      const identifier = crypto.randomUUID();
      const contentType = request.fileExtension === "pdf" ? "application/pdf" : "image/jpeg";
      
      // Subir nuevo archivo a Azure Blob Storage
      const uploadResponse = await uploadFile(
        request.filePath,
        identifier,
        contentType,
        "order"
      );

      if (uploadResponse instanceof CustomError) {
        console.error(uploadResponse);
        return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
          message: "Error al subir el archivo a Azure Blob Storage",
        });
      }

      // Construir URL del archivo en Azure
      const fileUrl = `https://sacmaback.blob.core.windows.net/order/${identifier}.${request.fileExtension === "pdf" ? "pdf" : "png"}`;

      // Actualizar en la base de datos
      const updateData: dtos.UpdateInventoryDocumentDTO = {
        idInventoryDocument: request.idInventoryDocument,
        filePath: fileUrl,
        fileExtension: `.${request.fileExtension}`,
        fileSize: request.fileSize,
        mimeType: request.mimeType,
        originalName: request.originalName,
      };

      await this.inventoryRepository.updateInventoryDocument(updateData);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Documento actualizado exitosamente",
        filePath: fileUrl,
      });
    } catch (error: any) {
      console.error("Error in updateInventoryDocument:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al actualizar el documento",
      });
    }
  };

  /**
   * Desactiva un documento de inventario (borrado lógico)
   */
  deleteInventoryDocument = async (data: dtos.DeleteInventoryDocumentDTO): Promise<ResponseEntity> => {
    try {
      await this.inventoryRepository.deleteInventoryDocument(data);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Documento desactivado exitosamente",
      });
    } catch (error: any) {
      console.error("Error in deleteInventoryDocument:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al desactivar el documento",
      });
    }
  };

  /**
   * Obtiene devoluciones con documentos adjuntos por proyecto con paginación
   */
  getReturnDocuments = async (data: dtos.FindReturnDocumentsDTO): Promise<ResponseEntity> => {
    try {
      const page = data.page || 1;
      const pageSize = data.pageSize || 10;

      let result;
      if (pageSize === -1) {
        // Sin paginación
        result = await this.inventoryRepository.findReturnDocuments(data.idCostCenterProject);
      } else {
        // Con paginación
        const offset = (page - 1) * pageSize;
        result = await this.inventoryRepository.findReturnDocuments(
          data.idCostCenterProject,
          pageSize,
          offset
        );
      }

      const totalPages = pageSize === -1 ? 1 : Math.ceil(result.count / pageSize);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: result.rows,
        totalItems: result.count,
        currentPage: pageSize === -1 ? 1 : page,
        totalPages,
      });
    } catch (error: any) {
      console.error("Error in getReturnDocuments:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar devoluciones con documentos",
      });
    }
  };

  /**
   * Obtiene resumen de devoluciones agrupadas por fecha
   */
  getReturnsSummaryByDate = async (data: dtos.FindReturnsSummaryByDateDTO): Promise<ResponseEntity> => {
    try {
      const results = await this.inventoryRepository.findReturnsSummaryByDate(data.idCostCenterProject);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: results,
        totalItems: results.length,
      });
    } catch (error: any) {
      console.error("Error in getReturnsSummaryByDate:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar resumen de devoluciones por fecha",
      });
    }
  };

  /**
   * Obtiene detalle de devoluciones por fecha específica
   */
  getReturnsDetailByDate = async (data: dtos.FindReturnsDetailByDateDTO): Promise<ResponseEntity> => {
    try {
      const results = await this.inventoryRepository.findReturnsDetailByDate(
        data.idCostCenterProject,
        data.returnDate
      );

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: results,
        totalItems: results.length,
      });
    } catch (error: any) {
      console.error("Error in getReturnsDetailByDate:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar detalle de devoluciones por fecha",
      });
    }
  };

  /**
   * Crea un nuevo registro de balance de inventario
   */
  createInventoryBalance = async (data: dtos.CreateInventoryBalanceDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.createInventoryBalance(data);

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
        message: "Balance de inventario creado correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in createInventoryBalance:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al crear balance de inventario",
        details: error.message,
      });
    }
  };

  /**
   * Actualiza un registro de balance existente
   */
  updateInventoryBalance = async (data: dtos.UpdateInventoryBalanceDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.updateInventoryBalance(data);

      if (!result) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Balance no encontrado",
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Balance de inventario actualizado correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in updateInventoryBalance:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al actualizar balance de inventario",
        details: error.message,
      });
    }
  };

  /**
   * Obtiene todos los registros de balance por idProjectAssignment
   */
  getBalancesByAssignment = async (data: dtos.FindBalanceByAssignmentDTO): Promise<ResponseEntity> => {
    try {
      const results = await this.inventoryRepository.findBalancesByAssignment(data.idProjectAssignment);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: results,
        totalItems: results.length,
      });
    } catch (error: any) {
      console.error("Error in getBalancesByAssignment:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al consultar balances de inventario",
      });
    }
  };

  /**
   * Actualiza el balance en ProjectInventoryAssignment y registra en InventoryBalance
   */
  updateProjectAssignmentBalance = async (data: dtos.UpdateProjectAssignmentBalanceDTO): Promise<ResponseEntity> => {
    try {
      const result = await this.inventoryRepository.updateProjectAssignmentBalance(data.items);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: `Balance actualizado correctamente para ${result.updated} asignación(es)`,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in updateProjectAssignmentBalance:", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Error al actualizar balance de asignación",
        details: error.message,
      });
    }
  };
}
