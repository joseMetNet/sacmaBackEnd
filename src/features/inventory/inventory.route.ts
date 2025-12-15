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
  router.post("/v1/inventory/use-in-project", inventoryController.useMaterialInProject);
  router.post("/v1/inventory/record-material-balance", inventoryController.recordProjectMaterialBalance);
  router.put("/v1/inventory/edit-project-assignment", inventoryController.editProjectMaterialAssignment);
  router.put("/v1/inventory/edit-returned-material", inventoryController.editReturnedMaterial);
  router.get("/v1/inventory/by-warehouse", inventoryController.getInventoryByWarehouse);
  router.get("/v1/inventory/project-materials/:idCostCenterProject", inventoryController.getProjectMaterialsAssigned);

  // Rutas de consultas con Sequelize
  router.get("/v1/inventory", inventoryController.findAllInventory);
  router.get("/v1/inventory/warehouse/:idWarehouse", inventoryController.findInventoryByWarehouse);
  router.get("/v1/inventory/movements", inventoryController.findAllInventoryMovement);
  router.get("/v1/inventory/project-assignments", inventoryController.findAllProjectAssignment);
  router.get("/v1/inventory/revenue-centers", inventoryController.findAllRevenueCenters);
  router.get("/v1/inventory/return-reasons", inventoryController.getReturnReasons);
  router.get("/v1/inventory/documents", inventoryController.getInventoryDocuments);
  router.get("/v1/inventory/physical-inventory-documents/:idCostCenterProject", inventoryController.getPhysicalInventoryDocuments);
  router.get("/v1/inventory/return-documents/:idCostCenterProject", inventoryController.getReturnDocuments);
  router.get("/v1/inventory/returns-summary/:idCostCenterProject", inventoryController.getReturnsSummaryByDate);
  router.get("/v1/inventory/returns-detail/:idCostCenterProject", inventoryController.getReturnsDetailByDate);
  router.get("/v1/inventory/materials-summary/:idCostCenterProject", inventoryController.getMaterialsSummaryByProject);
  router.get("/v1/inventory/project-assignments-with-returns/:idCostCenterProject", inventoryController.getProjectAssignmentsWithReturns);
  router.get("/v1/inventory/:idInventory", inventoryController.findInventoryById);

  // Rutas para documentos (subida de fotos/PDF de evidencia con express-fileupload)
  router.post("/v1/inventory/documents/upload", inventoryController.uploadInventoryDocument);
  router.put("/v1/inventory/documents/:idInventoryDocument", inventoryController.updateInventoryDocument);
  router.delete("/v1/inventory/documents/:idInventoryDocument", inventoryController.deleteInventoryDocument);

  // Rutas para TB_InventoryBalance
  router.post("/v1/inventory/balance", inventoryController.createInventoryBalance);
  router.put("/v1/inventory/balance/:idBalance", inventoryController.updateInventoryBalance);
  router.get("/v1/inventory/balance/:idProjectAssignment", inventoryController.getBalancesByAssignment);

  // Ruta para actualizar balance en ProjectInventoryAssignment
  router.put("/v1/inventory/project-assignment/balance", inventoryController.updateProjectAssignmentBalance);

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
 *     description: Return unused material from a project back to inventory. Returns idInventoryMovement for uploading evidence documents.
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
 *                 example: 1
 *               quantityToReturn:
 *                 type: string
 *                 description: Quantity to return
 *                 example: "5.50"
 *               idReturnReason:
 *                 type: integer
 *                 description: Return reason ID (optional)
 *                 example: 1
 *               remarks:
 *                 type: string
 *                 description: Observations
 *                 maxLength: 500
 *                 example: "Material sobrante en buen estado"
 *               createdBy:
 *                 type: string
 *                 description: User who created the return
 *                 maxLength: 100
 *                 example: "juan.perez"
 *     responses:
 *       200:
 *         description: Material returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Material devuelto correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         idInventoryMovement:
 *                           type: integer
 *                           description: ID del movimiento creado (usar para subir documentos)
 *                         cantidadDevuelta:
 *                           type: number
 *                         cantidadPendiente:
 *                           type: number
 *                         stockDisponible:
 *                           type: number
 *       400:
 *         description: Invalid input data or quantity exceeds pending amount
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/use-in-project:
 *   post:
 *     tags: [Inventory]
 *     summary: Use material in project
 *     description: Register the usage/consumption of material in a project. Reduces reserved inventory and updates project assignment status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - quantityUsed
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID
 *                 example: 1
 *               quantityUsed:
 *                 type: string
 *                 description: Quantity of material used/consumed
 *                 example: "10.50"
 *               remarks:
 *                 type: string
 *                 description: Observations or notes about the usage
 *                 maxLength: 500
 *                 example: "Material usado en construcción de muro"
 *               createdBy:
 *                 type: string
 *                 description: User who registered the usage
 *                 maxLength: 100
 *                 example: "juan.perez"
 *     responses:
 *       200:
 *         description: Material usage registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Uso de material registrado correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         idProjectAssignment:
 *                           type: integer
 *                         quantityUsed:
 *                           type: string
 *       400:
 *         description: Invalid input data or quantity exceeds available amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar uso de material en proyecto
 *                 details:
 *                   type: string
 *                   example: Cantidad a usar excede la cantidad disponible en el proyecto
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/record-material-balance:
 *   post:
 *     tags: [Inventory]
 *     summary: Record project material balance
 *     description: Register the remaining balance of material in a project based on physical inventory count. Calculates and records the material consumption automatically. Returns idInventoryMovement and idProjectAssignment for uploading evidence photos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - remainingBalance
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID
 *                 example: 1
 *               remainingBalance:
 *                 type: string
 *                 description: Remaining balance of material in the project after physical count (must be >= 0 and <= assigned quantity)
 *                 example: "10.00"
 *               remarks:
 *                 type: string
 *                 description: Observations about the physical inventory count
 *                 maxLength: 500
 *                 example: "Inventario físico proyecto 60 - Fin de mes"
 *               createdBy:
 *                 type: string
 *                 description: User who registered the balance
 *                 maxLength: 100
 *                 example: "admin metnet"
 *     responses:
 *       200:
 *         description: Material balance registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Saldo de material en proyecto registrado correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         saldoFinal:
 *                           type: number
 *                           description: Final remaining balance
 *                           example: 10.00
 *                         cantidadUsadaAhora:
 *                           type: number
 *                           description: Quantity used in this period
 *                           example: 15.00
 *                         cantidadUsadaTotal:
 *                           type: number
 *                           description: Total quantity used to date
 *                           example: 15.00
 *                         cantidadPendiente:
 *                           type: number
 *                           description: Pending quantity
 *                           example: 10.00
 *                         stockReservadoActual:
 *                           type: number
 *                           description: Current reserved stock in inventory
 *                           example: 10.00
 *                         idInventoryMovement:
 *                           type: integer
 *                           description: ID del movimiento creado (usar para subir fotos de evidencia)
 *                           example: 123
 *                         idProjectAssignment:
 *                           type: integer
 *                           description: ID de la asignación (usar para subir fotos de evidencia)
 *                           example: 1
 *                         estado:
 *                           type: string
 *                           description: Assignment status
 *                           enum: [Asignado, EnUso, Completado]
 *                           example: EnUso
 *       400:
 *         description: Invalid input data or balance validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar saldo de material en proyecto
 *                 details:
 *                   type: string
 *                   example: El saldo restante no puede ser mayor a la cantidad asignada
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/edit-project-assignment:
 *   put:
 *     tags: [Inventory]
 *     summary: Adjust project material balance
 *     description: Adjust project material balance by specifying how much quantity remains pending. The system automatically calculates the used quantity based on formula (Assigned - Pending - Returned = Used). Updates inventory reserved stock accordingly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - newQuantityPending
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID to adjust
 *                 example: 1
 *               newQuantityPending:
 *                 type: string
 *                 description: Cantidad que QUEDA disponible en el proyecto (must be >= 0 and <= assigned quantity)
 *                 example: "30.00"
 *               remarks:
 *                 type: string
 *                 description: Observations about the adjustment
 *                 maxLength: 500
 *                 example: "Ajuste de balance - Inventario físico"
 *               createdBy:
 *                 type: string
 *                 description: User who made the adjustment
 *                 maxLength: 100
 *                 example: "admin metnet"
 *     responses:
 *       200:
 *         description: Project balance adjusted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Balance del proyecto ajustado correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         cantidadAsignada:
 *                           type: string
 *                           description: Total quantity originally assigned to the project
 *                           example: "100.00"
 *                         usadoAnterior:
 *                           type: string
 *                           description: Quantity used before this adjustment
 *                           example: "50.00"
 *                         usadoNuevo:
 *                           type: string
 *                           description: New calculated quantity used (Assigned - Pending - Returned)
 *                           example: "70.00"
 *                         diferenciaUsado:
 *                           type: string
 *                           description: Difference in usage (usadoNuevo - usadoAnterior)
 *                           example: "20.00"
 *                         devuelto:
 *                           type: string
 *                           description: Total quantity returned from the project
 *                           example: "0.00"
 *                         pendienteAnterior:
 *                           type: string
 *                           description: Pending quantity before this adjustment
 *                           example: "50.00"
 *                         pendienteNuevo:
 *                           type: string
 *                           description: New pending quantity (from request)
 *                           example: "30.00"
 *                         stockReservadoActual:
 *                           type: string
 *                           description: Current reserved stock in inventory
 *                           example: "30.00"
 *                         tipoAjuste:
 *                           type: string
 *                           enum: [AUMENTO_CONSUMO, REDUCCION_CONSUMO, SIN_CAMBIO]
 *                           description: Type of consumption adjustment
 *                           example: AUMENTO_CONSUMO
 *       400:
 *         description: Invalid input data or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al ajustar balance del proyecto
 *                 details:
 *                   type: string
 *                   example: La cantidad pendiente no puede ser mayor a lo asignado. Asignado 100.00, Pendiente solicitado 120.00
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/edit-returned-material:
 *   put:
 *     tags: [Inventory]
 *     summary: Edit returned material quantity
 *     description: Edit the total quantity returned from a project. The system automatically adjusts inventory (available and reserved stock) based on the difference. Use this when the originally recorded return quantity was incorrect.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - newQuantityReturned
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID
 *                 example: 1
 *               newQuantityReturned:
 *                 type: string
 *                 description: Nueva cantidad devuelta total (must be >= 0 and <= assigned - used)
 *                 example: "15.00"
 *               idReturnReason:
 *                 type: integer
 *                 description: Return reason ID (optional)
 *                 example: 1
 *               remarks:
 *                 type: string
 *                 description: Observations about the adjustment
 *                 maxLength: 500
 *                 example: "Corrección: se devolvieron 15 unidades, no 10"
 *               createdBy:
 *                 type: string
 *                 description: User who made the adjustment
 *                 maxLength: 100
 *                 example: "admin metnet"
 *     responses:
 *       200:
 *         description: Returned quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Cantidad devuelta actualizada correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         idInventoryMovement:
 *                           type: integer
 *                           description: ID del movimiento de ajuste creado
 *                           example: 456
 *                         devueltoAnterior:
 *                           type: string
 *                           description: Previous returned quantity
 *                           example: "10.00"
 *                         devueltoNuevo:
 *                           type: string
 *                           description: New returned quantity
 *                           example: "15.00"
 *                         diferencia:
 *                           type: string
 *                           description: Difference (positive for increase, negative for decrease)
 *                           example: "5.00"
 *                         cantidadUsada:
 *                           type: string
 *                           description: Quantity already used
 *                           example: "20.00"
 *                         cantidadPendienteNueva:
 *                           type: string
 *                           description: New pending quantity after adjustment
 *                           example: "65.00"
 *                         stockDisponibleActual:
 *                           type: string
 *                           description: Current available stock in inventory
 *                           example: "115.00"
 *                         tipoAjuste:
 *                           type: string
 *                           enum: [AUMENTO_DEVOLUCION, REDUCCION_DEVOLUCION, SIN_CAMBIO]
 *                           description: Type of return adjustment
 *                           example: AUMENTO_DEVOLUCION
 *       400:
 *         description: Invalid input data or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar cantidad devuelta
 *                 details:
 *                   type: string
 *                   example: No se puede devolver más de lo disponible. Asignado 100.00, Usado 20.00, Máximo devolvible 80.00
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
 *     description: Query inventory with filters and pagination. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
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
 *       - in: query
 *         name: inputName
 *         schema:
 *           type: string
 *         description: Filter by input/material name (partial match)
 *     responses:
 *       200:
 *         description: Inventory list retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/warehouse/{idWarehouse}:
 *   get:
 *     tags: [Inventory]
 *     summary: Find all inventories by warehouse
 *     description: Get all inventory records for a specific warehouse with pagination and filters. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
 *       - in: query
 *         name: inputName
 *         schema:
 *           type: string
 *         description: Filter by input/material name (partial match)
 *     responses:
 *       200:
 *         description: Inventories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInventory:
 *                             type: integer
 *                           idInput:
 *                             type: integer
 *                           idWarehouse:
 *                             type: integer
 *                           quantityAvailable:
 *                             type: string
 *                           quantityReserved:
 *                             type: string
 *                           quantityTotal:
 *                             type: string
 *                           averageCost:
 *                             type: string
 *                           lastMovementDate:
 *                             type: string
 *                             format: date-time
 *                           Input:
 *                             type: object
 *                           WareHouse:
 *                             type: object
 *                     totalItems:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid warehouse ID or query parameters
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

