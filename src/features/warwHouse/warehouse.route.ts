import { Application, Router } from "express";
import { WareHouseController } from "./warehouse.controller";
import { WareHouseRepository } from "./warehouse.repository";
import { WareHouseService } from "./warehouse.service";

export function wareHouseRoute(app: Application) {
  const router = Router();
  const wareHouseRepository = new WareHouseRepository();
  const wareHouseService = new WareHouseService(wareHouseRepository);
  const wareHouseController = new WareHouseController(wareHouseService);

  router.get("/v1/warehouse", wareHouseController.findAll);
  router.get("/v1/warehouse/:idWarehouse", wareHouseController.findById);
  router.post("/v1/warehouse", wareHouseController.create);
  router.put("/v1/warehouse/:idWarehouse", wareHouseController.update);
  router.delete("/v1/warehouse/:idWarehouse", wareHouseController.delete);
  router.patch("/v1/warehouse/:idWarehouse/soft-delete", wareHouseController.softDelete);
  router.patch("/v1/warehouse/:idWarehouse/restore", wareHouseController.restore);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/warehouse:
 *   get:
 *     tags: [Warehouse]
 *     summary: Find all warehouses
 *     description: Retrieve a list of warehouses with pagination and filters
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
 *         description: Number of items per page. Use -1 to return all records without pagination
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by warehouse name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: A list of warehouses. Returns paginated data by default, or all records if pageSize=-1
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Paginated response (when pageSize is not -1)
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "SUCCESS"
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Warehouse'
 *                         totalItems:
 *                           type: integer
 *                           example: 50
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                 - type: object
 *                   description: All records response (when pageSize=-1)
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "SUCCESS"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse/{idWarehouse}:
 *   get:
 *     tags: [Warehouse]
 *     summary: Get warehouse by ID
 *     description: Retrieve a single warehouse by its ID
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse:
 *   post:
 *     tags: [Warehouse]
 *     summary: Create a new warehouse
 *     description: Create a new warehouse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouse'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse/{idWarehouse}:
 *   put:
 *     tags: [Warehouse]
 *     summary: Update warehouse
 *     description: Update an existing warehouse
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWarehouse'
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse/{idWarehouse}:
 *   delete:
 *     tags: [Warehouse]
 *     summary: Delete warehouse
 *     description: Permanently delete a warehouse
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
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
 *                       example: "Warehouse deleted successfully"
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse/{idWarehouse}/soft-delete:
 *   patch:
 *     tags: [Warehouse]
 *     summary: Soft delete warehouse
 *     description: Mark a warehouse as inactive (soft delete)
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/warehouse/{idWarehouse}/restore:
 *   patch:
 *     tags: [Warehouse]
 *     summary: Restore warehouse
 *     description: Restore a soft deleted warehouse (mark as active)
 *     parameters:
 *       - in: path
 *         name: idWarehouse
 *         required: true
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *           description: Unique identifier for the warehouse
 *         name:
 *           type: string
 *           example: "Main Warehouse"
 *           description: Name of the warehouse
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-01T10:00:00Z"
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-01T10:00:00Z"
 *           description: Last update timestamp
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Whether the warehouse is active
 *     
 *     CreateWarehouse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "New Warehouse"
 *           description: Name of the warehouse (optional)
 *         isActive:
 *           type: boolean
 *           example: true
 *           default: true
 *           description: Whether the warehouse is active (optional, defaults to true)
 *     
 *     UpdateWarehouse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Warehouse"
 *           description: Name of the warehouse (optional)
 *         isActive:
 *           type: boolean
 *           example: false
 *           description: Whether the warehouse is active (optional)
 */