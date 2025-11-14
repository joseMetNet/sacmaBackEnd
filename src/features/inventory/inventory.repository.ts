import { dbConnection } from "../../config";
import { QueryTypes } from "sequelize";
import { Inventory } from "./inventory.model";
import { InventoryMovement } from "./inventory-movement.model";
import { ProjectInventoryAssignment } from "./project-inventory-assignment.model";
import * as dtos from "./inventory.interface";

export class InventoryRepository {
  
  // ============================================================================
  // Stored Procedures - Operaciones principales
  // ============================================================================

  /**
   * SP_RegisterInventoryEntry - Registra entrada de material al inventario
   */
  async registerInventoryEntry(data: dtos.RegisterInventoryEntryDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_RegisterInventoryEntry] 
          @idPurchaseRequest = :idPurchaseRequest,
          @idPurchaseRequestDetail = :idPurchaseRequestDetail,
          @idInput = :idInput,
          @idWarehouse = :idWarehouse,
          @quantity = :quantity,
          @unitPrice = :unitPrice,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idPurchaseRequest: data.idPurchaseRequest,
            idPurchaseRequestDetail: data.idPurchaseRequestDetail,
            idInput: data.idInput,
            idWarehouse: data.idWarehouse,
            quantity: parseFloat(data.quantity),
            unitPrice: parseFloat(data.unitPrice),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.RAW,
        }
      );
      return result;
    } catch (error: any) {
      console.error("Error in registerInventoryEntry:", error);
      throw error;
    }
  }

  /**
   * SP_AssignMaterialToProject - Asigna material del inventario a un proyecto
   */
  async assignMaterialToProject(data: dtos.AssignMaterialToProjectDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_AssignMaterialToProject] 
          @idCostCenterProject = :idCostCenterProject,
          @idInput = :idInput,
          @idWarehouse = :idWarehouse,
          @quantity = :quantity,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idCostCenterProject: data.idCostCenterProject,
            idInput: data.idInput,
            idWarehouse: data.idWarehouse,
            quantity: parseFloat(data.quantity),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result[0];
    } catch (error: any) {
      console.error("Error in assignMaterialToProject:", error);
      throw error;
    }
  }

  /**
   * SP_ReturnMaterialFromProject - Devuelve material no utilizado desde un proyecto
   */
  async returnMaterialFromProject(data: dtos.ReturnMaterialFromProjectDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_ReturnMaterialFromProject] 
          @idProjectAssignment = :idProjectAssignment,
          @quantityToReturn = :quantityToReturn,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            quantityToReturn: parseFloat(data.quantityToReturn),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.RAW,
        }
      );
      return result;
    } catch (error: any) {
      console.error("Error in returnMaterialFromProject:", error);
      throw error;
    }
  }

  /**
   * SP_GetInventoryByWarehouse - Consulta el inventario actual por bodega
   */
  async getInventoryByWarehouse(idWarehouse?: number): Promise<dtos.InventoryByWarehouseDTO[]> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_GetInventoryByWarehouse] @idWarehouse = :idWarehouse`,
        {
          replacements: {
            idWarehouse: idWarehouse || null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result as dtos.InventoryByWarehouseDTO[];
    } catch (error: any) {
      console.error("Error in getInventoryByWarehouse:", error);
      throw error;
    }
  }

  /**
   * SP_GetProjectMaterialsAssigned - Consulta materiales asignados a un proyecto
   */
  async getProjectMaterialsAssigned(idCostCenterProject: number): Promise<dtos.ProjectMaterialsAssignedDTO[]> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_GetProjectMaterialsAssigned] @idCostCenterProject = :idCostCenterProject`,
        {
          replacements: {
            idCostCenterProject,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result as dtos.ProjectMaterialsAssignedDTO[];
    } catch (error: any) {
      console.error("Error in getProjectMaterialsAssigned:", error);
      throw error;
    }
  }

  // ============================================================================
  // Métodos CRUD estándar con Sequelize
  // ============================================================================

  /**
   * Encuentra todos los registros de inventario con filtros
   */
  async findAllInventory(filter: any, limit: number, offset: number): Promise<{ rows: Inventory[]; count: number }> {
    try {
      const result = await Inventory.findAndCountAll({
        where: filter,
        limit,
        offset,
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
        order: [["lastMovementDate", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findAllInventory:", error);
      throw error;
    }
  }

  /**
   * Encuentra un inventario por ID
   */
  async findInventoryById(idInventory: number): Promise<Inventory | null> {
    try {
      return await Inventory.findByPk(idInventory, {
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
      });
    } catch (error: any) {
      console.error("Error in findInventoryById:", error);
      throw error;
    }
  }

  /**
   * Encuentra todos los movimientos de inventario con filtros
   */
  async findAllInventoryMovement(filter: any, limit: number, offset: number): Promise<{ rows: InventoryMovement[]; count: number }> {
    try {
      const result = await InventoryMovement.findAndCountAll({
        where: filter,
        limit,
        offset,
        include: [
          { association: "Inventory" },
          { association: "Input" },
          { association: "WareHouse" },
        ],
        order: [["dateMovement", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findAllInventoryMovement:", error);
      throw error;
    }
  }

  /**
   * Encuentra todas las asignaciones de proyecto con filtros
   */
  async findAllProjectAssignment(filter: any, limit: number, offset: number): Promise<{ rows: ProjectInventoryAssignment[]; count: number }> {
    try {
      const result = await ProjectInventoryAssignment.findAndCountAll({
        where: filter,
        limit,
        offset,
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
        order: [["assignmentDate", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findAllProjectAssignment:", error);
      throw error;
    }
  }

  /**
   * Encuentra una asignación de proyecto por ID
   */
  async findProjectAssignmentById(idProjectAssignment: number): Promise<ProjectInventoryAssignment | null> {
    try {
      return await ProjectInventoryAssignment.findByPk(idProjectAssignment, {
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
      });
    } catch (error: any) {
      console.error("Error in findProjectAssignmentById:", error);
      throw error;
    }
  }

  /**
   * Encuentra inventario por input y warehouse
   */
  async findInventoryByInputAndWarehouse(idInput: number, idWarehouse: number): Promise<Inventory | null> {
    try {
      return await Inventory.findOne({
        where: { idInput, idWarehouse },
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
      });
    } catch (error: any) {
      console.error("Error in findInventoryByInputAndWarehouse:", error);
      throw error;
    }
  }
}
