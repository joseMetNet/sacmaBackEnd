import { Application, Router } from "express";
import { RevenueCenterController } from "./revenue-center.controller";
import { RevenueCenterRepository } from "./revenue-center.repository";
import { RevenueCenterService } from "./revenue-center.service";
import { InputRepository } from "../input/input.repository";

export function revenueCenterRoutes(app: Application): void {
  const routes: Router = Router();
  const revenueCenterRepository = new RevenueCenterRepository();
  const inputRepository = new InputRepository();
  const revenueCenterService = new RevenueCenterService(revenueCenterRepository, inputRepository);
  const revenueCenterController = new RevenueCenterController(revenueCenterService);

  routes.get("/v1/revenue-center", revenueCenterController.findAll);
  routes.post("/v1/revenue-center", revenueCenterController.create);
  routes.patch("/v1/revenue-center", revenueCenterController.update);

  routes.get("/v1/revenue-center/material", revenueCenterController.findAllMaterial);
  routes.get("/v1/revenue-center/inputs", revenueCenterController.findAllInputs);
  routes.get("/v1/revenue-center/epp", revenueCenterController.findAllEpp);
  routes.get("/v1/revenue-center/per-diem", revenueCenterController.findAllPerDiem);
  routes.get("/v1/revenue-center/policy", revenueCenterController.findAllPolicy);

  routes.get("/v1/revenue-center/:idRevenueCenter", revenueCenterController.findById);
  routes.delete("/v1/revenue-center/:idRevenueCenter", revenueCenterController.delete);

  /**
   * @openapi
   * /v1/revenue-center:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all revenue centers
   *     parameters:
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: Name of the revenue center
   *       - in: query
   *         name: idCostCenterProject
   *         schema:
   *           type: integer
   *         description: ID of the cost center project
   *     responses:
   *       200:
   *         description: A list of revenue centers
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/RevenueCenter'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/{idRevenueCenter}:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find revenue center by ID
   *     parameters:
   *       - in: path
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *     responses:
   *       200:
   *         description: A revenue center object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RevenueCenter'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center:
   *   post:
   *     tags: [Revenue Center]
   *     summary: Create a new revenue center
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRevenueCenter'
   *     responses:
   *       201:
   *         description: Revenue center created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RevenueCenter'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center:
   *   patch:
   *     tags: [Revenue Center]
   *     summary: Update a revenue center
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRevenueCenter'
   *     responses:
   *       200:
   *         description: Revenue center updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RevenueCenter'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/{idRevenueCenter}:
   *   delete:
   *     tags: [Revenue Center]
   *     summary: Delete a revenue center
   *     parameters:
   *       - in: path
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center to delete
   *     responses:
   *       200:
   *         description: Revenue center deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/material:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all materials for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of materials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Input'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/inputs:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all inputs for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of inputs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Input'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/epp:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all EPP for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of EPP
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Input'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/per-diem:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all per diem for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of per diem
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Input'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/policy:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all policies for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of policies
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Input'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPage:
   *                   type: integer
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * components:
   *   schemas:
   *     RevenueCenter:
   *       type: object
   *       properties:
   *         idRevenueCenter:
   *           type: integer
   *           example: 1
   *         name:
   *           type: string
   *           example: "Revenue Center 1"
   *         idCostCenterProject:
   *           type: integer
   *           example: 1
   *         fromDate:
   *           type: string
   *           example: "2024-01-01"
   *         toDate:
   *           type: string
   *           example: "2024-12-31"
   *         createdAt:
   *           type: string
   *           format: date-time
   *           example: "2024-01-01T00:00:00.000Z"
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           example: "2024-01-01T00:00:00.000Z"
   *         invoice:
   *           type: string
   *           example: "0.0"
   *         spend:
   *           type: string
   *           example: "0.0"
   *         utility:
   *           type: string
   *           example: "0.0"
   *     CreateRevenueCenter:
   *       type: object
   *       required:
   *         - name
   *         - idCostCenterProject
   *         - fromDate
   *         - toDate
   *       properties:
   *         name:
   *           type: string
   *           example: "Revenue Center 1"
   *         idCostCenterProject:
   *           type: integer
   *           example: 1
   *         fromDate:
   *           type: string
   *           example: "2024-01-01"
   *         toDate:
   *           type: string
   *           example: "2024-12-31"
   *     UpdateRevenueCenter:
   *       type: object
   *       required:
   *         - idRevenueCenter
   *       properties:
   *         idRevenueCenter:
   *           type: integer
   *           example: 1
   *         name:
   *           type: string
   *           example: "Revenue Center 1"
   *         idCostCenterProject:
   *           type: integer
   *           example: 1
   *         fromDate:
   *           type: string
   *           example: "2024-01-01"
   *         toDate:
   *           type: string
   *           example: "2024-12-31"
   *   parameters:
   *     page:
   *       in: query
   *       name: page
   *       schema:
   *         type: integer
   *       description: Page number
   *     pageSize:
   *       in: query
   *       name: pageSize
   *       schema:
   *         type: integer
   *       description: Number of items per page
   */

  app.use("/api", routes);
} 