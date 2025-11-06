import { Application, Router } from "express";
import { InputMovementController } from "./input-movement.controller";
import { InputMovementRepository } from "./input-movement.repository";
import { InputMovementService } from "./input-movement.service";

export function inputMovementRoute(app: Application) {
  const router = Router();
  const inputMovementRepository = new InputMovementRepository();
  const inputMovementService = new InputMovementService(inputMovementRepository);
  const inputMovementController = new InputMovementController(inputMovementService);

  // Rutas
  router.post("/v1/input-movement", inputMovementController.moveInput);
  router.get("/v1/input-movement", inputMovementController.findAll);
  router.get("/v1/input-movement/:idInputMovement", inputMovementController.findById);
  router.get("/v1/input-movement/input/:idInput", inputMovementController.findByInput);
  router.get("/v1/input-movement/warehouse/:idWarehouse", inputMovementController.findByWarehouse);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/input-movement:
 *   post:
 *     tags: [InputMovement]
 *     summary: Register input/output movement
 *     description: Execute SP_MoveInput to register entrada (entry) or salida (exit) of materials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoveInput'
 *     responses:
 *       200:
 *         description: Movement registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Movimiento de Entrada registrado correctamente"
 *                     movementType:
 *                       type: string
 *                       example: "Entrada"
 *                     quantity:
 *                       type: string
 *                       example: "50"
 *       400:
 *         description: Bad request - Invalid data or insufficient stock
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/input-movement:
 *   get:
 *     tags: [InputMovement]
 *     summary: Get all input movements
 *     description: Retrieve list of input movements with pagination and filters
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
 *         description: Number of items per page. Use -1 to return all records
 *       - in: query
 *         name: idPurchaseRequest
 *         schema:
 *           type: integer
 *         description: Filter by purchase request ID
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: Filter by input ID
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: Filter by warehouse ID
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [Entrada, Salida]
 *         description: Filter by movement type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of input movements
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/input-movement/{idInputMovement}:
 *   get:
 *     tags: [InputMovement]
 *     summary: Get input movement by ID
 *     description: Retrieve a single input movement by its ID
 *     parameters:
 *       - in: path
 *         name: idInputMovement
 *         required: true
 *         schema:
 *           type: integer
 *         description: Input movement ID
 *     responses:
 *       200:
 *         description: Input movement found
 *       404:
 *         description: Input movement not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/input-movement/input/{idInput}:
 *   get:
 *     tags: [InputMovement]
 *     summary: Get movement history by input
 *     description: Retrieve all movements for a specific input/product
 *     parameters:
 *       - in: path
 *         name: idInput
 *         required: true
 *         schema:
 *           type: integer
 *         description: Input ID
 *     responses:
 *       200:
 *         description: List of movements for the input
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/input-movement/warehouse/{idWarehouse}:
 *   get:
 *     tags: [InputMovement]
 *     summary: Get movement history by warehouse
 *     description: Retrieve all movements for a specific warehouse
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: List of movements for the warehouse
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MoveInput:
 *       type: object
 *       required:
 *         - idPurchaseRequest
 *         - movementType
 *         - quantity
 *       properties:
 *         idPurchaseRequest:
 *           type: integer
 *           example: 101
 *           description: ID of the purchase request
 *         movementType:
 *           type: string
 *           enum: [Entrada, Salida]
 *           example: "Entrada"
 *           description: Type of movement (Entrada for input, Salida for output)
 *         quantity:
 *           type: string
 *           example: "50"
 *           description: Quantity to move
 *         remarks:
 *           type: string
 *           example: "Compra inicial de materiales"
 *           description: Optional remarks about the movement
 *         createdBy:
 *           type: string
 *           example: "Juan Perez"
 *           description: User who created the movement
 *     
 *     InputMovement:
 *       type: object
 *       properties:
 *         idInputMovement:
 *           type: integer
 *           example: 1
 *         idPurchaseRequest:
 *           type: integer
 *           example: 101
 *         idInput:
 *           type: integer
 *           example: 214
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         movementType:
 *           type: string
 *           example: "Entrada"
 *         quantity:
 *           type: string
 *           example: "50"
 *         price:
 *           type: string
 *           example: "85000"
 *         remarks:
 *           type: string
 *           example: "Compra inicial"
 *         createdBy:
 *           type: string
 *           example: "Juan Perez"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-31T10:00:00Z"
 */
