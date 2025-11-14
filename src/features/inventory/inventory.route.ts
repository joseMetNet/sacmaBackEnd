import { Application, Router } from "express";
import { InventoryController } from "./inventory.controller";
import { InventoryRepository } from "./inventory.repository";
import { InventoryService } from "./inventory.service";

export function inventoryRoute(app: Application) {
  const router = Router();
  const inventoryRepository = new InventoryRepository();
  const inventoryService = new InventoryService(inventoryRepository);
  const inventoryController = new InventoryController(inventoryService);

  // Rutas de operaciones con Stored Procedures
  router.post("/v1/inventory/entry", inventoryController.registerInventoryEntry);
  router.post("/v1/inventory/assign-to-project", inventoryController.assignMaterialToProject);
  router.post("/v1/inventory/return-from-project", inventoryController.returnMaterialFromProject);
  router.get("/v1/inventory/by-warehouse", inventoryController.getInventoryByWarehouse);
  router.get("/v1/inventory/project-materials/:idCostCenterProject", inventoryController.getProjectMaterialsAssigned);

  // Rutas de consultas con Sequelize
  router.get("/v1/inventory", inventoryController.findAllInventory);
  router.get("/v1/inventory/:idInventory", inventoryController.findInventoryById);
  router.get("/v1/inventory/movements", inventoryController.findAllInventoryMovement);
  router.get("/v1/inventory/project-assignments", inventoryController.findAllProjectAssignment);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/inventory/entry:
 *   post:
 *     tags: [Inventory]
 *     summary: Register inventory entry
 *     description: Register material entry to inventory from purchase request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPurchaseRequest
 *               - idPurchaseRequestDetail
 *               - idInput
 *               - idWarehouse
 *               - quantity
 *               - unitPrice
 *             properties:
 *               idPurchaseRequest:
 *                 type: integer
 *                 description: Purchase request ID
 *               idPurchaseRequestDetail:
 *                 type: integer
 *                 description: Purchase request detail ID
 *               idInput:
 *                 type: integer
 *                 description: Material/Input ID
 *               idWarehouse:
 *                 type: integer
 *                 description: Warehouse ID
 *               quantity:
 *                 type: string
 *                 description: Quantity to enter
 *               unitPrice:
 *                 type: string
 *                 description: Unit price
 *               remarks:
 *                 type: string
 *                 description: Observations
 *               createdBy:
 *                 type: string
 *                 description: User who created the entry
 *     responses:
 *       201:
 *         description: Entry registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/assign-to-project:
 *   post:
 *     tags: [Inventory]
 *     summary: Assign material to project
 *     description: Assign material from inventory to a project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCostCenterProject
 *               - idInput
 *               - idWarehouse
 *               - quantity
 *             properties:
 *               idCostCenterProject:
 *                 type: integer
 *                 description: Project ID
 *               idInput:
 *                 type: integer
 *                 description: Material/Input ID
 *               idWarehouse:
 *                 type: integer
 *                 description: Warehouse ID
 *               quantity:
 *                 type: string
 *                 description: Quantity to assign
 *               remarks:
 *                 type: string
 *                 description: Observations
 *               createdBy:
 *                 type: string
 *                 description: User who created the assignment
 *     responses:
 *       201:
 *         description: Material assigned successfully
 *       400:
 *         description: Invalid input data or insufficient stock
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/return-from-project:
 *   post:
 *     tags: [Inventory]
 *     summary: Return material from project
 *     description: Return unused material from a project back to inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - quantityToReturn
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID
 *               quantityToReturn:
 *                 type: string
 *                 description: Quantity to return
 *               remarks:
 *                 type: string
 *                 description: Observations
 *               createdBy:
 *                 type: string
 *                 description: User who created the return
 *     responses:
 *       200:
 *         description: Material returned successfully
 *       400:
 *         description: Invalid input data or quantity exceeds pending amount
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/by-warehouse:
 *   get:
 *     tags: [Inventory]
 *     summary: Get inventory by warehouse
 *     description: Query current inventory by warehouse using stored procedure
 *     parameters:
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: Warehouse ID (optional, returns all if not provided)
 *     responses:
 *       200:
 *         description: Inventory data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idInventory:
 *                         type: integer
 *                       idInput:
 *                         type: integer
 *                       inputName:
 *                         type: string
 *                       idWarehouse:
 *                         type: integer
 *                       warehouseName:
 *                         type: string
 *                       quantityAvailable:
 *                         type: number
 *                       quantityReserved:
 *                         type: number
 *                       quantityTotal:
 *                         type: number
 *                       averageCost:
 *                         type: number
 *                       totalValue:
 *                         type: number
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/project-materials/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get materials assigned to project
 *     description: Query materials assigned to a specific project using stored procedure
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project materials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProjectAssignment:
 *                         type: integer
 *                       idInput:
 *                         type: integer
 *                       inputName:
 *                         type: string
 *                       quantityAssigned:
 *                         type: number
 *                       quantityUsed:
 *                         type: number
 *                       quantityReturned:
 *                         type: number
 *                       quantityPending:
 *                         type: number
 *                       status:
 *                         type: string
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Find all inventory records
 *     description: Query inventory with filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: Filter by warehouse ID
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: Filter by input/material ID
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: number
 *         description: Filter by minimum stock level
 *     responses:
 *       200:
 *         description: Inventory list retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/{idInventory}:
 *   get:
 *     tags: [Inventory]
 *     summary: Find inventory by ID
 *     description: Get detailed inventory information by ID
 *     parameters:
 *       - in: path
 *         name: idInventory
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory ID
 *     responses:
 *       200:
 *         description: Inventory found
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/movements:
 *   get:
 *     tags: [Inventory]
 *     summary: Find all inventory movements
 *     description: Query inventory movements with filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: idInventory
 *         schema:
 *           type: integer
 *         description: Filter by inventory ID
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: Filter by warehouse ID
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: Filter by input/material ID
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [Entrada, Salida, AsignacionProyecto, DevolucionProyecto, Ajuste, Transferencia]
 *         description: Filter by movement type
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: Movement list retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/project-assignments:
 *   get:
 *     tags: [Inventory]
 *     summary: Find all project assignments
 *     description: Query project material assignments with filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: Filter by project ID
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: Filter by input/material ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Asignado, EnUso, Completado, Devuelto, Cancelado]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Assignment list retrieved successfully
 *       500:
 *         description: Internal server error
 */