/**
 * @openapi
 * /v1/inventory/return-reasons:
 *   get:
 *     tags: [Inventory]
 *     summary: Get all return reasons
 *     description: Get all active material return reasons with their requirements
 *     responses:
 *       200:
 *         description: Return reasons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idReturnReason:
 *                         type: integer
 *                       reasonCode:
 *                         type: string
 *                       reasonName:
 *                         type: string
 *                       requiresDocument:
 *                         type: boolean
 *                       isActive:
 *                         type: boolean
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/documents:
 *   get:
 *     tags: [Inventory]
 *     summary: Get inventory documents
 *     description: Query documents/photos uploaded for inventory movements or project assignments
 *     parameters:
 *       - in: query
 *         name: idInventoryMovement
 *         schema:
 *           type: integer
 *         description: Filter by inventory movement ID
 *       - in: query
 *         name: idProjectAssignment
 *         schema:
 *           type: integer
 *         description: Filter by project assignment ID
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [DevolucionMaterial, InventarioFisico, AjusteInventario, DanoMaterial, Otro]
 *         description: Filter by document type
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInventoryDocument:
 *                             type: integer
 *                           idInventoryMovement:
 *                             type: integer
 *                           idProjectAssignment:
 *                             type: integer
 *                           documentType:
 *                             type: string
 *                           fileName:
 *                             type: string
 *                           fileExtension:
 *                             type: string
 *                           filePath:
 *                             type: string
 *                           fileSize:
 *                             type: integer
 *                           mimeType:
 *                             type: string
 *                           description:
 *                             type: string
 *                           uploadedBy:
 *                             type: string
 *                           uploadedAt:
 *                             type: string
 *                             format: date-time
 *                     count:
 *                       type: integer
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/revenue-centers:
 *   get:
 *     tags: [Inventory]
 *     summary: Find all revenue centers
 *     description: Get all revenue center records
 *     responses:
 *       200:
 *         description: Revenue centers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idRevenueCenter:
 *                         type: integer
 *                       idCostCenterProject:
 *                         type: integer
 *                       idQuotation:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/project-assignments-with-returns/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get project assignments with returns
 *     description: Get all project material assignments that have returned quantities. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
 *     responses:
 *       200:
 *         description: Project assignments with returns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProjectAssignment:
 *                             type: integer
 *                           idCostCenterProject:
 *                             type: integer
 *                           idInput:
 *                             type: integer
 *                           Material:
 *                             type: string
 *                           Almacen:
 *                             type: string
 *                           CantidadAsignada:
 *                             type: number
 *                           CantidadUsada:
 *                             type: number
 *                           CantidadDevuelta:
 *                             type: number
 *                           CantidadPendiente:
 *                             type: number
 *                           PrecioUnitario:
 *                             type: number
 *                           ValorDevuelto:
 *                             type: number
 *                           FechaAsignacion:
 *                             type: string
 *                             format: date-time
 *                           Estado:
 *                             type: string
 *                           AsignadoPor:
 *                             type: string
 *                           FechaDevolucion:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             description: Fecha de la última devolución de material
 *                           NumDevoluciones:
 *                             type: integer
 *                             nullable: true
 *                             description: Número total de devoluciones realizadas
 *                     totalItems:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalValorDevuelto:
 *                       type: string
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/materials-summary/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get materials summary by project
 *     description: Get comprehensive materials summary including shipped, quotation data, and project assignments for a specific project. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
 *     responses:
 *       200:
 *         description: Materials summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInput:
 *                             type: integer
 *                           material:
 *                             type: string
 *                           performance:
 *                             type: number
 *                           shipped:
 *                             type: number
 *                           quantityM2:
 *                             type: number
 *                           totalCostSend:
 *                             type: number
 *                           budgeted:
 *                             type: number
 *                           contracted:
 *                             type: number
 *                           diff:
 *                             type: number
 *                           idQuotation:
 *                             type: integer
 *                           idCostCenterProject:
 *                             type: integer
 *                           idProjectAssignment:
 *                             type: integer
 *                           inputName:
 *                             type: string
 *                           idWarehouse:
 *                             type: integer
 *                           warehouseName:
 *                             type: string
 *                           quantityAssigned:
 *                             type: number
 *                           quantityUsed:
 *                             type: number
 *                           quantityReturned:
 *                             type: number
 *                           quantityPending:
 *                             type: number
 *                           assignmentUnitPrice:
 *                             type: number
 *                           assignmentTotalCost:
 *                             type: number
 *                           assignmentDate:
 *                             type: string
 *                             format: date-time
 *                           assignmentStatus:
 *                             type: string
 *                           createdBy:
 *                             type: string
 *                          balance:
 *                             type: number
 *                     count:
 *                       type: integer
 *                     totalShipped:
 *                       type: number
 *                     totalCostSend:
 *                       type: number
 *                     totalBudgeted:
 *                       type: number
 *                     totalContracted:
 *                       type: number
 *                     totalItems:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/documents/upload:
 *   post:
 *     tags: [Inventory]
 *     summary: Upload inventory document evidence
 *     description: Upload a photo or PDF document as evidence for inventory movements (material returns, physical inventory, adjustments, etc.). Requires at least one of idInventoryMovement, idProjectAssignment, or idCostCenterProject.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - documentType
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image (JPG, PNG, GIF, WEBP) or PDF file (max 10MB)
 *               idInventoryMovement:
 *                 type: integer
 *                 description: ID del movimiento de inventario (devolución, ajuste, uso, etc.)
 *                 example: 123
 *               idProjectAssignment:
 *                 type: integer
 *                 description: ID de la asignación de proyecto
 *                 example: 1
 *               idCostCenterProject:
 *                 type: integer
 *                 description: ID del proyecto (para inventario físico mensual sin asignación específica)
 *                 example: 60
 *               documentType:
 *                 type: string
 *                 enum: [DevolucionMaterial, InventarioFisico, AjusteInventario, DanoMaterial, Otro]
 *                 description: Tipo de documento de evidencia
 *                 example: InventarioFisico
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Descripción o comentarios sobre el documento
 *                 example: Inventario físico mensual - Proyecto 60 - Noviembre 2025
 *               uploadedBy:
 *                 type: string
 *                 maxLength: 100
 *                 description: Usuario que subió el documento (requerido)
 *                 example: admin metnet
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     idInventoryDocument:
 *                       type: integer
 *                       example: 1
 *                     idInventoryMovement:
 *                       type: integer
 *                       nullable: true
 *                       example: 123
 *                     idProjectAssignment:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     idCostCenterProject:
 *                       type: integer
 *                       nullable: true
 *                       example: 60
 *                     documentType:
 *                       type: string
 *                       example: InventarioFisico
 *                     fileName:
 *                       type: string
 *                       example: material-danado-1234567890-123456789.jpg
 *                     fileExtension:
 *                       type: string
 *                       example: .jpg
 *                     filePath:
 *                       type: string
 *                       example: https://sacmaback.blob.core.windows.net/inventory/550e8400-e29b-41d4-a716-446655440000.jpg
 *                     fileSize:
 *                       type: integer
 *                       description: File size in bytes
 *                       example: 2048576
 *                     mimeType:
 *                       type: string
 *                       example: image/jpeg
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: Foto del material devuelto dañado
 *                     uploadedBy:
 *                       type: string
 *                       example: admin metnet
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00.000Z
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid input data or file validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se proporcionó ningún archivo
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/documents/{idInventoryDocument}:
 *   put:
 *     tags: [Inventory]
 *     summary: Update inventory document file
 *     description: Replace an existing inventory document by uploading a new image (JPG, PNG, GIF, WEBP) or PDF file. The old file will be replaced with the new one.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idInventoryDocument
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory document ID
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New image (JPG, PNG, GIF, WEBP) or PDF file (max 10MB) to replace the existing document
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Documento actualizado exitosamente
 *                     filePath:
 *                       type: string
 *                       example: https://sacmaback.blob.core.windows.net/inventory/550e8400-e29b-41d4-a716-446655440000.jpg
 *       400:
 *         description: No file provided or invalid file type
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Inventory]
 *     summary: Deactivate inventory document (logical delete)
 *     description: Performs a logical delete by setting isActive=0. The document is not physically deleted from the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idInventoryDocument
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory document ID
 *         example: 123
 *     responses:
 *       200:
 *         description: Document deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Documento desactivado exitosamente
 *       400:
 *         description: Invalid document ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/physical-inventory-documents/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get physical inventory documents by project and date
 *     description: Retrieve all physical inventory documents (photos/PDFs) for a specific project filtered by date with pagination. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *         example: 60
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to filter documents (YYYY-MM-DD)
 *         example: 2025-12-04
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
 *         example: 10
 *     responses:
 *       200:
 *         description: Physical inventory documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInventoryDocument:
 *                             type: integer
 *                             example: 123
 *                           idCostCenterProject:
 *                             type: integer
 *                             example: 60
 *                           filePath:
 *                             type: string
 *                             example: https://sacmaback.blob.core.windows.net/inventory/550e8400-e29b-41d4-a716-446655440000.jpg
 *                           description:
 *                             type: string
 *                             nullable: true
 *                             example: Inventario físico mensual
 *                           fileExtension:
 *                             type: string
 *                             nullable: true
 *                             example: jpg
 *                           uploadedBy:
 *                             type: string
 *                             nullable: true
 *                             example: admin metnet
 *                           uploadedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-12-04T15:30:00.000Z
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid project ID or date format
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/return-documents/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get material returns with attached documents by project
 *     description: Retrieve all material returns with their attached documents for a specific project with pagination. Use pageSize=-1 to return all records without pagination.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *         example: 60
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Items per page (default 10, use -1 for all records)
 *         example: 10
 *     responses:
 *       200:
 *         description: Return documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInventoryMovement:
 *                             type: integer
 *                             example: 123
 *                           Proyecto:
 *                             type: integer
 *                             example: 60
 *                           Material:
 *                             type: string
 *                             example: Cemento gris 50kg
 *                           CantidadDevuelta:
 *                             type: number
 *                             example: 15.00
 *                           Motivo:
 *                             type: string
 *                             nullable: true
 *                             example: Material sobrante
 *                           Observaciones:
 *                             type: string
 *                             nullable: true
 *                             example: Material en buen estado
 *                           FechaDevolucion:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-11-28T10:00:00.000Z
 *                           NumDocumentos:
 *                             type: integer
 *                             example: 3
 *                           filePath:
 *                             type: string
 *                             nullable: true
 *                             example: https://sacmaback.blob.core.windows.net/inventory/550e8400-e29b-41d4-a716-446655440000.jpg
 *                     totalItems:
 *                       type: integer
 *                       example: 45
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/returns-summary/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get returns summary grouped by date
 *     description: Retrieve a summary of all material returns for a specific project, grouped by return date. Shows total returns, quantities, materials and reasons per date.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *         example: 60
 *     responses:
 *       200:
 *         description: Returns summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           FechaDevolucion:
 *                             type: string
 *                             format: date
 *                             example: 2025-11-26
 *                           TotalDevoluciones:
 *                             type: integer
 *                             example: 6
 *                           CantidadTotalDevuelta:
 *                             type: number
 *                             example: 34.00
 *                           Materiales:
 *                             type: string
 *                             nullable: true
 *                             example: DESMOPOL, TECNOPOL EP 1010, DESMOPOL, DESMOPOL, DESMOPOL, TECNOPOL EP 1010
 *                           Motivos:
 *                             type: string
 *                             nullable: true
 *                             example: Material dañado - No apto para uso, Otro motivo
 *                     totalItems:
 *                       type: integer
 *                       example: 4
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/returns-detail/{idCostCenterProject}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get detailed returns by specific date
 *     description: Retrieve detailed information about all material returns for a specific project on a specific date, including evidence files and timestamps.
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *         example: 60
 *       - in: query
 *         name: returnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Return date in YYYY-MM-DD format
 *         example: 2025-12-01
 *     responses:
 *       200:
 *         description: Returns detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInventoryMovement:
 *                             type: integer
 *                             example: 456
 *                           FechaDevolucion:
 *                             type: string
 *                             format: date
 *                             example: 2025-12-01
 *                           HoraDevolucion:
 *                             type: string
 *                             example: 14:30:00
 *                           idProyecto:
 *                             type: integer
 *                             example: 60
 *                           Material:
 *                             type: string
 *                             example: DESMOPLUS
 *                           CantidadDevuelta:
 *                             type: number
 *                             example: 2.00
 *                           CodigoMotivo:
 *                             type: string
 *                             nullable: true
 *                             example: MAT_DAMAGED
 *                           MotivoDevolucion:
 *                             type: string
 *                             nullable: true
 *                             example: Material dañado - No apto para uso
 *                           Observaciones:
 *                             type: string
 *                             nullable: true
 *                             example: Material en mal estado
 *                           UsuarioRegistro:
 *                             type: string
 *                             nullable: true
 *                             example: admin metnet
 *                           TieneEvidencia:
 *                             type: string
 *                             example: Sí
 *                           ArchivoEvidencia:
 *                             type: string
 *                             nullable: true
 *                             example: evidencia_devolucion.jpg
 *                           RutaArchivo:
 *                             type: string
 *                             nullable: true
 *                             example: https://sacmaback.blob.core.windows.net/inventory/550e8400-e29b-41d4-a716-446655440000.jpg
 *                           TipoArchivo:
 *                             type: string
 *                             nullable: true
 *                             example: .jpg
 *                     totalItems:
 *                       type: integer
 *                       example: 4
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/balance:
 *   post:
 *     tags: [Inventory]
 *     summary: Create inventory balance record
 *     description: Create a new balance record for a project assignment to track inventory balance changes over time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProjectAssignment
 *               - balance
 *             properties:
 *               idProjectAssignment:
 *                 type: integer
 *                 description: Project assignment ID
 *                 example: 1
 *               balance:
 *                 type: integer
 *                 description: Balance value (integer)
 *                 example: 100
 *               createdBy:
 *                 type: string
 *                 maxLength: 100
 *                 description: User who created the balance record
 *                 example: admin metnet
 *               remarks:
 *                 type: string
 *                 maxLength: 500
 *                 description: Observations or notes
 *                 example: Ajuste de balance - Inventario físico
 *     responses:
 *       201:
 *         description: Balance created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Balance de inventario creado correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         idBalance:
 *                           type: integer
 *                           example: 1
 *                         idProjectAssignment:
 *                           type: integer
 *                           example: 1
 *                         balance:
 *                           type: integer
 *                           example: 100
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-12-04T10:30:00.000Z
 *                         createdBy:
 *                           type: string
 *                           nullable: true
 *                           example: admin metnet
 *                         remarks:
 *                           type: string
 *                           nullable: true
 *                           example: Ajuste de balance - Inventario físico
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/balance/{idBalance}:
 *   put:
 *     tags: [Inventory]
 *     summary: Update inventory balance record
 *     description: Update the balance value of an existing balance record
 *     parameters:
 *       - in: path
 *         name: idBalance
 *         required: true
 *         schema:
 *           type: integer
 *         description: Balance record ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: integer
 *                 description: New balance value (integer)
 *                 example: 150
 *               createdBy:
 *                 type: string
 *                 maxLength: 100
 *                 description: User who updated the balance record
 *                 example: admin metnet
 *               remarks:
 *                 type: string
 *                 maxLength: 500
 *                 description: Observations or notes
 *                 example: Corrección de balance
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Balance de inventario actualizado correctamente
 *                     data:
 *                       type: object
 *                       properties:
 *                         idBalance:
 *                           type: integer
 *                           example: 1
 *                         idProjectAssignment:
 *                           type: integer
 *                           example: 1
 *                         balance:
 *                           type: integer
 *                           example: 150
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-12-04T10:30:00.000Z
 *                         createdBy:
 *                           type: string
 *                           nullable: true
 *                           example: admin metnet
 *                         remarks:
 *                           type: string
 *                           nullable: true
 *                           example: Corrección de balance
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Balance not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/balance/{idProjectAssignment}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get balance history by project assignment
 *     description: Retrieve all balance records for a specific project assignment, ordered by creation date (most recent first)
 *     parameters:
 *       - in: path
 *         name: idProjectAssignment
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project assignment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Balance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idBalance:
 *                             type: integer
 *                             example: 1
 *                           idProjectAssignment:
 *                             type: integer
 *                             example: 1
 *                           balance:
 *                             type: integer
 *                             example: 100
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-12-04T10:30:00.000Z
 *                           createdBy:
 *                             type: string
 *                             nullable: true
 *                             example: admin metnet
 *                           remarks:
 *                             type: string
 *                             nullable: true
 *                             example: Ajuste de balance - Inventario físico
 *                     totalItems:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid project assignment ID
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/inventory/project-assignment/balance:
 *   put:
 *     tags: [Inventory]
 *     summary: Update balance in ProjectInventoryAssignment (batch)
 *     description: Update balance for one or multiple project assignments and automatically create history records in InventoryBalance. Accepts an array of items to update multiple assignments in a single transaction.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: Array of project assignments to update
 *                 items:
 *                   type: object
 *                   required:
 *                     - idProjectAssignment
 *                     - balance
 *                   properties:
 *                     idProjectAssignment:
 *                       type: integer
 *                       description: Project assignment ID
 *                       example: 1
 *                     balance:
 *                       type: integer
 *                       description: New balance value
 *                       example: 150
 *                     remarks:
 *                       type: string
 *                       maxLength: 500
 *                       description: Observations or notes
 *                       example: Ajuste por inventario físico mensual
 *                     createdBy:
 *                       type: string
 *                       maxLength: 100
 *                       description: User who made the update
 *                       example: admin metnet
 *           examples:
 *             single:
 *               summary: Update single assignment
 *               value:
 *                 items:
 *                   - idProjectAssignment: 1
 *                     balance: 150
 *                     remarks: Ajuste por inventario físico
 *                     createdBy: admin metnet
 *             multiple:
 *               summary: Update multiple assignments
 *               value:
 *                 items:
 *                   - idProjectAssignment: 1
 *                     balance: 150
 *                     remarks: Ajuste proyecto A
 *                     createdBy: admin metnet
 *                   - idProjectAssignment: 2
 *                     balance: 200
 *                     remarks: Ajuste proyecto B
 *                     createdBy: admin metnet
 *                   - idProjectAssignment: 3
 *                     balance: 75
 *                     remarks: Ajuste proyecto C
 *                     createdBy: admin metnet
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Balance actualizado correctamente para 3 asignación(es)
 *                     data:
 *                       type: object
 *                       properties:
 *                         updated:
 *                           type: integer
 *                           description: Number of assignments updated
 *                           example: 3
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               idProjectAssignment:
 *                                 type: integer
 *                                 example: 1
 *                               previousBalance:
 *                                 type: integer
 *                                 description: Balance before update
 *                                 example: 100
 *                               newBalance:
 *                                 type: integer
 *                                 description: Balance after update
 *                                 example: 150
 *                               idBalanceHistory:
 *                                 type: integer
 *                                 description: ID of the history record created in InventoryBalance
 *                                 example: 45
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos de entrada inválidos
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
