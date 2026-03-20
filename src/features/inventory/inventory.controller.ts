import { Request, Response } from "express";
import { InventoryService } from "./inventory.service";
import * as schemas from "./inventory.schema";
import { UploadedFile } from "express-fileupload";

export class InventoryController {
  private readonly inventoryService: InventoryService;

  constructor(inventoryService: InventoryService) {
    this.inventoryService = inventoryService;
  }

  // ============================================================================
  // Operaciones con Stored Procedures
  // ============================================================================

  /**
   * POST /api/v1/inventory/entry
   * Registra entrada de material al inventario desde solicitud de compra
   */
  registerInventoryEntry = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.registerInventoryEntrySchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.registerInventoryEntry(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in registerInventoryEntry controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/inventory/assign-to-project
   * Asigna material del inventario a un proyecto
   */
  assignMaterialToProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.assignMaterialToProjectSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.assignMaterialToProject(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in assignMaterialToProject controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/inventory/return-from-project
   * Devuelve material no utilizado desde un proyecto
   */
  returnMaterialFromProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.returnMaterialFromProjectSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.returnMaterialFromProject(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in returnMaterialFromProject controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/inventory/use-in-project
   * Registra el uso/consumo de material en un proyecto
   */
  useMaterialInProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.useMaterialInProjectSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.useMaterialInProject(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in useMaterialInProject controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/inventory/record-material-balance
   * Registra el saldo de material en un proyecto basado en inventario físico
   */
  recordProjectMaterialBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.recordProjectMaterialBalanceSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.recordProjectMaterialBalance(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in recordProjectMaterialBalance controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/edit-project-assignment
   * Edita la cantidad asignada a un proyecto
   */
  editProjectMaterialAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.editProjectMaterialAssignmentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.editProjectMaterialAssignment(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in editProjectMaterialAssignment controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/edit-returned-material
   * Edita la cantidad devuelta de un proyecto
   */
  editReturnedMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.editReturnedMaterialSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.editReturnedMaterial(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in editReturnedMaterial controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/by-warehouse
   * Consulta el inventario actual por bodega (usando SP)
   */
  getInventoryByWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.warehouseParamSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.getInventoryByWarehouse(validation.data.idWarehouse);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getInventoryByWarehouse controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/project-materials/:idCostCenterProject
   * Consulta materiales asignados a un proyecto (usando SP)
   */
  getProjectMaterialsAssigned = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.projectParamSchema.safeParse(req.params);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.getProjectMaterialsAssigned(validation.data.idCostCenterProject);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getProjectMaterialsAssigned controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  // ============================================================================
  // Consultas con Sequelize y paginación
  // ============================================================================

  /**
   * GET /api/v1/inventory
   * Consulta inventario con filtros y paginación
   */
  findAllInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findAllInventorySchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findAllInventory(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findAllInventory controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/:idInventory
   * Consulta un inventario por ID
   */
  findInventoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idInventory = parseInt(req.params.idInventory);
      if (isNaN(idInventory)) {
        res.status(400).json({ message: "ID de inventario inválido" });
        return;
      }

      const response = await this.inventoryService.findInventoryById(idInventory);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findInventoryById controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/warehouse/:idWarehouse
   * Consulta todos los inventarios de una bodega específica
   */
  findInventoryByWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramsValidation = schemas.warehouseRouteParamSchema.safeParse(req.params);
      if (!paramsValidation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: paramsValidation.error.errors,
        });
        return;
      }

      const queryValidation = schemas.findInventoryByWarehouseSchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: queryValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findInventoryByWarehouse(
        paramsValidation.data.idWarehouse,
        queryValidation.data
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findInventoryByWarehouse controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/movements
   * Consulta movimientos de inventario con filtros
   */
  findAllInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findAllInventoryMovementSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findAllInventoryMovement(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findAllInventoryMovement controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/project-assignments
   * Consulta asignaciones de proyecto con filtros
   */
  findAllProjectAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findAllProjectAssignmentSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findAllProjectAssignment(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findAllProjectAssignment controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/revenue-centers
   * Obtiene todos los centros de ingresos sin paginación
   */
  findAllRevenueCenters = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.inventoryService.findAllRevenueCenters();
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findAllRevenueCenters controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/materials-summary/:idCostCenterProject?page=1&pageSize=10
   * Obtiene resumen de materiales por proyecto con datos de cotización
   * Usa pageSize=-1 para retornar todos los registros sin paginación
   */
  getMaterialsSummaryByProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCostCenterProject = parseInt(req.params.idCostCenterProject);
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      
      if (isNaN(idCostCenterProject)) {
        res.status(400).json({ message: "ID de proyecto inválido" });
        return;
      }

      const response = await this.inventoryService.getMaterialsSummaryByProject(
        idCostCenterProject,
        page,
        pageSize
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getMaterialsSummaryByProject controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/project-assignments-with-returns/:idCostCenterProject?page=1&pageSize=10
   * Obtiene asignaciones de proyecto con devoluciones
   * Usa pageSize=-1 para retornar todos los registros sin paginación
   */
  getProjectAssignmentsWithReturns = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramsValidation = schemas.findProjectAssignmentsWithReturnsParamSchema.safeParse(req.params);
      if (!paramsValidation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: paramsValidation.error.errors,
        });
        return;
      }

      const queryValidation = schemas.findProjectAssignmentsWithReturnsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: queryValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.getProjectAssignmentsWithReturns(
        paramsValidation.data.idCostCenterProject,
        queryValidation.data.page,
        queryValidation.data.pageSize
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getProjectAssignmentsWithReturns controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  // ============================================================================
  // Controladores para documentos y motivos de devolución
  // ============================================================================

  /**
   * POST /api/v1/inventory/documents/upload
   * Sube un documento/foto de evidencia para inventario
   */
  uploadInventoryDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.uploadInventoryDocumentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const { file: uploadedFile } = req.files as { file?: UploadedFile } || {};

      if (!uploadedFile) {
        res.status(400).json({ message: "No se proporcionó ningún archivo" });
        return;
      }

      const filePath = uploadedFile.tempFilePath;
      const fileExtension = uploadedFile.name.split(".").pop();
      const fileSize = uploadedFile.size;
      const mimeType = uploadedFile.mimetype;
      const originalName = uploadedFile.name;

      const completedRequest = {
        data: validation.data,
        filePath,
        fileExtension,
        fileSize,
        mimeType,
        originalName,
      };

      const response = await this.inventoryService.saveInventoryDocument(completedRequest);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in uploadInventoryDocument controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/documents
   * Consulta documentos de inventario con filtros
   */
  getInventoryDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findInventoryDocumentsSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findInventoryDocuments(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getInventoryDocuments controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/return-reasons
   * Obtiene todos los motivos de devolución
   */
  getReturnReasons = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.inventoryService.getAllReturnReasons();
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getReturnReasons controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/physical-inventory-documents/:idCostCenterProject
   * Obtiene documentos de inventario físico por proyecto
   */
  getPhysicalInventoryDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.findPhysicalInventoryDocumentsParamSchema.safeParse(req.params);
      const queryValidation = schemas.findPhysicalInventoryDocumentsQuerySchema.safeParse(req.query);

      if (!paramValidation.success || !queryValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: [...(paramValidation.error?.errors || []), ...(queryValidation.error?.errors || [])],
        });
        return;
      }

      const data = {
        ...paramValidation.data,
        ...queryValidation.data,
      };

      const response = await this.inventoryService.getPhysicalInventoryDocuments(data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getPhysicalInventoryDocuments controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/return-documents/:idCostCenterProject
   * Obtiene devoluciones con documentos adjuntos por proyecto
   */
  getReturnDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.findReturnDocumentsParamSchema.safeParse(req.params);
      const queryValidation = schemas.findReturnDocumentsQuerySchema.safeParse(req.query);

      if (!paramValidation.success || !queryValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: [...(paramValidation.error?.errors || []), ...(queryValidation.error?.errors || [])],
        });
        return;
      }

      const data = {
        ...paramValidation.data,
        ...queryValidation.data,
      };

      const response = await this.inventoryService.getReturnDocuments(data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getReturnDocuments controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/returns-summary/:idCostCenterProject
   * Obtiene resumen de devoluciones agrupadas por fecha
   */
  getReturnsSummaryByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.findReturnsSummaryByDateParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: paramValidation.error?.errors || [],
        });
        return;
      }

      const response = await this.inventoryService.getReturnsSummaryByDate(paramValidation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getReturnsSummaryByDate controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/returns-detail/:idCostCenterProject
   * Obtiene detalle de devoluciones por fecha específica
   */
  getReturnsDetailByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.findReturnsDetailByDateParamSchema.safeParse(req.params);
      const queryValidation = schemas.findReturnsDetailByDateQuerySchema.safeParse(req.query);

      if (!paramValidation.success || !queryValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: [...(paramValidation.error?.errors || []), ...(queryValidation.error?.errors || [])],
        });
        return;
      }

      const data = {
        ...paramValidation.data,
        ...queryValidation.data,
      };

      const response = await this.inventoryService.getReturnsDetailByDate(data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getReturnsDetailByDate controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/inventory/balance
   * Crea un nuevo registro de balance de inventario
   */
  createInventoryBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.createInventoryBalanceSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error?.errors || [],
        });
        return;
      }

      const response = await this.inventoryService.createInventoryBalance(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in createInventoryBalance controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/balance/:idBalance
   * Actualiza un registro de balance existente
   */
  updateInventoryBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.updateInventoryBalanceSchema.pick({ idBalance: true }).safeParse(req.params);
      const bodyValidation = schemas.updateInventoryBalanceSchema.omit({ idBalance: true }).safeParse(req.body);

      if (!paramValidation.success || !bodyValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: [...(paramValidation.error?.errors || []), ...(bodyValidation.error?.errors || [])],
        });
        return;
      }

      const data = {
        idBalance: paramValidation.data.idBalance,
        ...bodyValidation.data,
      };

      const response = await this.inventoryService.updateInventoryBalance(data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in updateInventoryBalance controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/balance/:idProjectAssignment
   * Obtiene todos los registros de balance por idProjectAssignment
   */
  getBalancesByAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findBalanceByAssignmentParamSchema.safeParse(req.params);

      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error?.errors || [],
        });
        return;
      }

      const response = await this.inventoryService.getBalancesByAssignment(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in getBalancesByAssignment controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/project-assignment/balance
   * Actualiza el balance en ProjectInventoryAssignment y registra historial en InventoryBalance
   */
  updateProjectAssignmentBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.updateProjectAssignmentBalanceSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error?.errors || [],
        });
        return;
      }

      const response = await this.inventoryService.updateProjectAssignmentBalance(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in updateProjectAssignmentBalance controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/documents/:idInventoryDocument
   * Actualiza el archivo (imagen o PDF) de un documento de inventario
   */
  updateInventoryDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.updateInventoryDocumentParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: paramValidation.error.errors,
        });
        return;
      }

      const { file: uploadedFile } = req.files as { file?: UploadedFile } || {};

      if (!uploadedFile) {
        res.status(400).json({ message: "No se proporcionó ningún archivo" });
        return;
      }

      const filePath = uploadedFile.tempFilePath;
      const fileExtension = uploadedFile.name.split(".").pop();
      const fileSize = uploadedFile.size;
      const mimeType = uploadedFile.mimetype;
      const originalName = uploadedFile.name;

      const completedRequest = {
        idInventoryDocument: paramValidation.data.idInventoryDocument,
        filePath,
        fileExtension,
        fileSize,
        mimeType,
        originalName,
      };

      const response = await this.inventoryService.updateInventoryDocument(completedRequest);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in updateInventoryDocument controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * DELETE /api/v1/inventory/documents/:idInventoryDocument
   * Desactiva un documento de inventario (borrado lógico)
   */
  deleteInventoryDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.deleteInventoryDocumentParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: paramValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.deleteInventoryDocument(paramValidation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in deleteInventoryDocument controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  // ============================================================================
  // DetailPriceInventoryCostCenter CRUD Operations
  // ============================================================================

  /**
   * POST /api/v1/inventory/detail-price-cost-center
   * Crear nuevo DetailPriceInventoryCostCenter
   */
  createDetailPriceInventoryCostCenter = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.createDetailPriceInventoryCostCenterSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.createDetailPriceInventoryCostCenter(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in createDetailPriceInventoryCostCenter controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/detail-price-cost-center
   * Obtener todos los DetailPriceInventoryCostCenter con filtros
   */
  findAllDetailPriceInventoryCostCenter = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.findAllDetailPriceInventoryCostCenterSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findAllDetailPriceInventoryCostCenter(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findAllDetailPriceInventoryCostCenter controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/inventory/detail-price-cost-center/:idDetailPriceInventoryCostCenter
   * Obtener DetailPriceInventoryCostCenter por ID
   */
  findDetailPriceInventoryCostCenterById = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.detailPriceInventoryCostCenterParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: paramValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.findDetailPriceInventoryCostCenterById(
        paramValidation.data.idDetailPriceInventoryCostCenter
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in findDetailPriceInventoryCostCenterById controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/inventory/detail-price-cost-center/:idDetailPriceInventoryCostCenter
   * Actualizar DetailPriceInventoryCostCenter
   */
  updateDetailPriceInventoryCostCenter = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.detailPriceInventoryCostCenterParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: paramValidation.error.errors,
        });
        return;
      }

      const bodyValidation = schemas.updateDetailPriceInventoryCostCenterSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: bodyValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.updateDetailPriceInventoryCostCenter(
        paramValidation.data.idDetailPriceInventoryCostCenter,
        bodyValidation.data
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in updateDetailPriceInventoryCostCenter controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * DELETE /api/v1/inventory/detail-price-cost-center/:idDetailPriceInventoryCostCenter
   * Eliminar DetailPriceInventoryCostCenter
   */
  deleteDetailPriceInventoryCostCenter = async (req: Request, res: Response): Promise<void> => {
    try {
      const paramValidation = schemas.detailPriceInventoryCostCenterParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        res.status(400).json({
          message: "Parámetros inválidos",
          errors: paramValidation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.deleteDetailPriceInventoryCostCenter(
        paramValidation.data.idDetailPriceInventoryCostCenter
      );
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in deleteDetailPriceInventoryCostCenter controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PATCH /api/v1/inventory/detail-price-cost-center/upsert
   * Upsert DetailPriceInventoryCostCenter (Crear o actualizar según existencia)
   */
  upsertDetailPriceInventoryCostCenter = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = schemas.upsertDetailPriceInventoryCostCenterSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validation.error.errors,
        });
        return;
      }

      const response = await this.inventoryService.upsertDetailPriceInventoryCostCenter(validation.data);
      res.status(response.code).json(response);
    } catch (error) {
      console.error("Error in upsertDetailPriceInventoryCostCenter controller:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
}
