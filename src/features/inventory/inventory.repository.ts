import { dbConnection } from "../../config";
import { QueryTypes } from "sequelize";
import { Inventory } from "./inventory.model";
import { InventoryMovement } from "./inventory-movement.model";
import { ProjectInventoryAssignment } from "./project-inventory-assignment.model";
import { InventoryBalance } from "./inventory-balance.model";
import * as dtos from "./inventory.interface";
import { idInput } from "../input/input.schema";

interface MaterialSummaryResult {
  idInput: number;
  material: string;
  performance: number;
  shipped: number;
  quantityM2: number;
  totalCostSend: number;
  budgeted: number;
  contracted: number;
  diff: number;
  idCostCenterProject: number;
  idQuotation: number | null;
  idProjectAssignment: number | null;
  inputName: string | null;
  idWarehouse: number | null;
  warehouseName: string | null;
  quantityAssigned: number;
  quantityUsed: number;
  quantityReturned: number;
  quantityPending: number;
  assignmentUnitPrice: number | null;
  assignmentTotalCost: number | null;
  assignmentDate: Date | null;
  assignmentStatus: string | null;
  createdBy: string | null;
  balance: number;
}

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
            idPurchaseRequest: data.idPurchaseRequest|| null,
            idPurchaseRequestDetail: data.idPurchaseRequestDetail|| null,
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
          @idReturnReason = :idReturnReason,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            quantityToReturn: parseFloat(data.quantityToReturn),
            idReturnReason: data.idReturnReason || null,
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result[0];
    } catch (error: any) {
      console.error("Error in returnMaterialFromProject:", error);
      throw error;
    }
  }

  /**
   * SP_UseMaterialInProject - Registra el uso/consumo de material en un proyecto
   */
  async useMaterialInProject(data: dtos.UseMaterialInProjectDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_UseMaterialInProject] 
          @idProjectAssignment = :idProjectAssignment,
          @quantityUsed = :quantityUsed,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            quantityUsed: parseFloat(data.quantityUsed),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.RAW,
        }
      );
      return result;
    } catch (error: any) {
      console.error("Error in useMaterialInProject:", error);
      throw error;
    }
  }

  /**
   * SP_RecordProjectMaterialBalance - Registra el saldo de material en un proyecto basado en inventario físico
   */
  async recordProjectMaterialBalance(data: dtos.RecordProjectMaterialBalanceDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_RecordProjectMaterialBalance] 
          @idProjectAssignment = :idProjectAssignment,
          @remainingBalance = :remainingBalance,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            remainingBalance: parseFloat(data.remainingBalance),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.RAW,
        }
      );
      return result;
    } catch (error: any) {
      console.error("Error in recordProjectMaterialBalance:", error);
      throw error;
    }
  }

  /**
   * SP_EditProjectMaterialAssignment - Ajusta el balance del proyecto según cantidad pendiente
   */
  async editProjectMaterialAssignment(data: dtos.EditProjectMaterialAssignmentDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_EditProjectMaterialAssignment] 
          @idProjectAssignment = :idProjectAssignment,
          @newQuantityPending = :newQuantityPending,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            newQuantityPending: parseFloat(data.newQuantityPending),
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result[0];
    } catch (error: any) {
      console.error("Error in editProjectMaterialAssignment:", error);
      throw error;
    }
  }

  /**
   * SP_EditReturnedMaterial - Edita la cantidad devuelta de un proyecto
   */
  async editReturnedMaterial(data: dtos.EditReturnedMaterialDTO): Promise<any> {
    try {
      const result = await dbConnection.query(
        `EXEC [mvp1].[SP_EditReturnedMaterial] 
          @idProjectAssignment = :idProjectAssignment,
          @newQuantityReturned = :newQuantityReturned,
          @idReturnReason = :idReturnReason,
          @remarks = :remarks,
          @createdBy = :createdBy`,
        {
          replacements: {
            idProjectAssignment: data.idProjectAssignment,
            newQuantityReturned: parseFloat(data.newQuantityReturned),
            idReturnReason: data.idReturnReason || null,
            remarks: data.remarks || null,
            createdBy: data.createdBy || null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return result[0];
    } catch (error: any) {
      console.error("Error in editReturnedMaterial:", error);
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
   * Encuentra todos los inventarios de una bodega específica con paginación
   */
  async findInventoryByWarehouse(idWarehouse: number, filter: any, limit?: number, offset?: number): Promise<{ rows: Inventory[]; count: number }> {
    try {
      const whereClause: any = { idWarehouse };

      const result = await Inventory.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        include: [
          {
            association: "Input",
            where: filter.inputName ? filter.inputName : undefined,
            include: [
              { association: "Supplier" }
            ]
          },
          { association: "WareHouse" },
        ],
        order: [["lastMovementDate", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findInventoryByWarehouse:", error);
      throw error;
    }
  }

  /**
   * Encuentra todos los inventarios de una bodega sin paginación
   */
  async findAllInventoryByWarehouse(idWarehouse: number, filter: any): Promise<{ rows: Inventory[]; count: number }> {
    try {
      const result = await Inventory.findAndCountAll({
        where: { idWarehouse },
        include: [
          {
            association: "Input",
            where: filter.inputName ? filter.inputName : undefined,
            include: [
              { association: "Supplier" }
            ]
          },
          { association: "WareHouse" },
        ],
        order: [["lastMovementDate", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findAllInventoryByWarehouse:", error);
      throw error;
    }
  }

  /**
   * Encuentra todos los inventarios sin paginación
   */
  async findAllInventoryWithoutPagination(filter: any): Promise<{ rows: Inventory[]; count: number }> {
    try {
      const result = await Inventory.findAndCountAll({
        where: filter,
        include: [
          { association: "Input" },
          { association: "WareHouse" },
        ],
        order: [["lastMovementDate", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.error("Error in findAllInventoryWithoutPagination:", error);
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

  /**
   * Obtiene resumen de materiales por proyecto con datos de cotización
   * Primero busca el idQuotation desde TB_RevenueCenter usando idCostCenterProject
   */
  async findMaterialsSummaryByProject(
    idCostCenterProject: number,
    limit?: number,
    offset?: number
  ): Promise<{ rows: MaterialSummaryResult[]; count: number }> {
    try {
      // Primero obtenemos el idQuotation desde TB_RevenueCenter
      const revenueCenterQuery = `
        SELECT TOP 1 idQuotation 
        FROM mvp1.TB_RevenueCenter 
        WHERE idCostCenterProject = :idCostCenterProject
      `;

      const revenueCenterResult: any = await dbConnection.query(revenueCenterQuery, {
        replacements: { idCostCenterProject },
        type: QueryTypes.SELECT,
      });

      const idQuotation = revenueCenterResult[0]?.idQuotation || null;

      // Query de conteo
      const countQuery = `
        WITH MaterialsShipped AS (
          SELECT
            ti.idInput
          FROM mvp1.TB_OrderItemDetail toid
          INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
          INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
          INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
          WHERE trc.idCostCenterProject = :idCostCenterProject AND ti.idInputType = 1
          GROUP BY ti.idInput, ti.name, ti.performance
        )
        SELECT COUNT(*) as total FROM MaterialsShipped;
      `;

      const countResult: any = await dbConnection.query(countQuery, {
        replacements: { idCostCenterProject },
        type: QueryTypes.SELECT,
      });

      const totalCount = countResult[0]?.total || 0;

      // Query principal con CTEs y paginación
      const paginationClause = limit !== undefined && offset !== undefined
        ? `OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`
        : '';

      // QUIWEY VIEJA
      //      WITH MaterialsShipped AS (
      //           SELECT DISTINCT
      //             ti.idInput,
      //             ti.name AS material,
      //             CAST(ti.performance AS DECIMAL(10,2)) AS performance,
      //             SUM(toid.quantity) AS shipped,
      //             SUM(toid.quantity) * MAX(CAST(ti.performance AS DECIMAL(10,2))) AS quantityM2,
      //             SUM(toid.quantity) * MAX(ti.cost) AS totalCostSend,
      //             MAX(trc.idCostCenterProject) AS idCostCenterProject,
      //             MAX(trc.idQuotation) AS idQuotation
      //           FROM mvp1.TB_OrderItemDetail toid
      //           INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
      //           INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
      //           INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
      //           WHERE trc.idCostCenterProject = 112 AND ti.idInputType = 1
      //           GROUP BY ti.idInput, ti.name, ti.performance
      //         ),
      //         QuotationData AS (
      //           SELECT DISTINCT
      //             tqid.idInput,
      //             SUM(tqid.quantity) AS budgeted,
      //             SUM(DISTINCT tqi.quantity) AS contracted
      //           FROM mvp1.TB_Quotation tq
      //           INNER JOIN mvp1.TB_QuotationItem tqi ON tqi.idQuotation = tq.idQuotation
      //           INNER JOIN mvp1.TB_QuotationItemDetail tqid ON tqid.idQuotationItem = tqi.idQuotationItem
      //           WHERE tq.idQuotation = 28
      //           GROUP BY tqid.idInput
      //         ),
      //         ProjectAssignments AS (
      //           SELECT DISTINCT
      //             pa.idProjectAssignment,
      //             pa.idCostCenterProject,
      //             pa.idInput,
      //             inp.name AS inputName,
      //             pa.idWarehouse,
      //             w.name AS warehouseName,
      //             pa.quantityAssigned,
      //             pa.quantityUsed,
      //             pa.quantityReturned,
      //             pa.quantityPending,
      //             pa.unitPrice,
      //             pa.totalCost,
      //             pa.assignmentDate,
      //             pa.status,
      //             pa.createdBy,
      // 			      pa.balance
      //           FROM mvp1.TB_ProjectInventoryAssignment pa
      //           LEFT JOIN mvp1.TB_Input inp ON pa.idInput = inp.idInput
      //           LEFT JOIN mvp1.TB_WareHouse w ON pa.idWarehouse = w.idWarehouse
      //           WHERE pa.idCostCenterProject = 112
      //         )
      //         SELECT DISTINCT
      //           ms.idInput,
      //           ms.material,
      //           ms.performance,
      //           ms.shipped,
      //           ms.quantityM2,
      //           ms.totalCostSend,
      //           ISNULL(qd.budgeted, 0) AS budgeted,
      //           ISNULL(qd.contracted, 0) AS contracted,
      //           ISNULL(qd.budgeted, 0) - ISNULL(qd.contracted, 0) AS diff,
      //           ms.idCostCenterProject,
      //           ms.idQuotation,
      //           pa.idProjectAssignment,
      //           pa.inputName,
      //           pa.idWarehouse,
      //           pa.warehouseName,
      //           ISNULL(pa.quantityAssigned, 0) AS quantityAssigned,
      //           ISNULL(pa.quantityUsed, 0) AS quantityUsed,
      //           ISNULL(pa.quantityReturned, 0) AS quantityReturned,
      //           ISNULL(pa.quantityPending, 0) AS quantityPending,
      //           pa.unitPrice AS assignmentUnitPrice,
      //           pa.totalCost AS assignmentTotalCost,
      //           pa.assignmentDate,
      //           pa.status AS assignmentStatus,
      //           pa.createdBy,
      //           ISNULL(pa.balance, 0) AS balance
      //           ,ISNULL(ib.balance, 0) AS balance2
      //           ,ib.idBalance
      //         FROM MaterialsShipped ms
      //         LEFT JOIN QuotationData qd ON qd.idInput = ms.idInput
      //         LEFT JOIN ProjectAssignments pa ON pa.idInput = ms.idInput
      //         LEFT JOIN mvp1.TB_InventoryBalance ib ON ib.idCostCenterProject = ms.idCostCenterProject 
      //                                                AND ib.idInput = ms.idInput
      //         ORDER BY ms.totalCostSend DESC, pa.assignmentDate DESC

      const query = `
        WITH MaterialsShipped AS (
          SELECT
            ti.idInput,
            ti.name AS material,
            CAST(ti.performance AS DECIMAL(10,2)) AS performance,
            SUM(toid.quantity) AS shipped,
            SUM(toid.quantity) * MAX(CAST(ti.performance AS DECIMAL(10,2))) AS quantityM2,
            SUM(toid.quantity) * MAX(ti.cost) AS totalCostSend,
            MAX(trc.idCostCenterProject) AS idCostCenterProject,
            MAX(trc.idQuotation) AS idQuotation
          FROM mvp1.TB_OrderItemDetail toid
          INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
          INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
          INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
          WHERE trc.idCostCenterProject = :idCostCenterProject AND ti.idInputType = 1
          GROUP BY ti.idInput, ti.name, ti.performance
        ),
        QuotationData AS (
          SELECT
            tqid.idInput,
            SUM(tqid.quantity) AS budgeted,
            SUM(DISTINCT tqi.quantity) AS contracted
          FROM mvp1.TB_Quotation tq
          INNER JOIN mvp1.TB_QuotationItem tqi ON tqi.idQuotation = tq.idQuotation
          INNER JOIN mvp1.TB_QuotationItemDetail tqid ON tqid.idQuotationItem = tqi.idQuotationItem
          WHERE tq.idQuotation = :idQuotation
          GROUP BY tqid.idInput
        ),
        ProjectAssignments AS (
          SELECT 
            pa.idProjectAssignment,
            pa.idCostCenterProject,
            pa.idInput,
            inp.name AS inputName,
            pa.idWarehouse,
            w.name AS warehouseName,
            pa.quantityAssigned,
            pa.quantityUsed,
            pa.quantityReturned,
            pa.quantityPending,
            pa.unitPrice,
            pa.totalCost,
            pa.assignmentDate,
            pa.status,
            pa.createdBy,
			      pa.balance,
            ROW_NUMBER() OVER (PARTITION BY pa.idInput ORDER BY pa.assignmentDate DESC) AS rn
          FROM mvp1.TB_ProjectInventoryAssignment pa
          LEFT JOIN mvp1.TB_Input inp ON pa.idInput = inp.idInput
          LEFT JOIN mvp1.TB_WareHouse w ON pa.idWarehouse = w.idWarehouse
          WHERE pa.idCostCenterProject = :idCostCenterProject
        ),
        LatestBalances AS (
          SELECT 
            ib.idBalance,
            ib.idCostCenterProject,
            ib.idInput,
            ib.balance,
            ROW_NUMBER() OVER (PARTITION BY ib.idCostCenterProject, ib.idInput ORDER BY ib.createdAt DESC) AS rn
          FROM mvp1.TB_InventoryBalance ib
          WHERE ib.idCostCenterProject = :idCostCenterProject
        )
        SELECT
          ms.idInput,
          ms.material,
          ms.performance,
          ms.shipped,
          ms.quantityM2,
          ms.totalCostSend,
          ISNULL(qd.budgeted, 0) AS budgeted,
          ISNULL(qd.contracted, 0) AS contracted,
          ISNULL(qd.budgeted, 0) - ISNULL(qd.contracted, 0) AS diff,
          ms.idCostCenterProject,
          ms.idQuotation,
          pa.idProjectAssignment,
          pa.inputName,
          pa.idWarehouse,
          pa.warehouseName,
          ISNULL(pa.quantityAssigned, 0) AS quantityAssigned,
          ISNULL(pa.quantityUsed, 0) AS quantityUsed,
          ISNULL(pa.quantityReturned, 0) AS quantityReturned,
          ISNULL(pa.quantityPending, 0) AS quantityPending,
          pa.unitPrice AS assignmentUnitPrice,
          pa.totalCost AS assignmentTotalCost,
          pa.assignmentDate,
          pa.status AS assignmentStatus,
          pa.createdBy,
          ISNULL(pa.balance, 0) AS balance
          ,ISNULL(lb.balance, 0) AS balance2
          ,lb.idBalance
        FROM MaterialsShipped ms
        LEFT JOIN QuotationData qd ON qd.idInput = ms.idInput
        LEFT JOIN ProjectAssignments pa ON pa.idInput = ms.idInput AND pa.rn = 1
        LEFT JOIN LatestBalances lb ON lb.idCostCenterProject = ms.idCostCenterProject 
                                    AND lb.idInput = ms.idInput
                                    AND lb.rn = 1
        ORDER BY ms.totalCostSend DESC, ms.idInput ASC
        ${paginationClause};
      `;

      const replacements: any = {
        idCostCenterProject,
        idQuotation: idQuotation || 0
      };

      if (limit !== undefined && offset !== undefined) {
        replacements.limit = limit;
        replacements.offset = offset;
      }

      const results: MaterialSummaryResult[] = await dbConnection.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return { rows: results, count: totalCount };
    } catch (error: any) {
      console.error("Error in findMaterialsSummaryByProject:", error);
      throw error;
    }
  }

  /**
   * Encuentra asignaciones de proyecto con devoluciones
   */
  async findProjectAssignmentsWithReturns(
    idCostCenterProject: number,
    limit?: number,
    offset?: number
  ): Promise<{ rows: dtos.ProjectAssignmentWithReturnResult[]; count: number }> {
    try {
      // Query de conteo
      const countQuery = `
        SELECT COUNT(*) as total
        FROM [mvp1].[TB_ProjectInventoryAssignment] pa
        WHERE pa.idCostCenterProject = :idCostCenterProject
          AND pa.quantityReturned > 0
      `;

      const countResult: any = await dbConnection.query(countQuery, {
        replacements: { idCostCenterProject },
        type: QueryTypes.SELECT,
      });

      const totalCount = countResult[0]?.total || 0;

      // Query principal con paginación
      const paginationClause = limit !== undefined && offset !== undefined
        ? `OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`
        : '';

      const query = `
        SELECT 
          pa.idProjectAssignment,
          pa.idCostCenterProject,
          pa.idInput,
          inp.name AS Material,
          w.name AS Almacen,
          CAST(pa.quantityAssigned AS DECIMAL(18,2)) AS CantidadAsignada,
          CAST(pa.quantityUsed AS DECIMAL(18,2)) AS CantidadUsada,
          CAST(pa.quantityReturned AS DECIMAL(18,2)) AS CantidadDevuelta,
          CAST(pa.quantityPending AS DECIMAL(18,2)) AS CantidadPendiente,
          CAST(pa.unitPrice AS DECIMAL(18,2)) AS PrecioUnitario,
          CAST(pa.quantityReturned * pa.unitPrice AS DECIMAL(18,2)) AS ValorDevuelto,
          pa.assignmentDate AS FechaAsignacion,
          pa.status AS Estado,
          pa.createdBy AS AsignadoPor,
          ultimaDevolucion.FechaDevolucion,
          ultimaDevolucion.NumDevoluciones
        FROM [mvp1].[TB_ProjectInventoryAssignment] pa
        LEFT JOIN [mvp1].[TB_Input] inp ON pa.idInput = inp.idInput
        LEFT JOIN [mvp1].[TB_WareHouse] w ON pa.idWarehouse = w.idWarehouse
        OUTER APPLY (
          SELECT 
            MAX(im.dateMovement) AS FechaDevolucion,
            COUNT(*) AS NumDevoluciones
          FROM [mvp1].[TB_InventoryMovement] im
          WHERE im.idCostCenterProject = pa.idCostCenterProject
            AND im.idInput = pa.idInput
            AND im.idWarehouse = pa.idWarehouse
            AND im.movementType = 'DevolucionProyecto'
        ) ultimaDevolucion
        WHERE pa.idCostCenterProject = :idCostCenterProject
          AND pa.quantityReturned > 0
        ORDER BY pa.assignmentDate DESC
        ${paginationClause}
      `;

      const replacements: any = { idCostCenterProject };

      if (limit !== undefined && offset !== undefined) {
        replacements.limit = limit;
        replacements.offset = offset;
      }

      const results: dtos.ProjectAssignmentWithReturnResult[] = await dbConnection.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return { rows: results, count: totalCount };
    } catch (error: any) {
      console.error("Error in findProjectAssignmentsWithReturns:", error);
      throw error;
    }
  }

  // ============================================================================
  // Métodos para documentos de inventario
  // ============================================================================

  /**
   * Guarda información del documento en la base de datos
   */
  async saveInventoryDocument(data: {
    idInventoryMovement?: number;
    idProjectAssignment?: number;
    idCostCenterProject?: number;
    documentType: string;
    fileName: string;
    fileExtension: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    description?: string;
    uploadedBy: string;
  }): Promise<dtos.InventoryDocumentResult> {
    try {
      const query = `
        INSERT INTO [mvp1].[TB_InventoryDocument]
        (idInventoryMovement, idProjectAssignment, idCostCenterProject, documentType, fileName, fileExtension,
         filePath, fileSize, mimeType, description, uploadedBy, uploadedAt, isActive)
        VALUES
        (:idInventoryMovement, :idProjectAssignment, :idCostCenterProject, :documentType, :fileName, :fileExtension,
         :filePath, :fileSize, :mimeType, :description, :uploadedBy, GETDATE(), 1);
        
        SELECT * FROM [mvp1].[TB_InventoryDocument] WHERE idInventoryDocument = SCOPE_IDENTITY();
      `;

      const result: any = await dbConnection.query(query, {
        replacements: {
          idInventoryMovement: data.idInventoryMovement || null,
          idProjectAssignment: data.idProjectAssignment || null,
          idCostCenterProject: data.idCostCenterProject || null,
          documentType: data.documentType,
          fileName: data.fileName,
          fileExtension: data.fileExtension,
          filePath: data.filePath,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          description: data.description || null,
          uploadedBy: data.uploadedBy,
        },
        type: QueryTypes.SELECT,
      });

      return result[0];
    } catch (error: any) {
      console.error("Error in saveInventoryDocument:", error);
      throw error;
    }
  }

  /**
   * Consulta documentos de inventario con filtros
   */
  async findInventoryDocuments(filter: {
    idInventoryMovement?: number;
    idProjectAssignment?: number;
    documentType?: string;
  }): Promise<dtos.InventoryDocumentResult[]> {
    try {
      let whereClause = "WHERE isActive = 1";
      const replacements: any = {};

      if (filter.idInventoryMovement) {
        whereClause += " AND idInventoryMovement = :idInventoryMovement";
        replacements.idInventoryMovement = filter.idInventoryMovement;
      }

      if (filter.idProjectAssignment) {
        whereClause += " AND idProjectAssignment = :idProjectAssignment";
        replacements.idProjectAssignment = filter.idProjectAssignment;
      }

      if (filter.documentType) {
        whereClause += " AND documentType = :documentType";
        replacements.documentType = filter.documentType;
      }

      const query = `
        SELECT * FROM [mvp1].[TB_InventoryDocument]
        ${whereClause}
        ORDER BY uploadedAt DESC
      `;

      const results: dtos.InventoryDocumentResult[] = await dbConnection.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return results;
    } catch (error: any) {
      console.error("Error in findInventoryDocuments:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los motivos de devolución activos
   */
  async findAllReturnReasons(): Promise<dtos.ReturnReasonResult[]> {
    try {
      const query = `
        SELECT idReturnReason, reasonCode, reasonName, requiresDocument, isActive
        FROM [mvp1].[TB_ReturnReason]
        WHERE isActive = 1
        ORDER BY reasonName
      `;

      const results: dtos.ReturnReasonResult[] = await dbConnection.query(query, {
        type: QueryTypes.SELECT,
      });

      return results;
    } catch (error: any) {
      console.error("Error in findAllReturnReasons:", error);
      throw error;
    }
  }

  /**
   * Obtiene documentos de inventario físico por proyecto y fecha con paginación
   */
  async findPhysicalInventoryDocuments(
    idCostCenterProject: number,
    date: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: dtos.PhysicalInventoryDocumentResult[]; count: number }> {
    try {
      // Query de conteo
      const countQuery = `
        SELECT COUNT(*) as total
        FROM [mvp1].[TB_InventoryDocument] AS invDoc
        WHERE invDoc.idCostCenterProject = :idCostCenterProject
          AND CAST(invDoc.uploadedAt AS DATE) = :date
          AND invDoc.isActive = 1
      `;

      const countResult: any = await dbConnection.query(countQuery, {
        replacements: { idCostCenterProject, date },
        type: QueryTypes.SELECT,
      });

      const totalCount = countResult[0]?.total || 0;

      // Query principal con paginación
      const paginationClause = limit !== undefined && offset !== undefined
        ? `OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`
        : '';

      const query = `
        SELECT
          invDoc.idInventoryDocument,
          invDoc.idCostCenterProject,
          invDoc.filePath,
          invDoc.description,
          invDoc.fileExtension,
          invDoc.uploadedBy,
          invDoc.uploadedAt,
          invDoc.isActive
        FROM [mvp1].[TB_InventoryDocument] AS invDoc
        WHERE invDoc.idCostCenterProject = :idCostCenterProject
          AND CAST(invDoc.uploadedAt AS DATE) = :date
          AND invDoc.isActive = 1
        ORDER BY invDoc.uploadedAt DESC
        ${paginationClause}
      `;

      const replacements: any = { idCostCenterProject, date };

      if (limit !== undefined && offset !== undefined) {
        replacements.limit = limit;
        replacements.offset = offset;
      }

      const results: dtos.PhysicalInventoryDocumentResult[] = await dbConnection.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return { rows: results, count: totalCount };
    } catch (error: any) {
      console.error("Error in findPhysicalInventoryDocuments:", error);
      throw error;
    }
  }

  /**
   * Actualiza el archivo (filePath y metadatos) de un documento de inventario
   */
  async updateInventoryDocument(data: dtos.UpdateInventoryDocumentDTO): Promise<boolean> {
    try {
      const query = `
        UPDATE [mvp1].[TB_InventoryDocument]
        SET filePath = :filePath,
            fileExtension = COALESCE(:fileExtension, fileExtension),
            fileSize = COALESCE(:fileSize, fileSize),
            mimeType = COALESCE(:mimeType, mimeType)
        WHERE idInventoryDocument = :idInventoryDocument
      `;

      await dbConnection.query(query, {
        replacements: {
          idInventoryDocument: data.idInventoryDocument,
          filePath: data.filePath,
          fileExtension: data.fileExtension || null,
          fileSize: data.fileSize || null,
          mimeType: data.mimeType || null,
        },
        type: QueryTypes.UPDATE,
      });

      return true;
    } catch (error: any) {
      console.error("Error in updateInventoryDocument:", error);
      throw error;
    }
  }

  /**
   * Desactiva un documento de inventario (borrado lógico)
   */
  async deleteInventoryDocument(data: dtos.DeleteInventoryDocumentDTO): Promise<boolean> {
    try {
      const query = `
        UPDATE [mvp1].[TB_InventoryDocument]
        SET isActive = 0
        WHERE idInventoryDocument = :idInventoryDocument
      `;

      await dbConnection.query(query, {
        replacements: {
          idInventoryDocument: data.idInventoryDocument,
        },
        type: QueryTypes.UPDATE,
      });

      return true;
    } catch (error: any) {
      console.error("Error in deleteInventoryDocument:", error);
      throw error;
    }
  }

  /**
   * Obtiene devoluciones con sus documentos adjuntos por proyecto con paginación
   */
  async findReturnDocuments(
    idCostCenterProject: number,
    limit?: number,
    offset?: number
  ): Promise<{ rows: dtos.ReturnDocumentResult[]; count: number }> {
    try {
      // Query de conteo
      const countQuery = `
        SELECT COUNT(DISTINCT im.idInventoryMovement) as total
        FROM [mvp1].[TB_InventoryMovement] im
        WHERE im.movementType = 'DevolucionProyecto' 
          AND im.idCostCenterProject = :idCostCenterProject
      `;

      const countResult: any = await dbConnection.query(countQuery, {
        replacements: { idCostCenterProject },
        type: QueryTypes.SELECT,
      });

      const totalCount = countResult[0]?.total || 0;

      // Query principal con paginación
      const paginationClause = limit !== undefined && offset !== undefined
        ? `OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`
        : '';

      const query = `
        SELECT 
          im.idInventoryMovement,
          im.idCostCenterProject AS Proyecto,
          inp.name AS Material,
          im.quantity AS CantidadDevuelta,
          rr.reasonName AS Motivo,
          im.remarks AS Observaciones,
          im.dateMovement AS FechaDevolucion,
          COUNT(doc.idInventoryDocument) AS NumDocumentos,
          doc.filePath
        FROM [mvp1].[TB_InventoryMovement] im
        LEFT JOIN [mvp1].[TB_Input] inp ON im.idInput = inp.idInput
        LEFT JOIN [mvp1].[TB_ReturnReason] rr ON im.idReturnReason = rr.idReturnReason
        LEFT JOIN [mvp1].[TB_InventoryDocument] doc ON im.idInventoryMovement = doc.idInventoryMovement
        WHERE im.movementType = 'DevolucionProyecto' 
          AND im.idCostCenterProject = :idCostCenterProject
        GROUP BY im.idInventoryMovement, im.idCostCenterProject, inp.name, im.quantity, 
                 rr.reasonName, im.remarks, im.dateMovement, doc.filePath
        ORDER BY im.dateMovement DESC
        ${paginationClause}
      `;

      const replacements: any = { idCostCenterProject };

      if (limit !== undefined && offset !== undefined) {
        replacements.limit = limit;
        replacements.offset = offset;
      }

      const results: dtos.ReturnDocumentResult[] = await dbConnection.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return { rows: results, count: totalCount };
    } catch (error: any) {
      console.error("Error in findReturnDocuments:", error);
      throw error;
    }
  }

  /**
   * Obtiene resumen de devoluciones agrupadas por fecha
   */
  async findReturnsSummaryByDate(
    idCostCenterProject: number
  ): Promise<dtos.ReturnsSummaryByDateResult[]> {
    try {
      const query = `
        SELECT 
          CAST(im.dateMovement AS DATE) AS FechaDevolucion,
          COUNT(*) AS TotalDevoluciones,
          SUM(im.quantity) AS CantidadTotalDevuelta,
          STRING_AGG(inp.name, ', ') AS Materiales,
          STRING_AGG(rr.reasonName, ', ') AS Motivos
        FROM [mvp1].[TB_InventoryMovement] im
        INNER JOIN [mvp1].[TB_Input] inp ON im.idInput = inp.idInput
        LEFT JOIN [mvp1].[TB_ReturnReason] rr ON im.idReturnReason = rr.idReturnReason
        WHERE im.movementType = 'DevolucionProyecto'
          AND im.idCostCenterProject = :idCostCenterProject
        GROUP BY CAST(im.dateMovement AS DATE)
        ORDER BY CAST(im.dateMovement AS DATE) ASC
      `;

      const results: dtos.ReturnsSummaryByDateResult[] = await dbConnection.query(query, {
        replacements: { idCostCenterProject },
        type: QueryTypes.SELECT,
      });

      return results;
    } catch (error: any) {
      console.error("Error in findReturnsSummaryByDate:", error);
      throw error;
    }
  }

  /**
   * Obtiene detalle de devoluciones por fecha específica
   */
  async findReturnsDetailByDate(
    idCostCenterProject: number,
    returnDate: string
  ): Promise<dtos.ReturnsDetailByDateResult[]> {
    try {
      const query = `
        SELECT 
          im.idInventoryMovement,
          CAST(im.dateMovement AS DATE) AS FechaDevolucion,
          FORMAT(im.dateMovement, 'HH:mm:ss') AS HoraDevolucion,
          im.idCostCenterProject AS Proyecto,
          inp.name AS Material,
          im.quantity AS CantidadDevuelta,
          rr.reasonCode AS CodigoMotivo,
          rr.reasonName AS Motivo,
          im.remarks AS Observaciones,
          im.createdBy AS UsuarioRegistro,
          CASE 
            WHEN doc.idInventoryDocument IS NOT NULL THEN 'Sí'
            ELSE 'No'
          END AS TieneEvidencia,
          doc.fileName AS ArchivoEvidencia,
          doc.filePath,
          doc.fileExtension AS TipoArchivo
          ,doc.description
          ,doc.idProjectAssignment
        FROM [mvp1].[TB_InventoryMovement] im
        INNER JOIN [mvp1].[TB_Input] inp ON im.idInput = inp.idInput
        LEFT JOIN [mvp1].[TB_ReturnReason] rr ON im.idReturnReason = rr.idReturnReason
        LEFT JOIN [mvp1].[TB_InventoryDocument] doc ON im.idInventoryMovement = doc.idInventoryMovement
        WHERE im.movementType = 'DevolucionProyecto' 
          AND im.idCostCenterProject = :idCostCenterProject
          AND CAST(im.dateMovement AS DATE) = :returnDate
        ORDER BY im.dateMovement ASC
      `;

      const results: dtos.ReturnsDetailByDateResult[] = await dbConnection.query(query, {
        replacements: { idCostCenterProject, returnDate },
        type: QueryTypes.SELECT,
      });

      return results;
    } catch (error: any) {
      console.error("Error in findReturnsDetailByDate:", error);
      throw error;
    }
  }

  // ============================================================================
  // Métodos para TB_InventoryBalance
  // ============================================================================

  /**
   * Crea un nuevo registro de balance de inventario
   */
  async createInventoryBalance(data: dtos.CreateInventoryBalanceDTO): Promise<dtos.InventoryBalanceResult> {
    try {
      const result = await InventoryBalance.create({
        idProjectAssignment: data.idProjectAssignment || null,
        idInput: data.idInput || null,
        idCostCenterProject: data.idCostCenterProject || null,
        balance: data.balance || null,
        quantity: data.quantity || null,
        createdBy: data.createdBy || null,
        remarks: data.remarks || null,
      });

      return result.toJSON() as dtos.InventoryBalanceResult;
    } catch (error: any) {
      console.error("Error in createInventoryBalance:", error);
      throw error;
    }
  }

  /**
   * Actualiza un registro de balance existente
   */
  async updateInventoryBalance(data: dtos.UpdateInventoryBalanceDTO): Promise<dtos.InventoryBalanceResult | null> {
    try {
      const balance = await InventoryBalance.findByPk(data.idBalance);

      if (!balance) {
        return null;
      }

      await balance.update({
        idProjectAssignment: data.idProjectAssignment !== undefined ? data.idProjectAssignment : balance.idProjectAssignment,
        idInput: data.idInput !== undefined ? data.idInput : balance.idInput,
        idCostCenterProject: data.idCostCenterProject !== undefined ? data.idCostCenterProject : balance.idCostCenterProject,
        balance: data.balance !== undefined ? data.balance : balance.balance,
        quantity: data.quantity !== undefined ? data.quantity : balance.quantity,
        createdBy: data.createdBy || balance.createdBy,
        remarks: data.remarks || balance.remarks,
      });

      return balance.toJSON() as dtos.InventoryBalanceResult;
    } catch (error: any) {
      console.error("Error in updateInventoryBalance:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los registros de balance por idProjectAssignment
   */
  async findBalancesByAssignment(idProjectAssignment: number): Promise<dtos.InventoryBalanceResult[]> {
    try {
      const balances = await InventoryBalance.findAll({
        where: { idProjectAssignment },
        include: [
          {
            association: "ProjectAssignment",
            include: [
              { association: "Input" },
              { association: "WareHouse" },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return balances.map(b => b.toJSON() as dtos.InventoryBalanceResult);
    } catch (error: any) {
      console.error("Error in findBalancesByAssignment:", error);
      throw error;
    }
  }

  /**
   * Actualiza el balance en ProjectInventoryAssignment y crea historial en InventoryBalance
   */
  async updateProjectAssignmentBalance(
    items: dtos.UpdateProjectAssignmentBalanceItemDTO[]
  ): Promise<dtos.UpdateProjectAssignmentBalanceResult> {
    let transaction;

    try {
      // Crear transacción
      transaction = await dbConnection.transaction();

      const results: {
        idProjectAssignment: number;
        previousBalance: number;
        newBalance: number;
        idBalanceHistory: number;
      }[] = [];

      for (const item of items) {
        // Buscar la asignación
        const assignment = await ProjectInventoryAssignment.findByPk(item.idProjectAssignment, {
          transaction,
        });

        if (!assignment) {
          await transaction.rollback();
          throw new Error(`Asignación con ID ${item.idProjectAssignment} no encontrada`);
        }

        const previousBalance = assignment.balance || 0;

        // Actualizar balance en ProjectInventoryAssignment
        await assignment.update(
          { balance: item.balance },
          { transaction }
        );

        // Crear registro en InventoryBalance (historial)
        const balanceHistory = await InventoryBalance.create(
          {
            idProjectAssignment: item.idProjectAssignment,
            idCostCenterProject: item.idCostCenterProject,
            idInput: item.idInput,
            quantity: item.quantity,  
            balance: item.balance,
            createdBy: item.createdBy || null,
            remarks: item.remarks || null,
          },
          {
            transaction,
          }
        );

        results.push({
          idProjectAssignment: item.idProjectAssignment,
          previousBalance,
          newBalance: item.balance,
          idBalanceHistory: balanceHistory.idBalance,
        });
      }

      // Commit de la transacción
      await transaction.commit();

      return {
        updated: results.length,
        items: results,
      };
    } catch (error: any) {
      // Rollback solo si la transacción existe y no fue commiteada
      if (transaction && !transaction.rollback) {
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          console.error("Error during rollback:", rollbackError);
        }
      }
      console.error("Error in updateProjectAssignmentBalance:", error);
      throw error;
    }
  }
}
