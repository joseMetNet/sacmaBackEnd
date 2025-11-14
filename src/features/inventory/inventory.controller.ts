import { Request, Response } from "express";
import { InventoryService } from "./inventory.service";
import * as schemas from "./inventory.schema";

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
}
