import { Application, Router } from "express";
import { RevenueCenterController } from "./revenue-center.controller";
import { RevenueCenterRepository } from "./revenue-center.repository";
import { RevenueCenterService } from "./revenue-center.service";
import { verifyToken } from "../../middlewares";
import { ExpenditureRepository } from "../expenditure";
import { CostCenterRepository } from "../cost-center/cost-center.repository";

export function revenueCenterRoutes(app: Application): void {
  const routes: Router = Router();
  const revenueCenterRepository = new RevenueCenterRepository();
  const expenditureRepository = new ExpenditureRepository();
  const costCenterRepository = new CostCenterRepository();
  const revenueCenterService = new RevenueCenterService(revenueCenterRepository, expenditureRepository, costCenterRepository);
  const revenueCenterController = new RevenueCenterController(revenueCenterService);

  routes.get("/v1/revenue-center", [verifyToken], revenueCenterController.findAll);
  routes.get("/v1/revenue-center/status", [verifyToken], revenueCenterController.findAllRevenueCenterStatus);
  routes.post("/v1/revenue-center", [verifyToken], revenueCenterController.create);
  routes.patch("/v1/revenue-center", [verifyToken], revenueCenterController.update);

  routes.get("/v1/revenue-center/material", [verifyToken], revenueCenterController.findAllMaterial);
  routes.get("/v1/revenue-center/project-item", [verifyToken], revenueCenterController.findAllProjectItem);
  routes.get("/v1/revenue-center/quotation/summary", [verifyToken], revenueCenterController.findAllMaterialSummary);
  routes.get("/v1/revenue-center/inputs", [verifyToken], revenueCenterController.findAllInputs);
  routes.get("/v1/revenue-center/epp", [verifyToken], revenueCenterController.findAllEpp);
  // Unified expenditures endpoint
  routes.get("/v1/revenue-center/expenditures", [verifyToken], revenueCenterController.findAllExpenditures);
  routes.get("/v1/revenue/center/work-tracking", [verifyToken], revenueCenterController.findAllWorkTracking);
  routes.get("/v1/revenue-center/quotation", [verifyToken], revenueCenterController.findAllQuotation);

  routes.get("/v1/revenue-center/:idRevenueCenter", [verifyToken], revenueCenterController.findById);

  routes.delete("/v1/revenue-center/:idRevenueCenter", [verifyToken], revenueCenterController.delete);

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
   * /v1/revenue-center/status:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all revenue center statuses
   *     description: Find all available revenue center statuses
   *     responses:
   *       200:
   *         description: A list of revenue center statuses
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/RevenueCenterStatus'
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
   * /v1/revenue-center/project-item:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all project items for a revenue center
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
   *         description: A list of project items
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProjectItem'
   *                 totalItems:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Revenue center not found
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/quotation/summary:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all materials summary for a revenue center (grouped by material)
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: Optional filter by material name
   *       - in: query
   *         name: idCostCenterProject
   *         schema:
   *           type: integer
   *         description: Optional filter by cost center project ID
   *     responses:
   *       200:
   *         description: A list of materials summary grouped by material name
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
   *                       material:
   *                         type: string
   *                         example: "Cement"
   *                         description: Name of the material
   *                       quantity:
   *                         type: number
   *                         example: 100
   *                         description: Total quantity of the material
   *                       subTotal:
   *                         type: number
   *                         example: 50000
   *                         description: Total value before markup (quantity * unit cost)
   *                       totalValue:
   *                         type: number
   *                         example: 57785
   *                         description: Total value with 15.57% markup (subTotal * 1.1557)
   *                       total:
   *                         type: number
   *                         example: 5778500
   *                         description: Final total (quantity * totalValue)
   *                 totalItems:
   *                   type: integer
   *                   example: 25
   *                   description: Total number of unique materials
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                   description: Current page number
   *                 totalPage:
   *                   type: integer
   *                   example: 3
   *                   description: Total number of pages
   *       400:
   *         description: Bad request - Missing required parameters
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
   * /v1/revenue-center/expenditures:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Retrieve all expenditures for a revenue center
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the revenue center
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: A list of expenditures
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Expenditure'
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
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue/center/work-tracking:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Get work tracking data with monthly summary
   *     parameters:
   *       - in: query
   *         name: idRevenueCenter
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the revenue center
   *       - in: query
   *         name: idCostCenterProject
   *         schema:
   *           type: integer
   *         description: Optional ID of the cost center project
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *     responses:
   *       200:
   *         description: Monthly work tracking summary by employee
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
   *                       Name:
   *                         type: string
   *                         example: "John Doe"
   *                       Position:
   *                         type: string
   *                         example: "Engineer"
   *                       Enero:
   *                         type: integer
   *                         example: 20
   *                       Febrero:
   *                         type: integer
   *                         example: 18
   *                       Marzo:
   *                         type: integer
   *                         example: 22
   *                       Abril:
   *                         type: integer
   *                         example: 21
   *                       Mayo:
   *                         type: integer
   *                         example: 20
   *                       Junio:
   *                         type: integer
   *                         example: 22
   *                       Julio:
   *                         type: integer
   *                         example: 21
   *                       Agosto:
   *                         type: integer
   *                         example: 23
   *                       Septiembre:
   *                         type: integer
   *                         example: 20
   *                       Octubre:
   *                         type: integer
   *                         example: 22
   *                       Noviembre:
   *                         type: integer
   *                         example: 21
   *                       Diciembre:
   *                         type: integer
   *                         example: 20
   *                       ValorDia:
   *                         type: number
   *                         example: 100000
   *                       DiasTrabajados:
   *                         type: integer
   *                         example: 250
   *                       ValorTotal:
   *                         type: number
   *                         example: 25000000
   *                 totalItems:
   *                   type: integer
   *                   example: 50
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                 totalPage:
   *                   type: integer
   *                   example: 5
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

  /**
   * @openapi
   * /v1/revenue-center/quotation:
   *   get:
   *     tags: [Revenue Center]
   *     summary: Find all quotations for a revenue center
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
   *         description: A list of quotations grouped by input
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
   *                       material:
   *                         type: string
   *                         example: "Steel Pipes"
   *                       costCenter:
   *                         type: string
   *                         example: "Project A"
   *                       quantity:
   *                         type: number
   *                         example: 100
   *                       unitOfMeasure:
   *                         type: string
   *                         example: "meters"
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       performance:
   *                         type: number
   *                         example: 0.95
   *                       totalCost:
   *                         type: number
   *                         example: 1500.50
   *                 totalItems:
   *                   type: integer
   *                   example: 50
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                 totalPage:
   *                   type: integer
   *                   example: 5
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
   *         - idRevenueCenterStatus
   *       properties:
   *         name:
   *           type: string
   *           example: "Revenue Center 1"
   *         idCostCenterProject:
   *           type: integer
   *           example: 1
   *         idRevenueCenterStatus:
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
   *     RevenueCenterStatus:
   *       type: object
   *       properties:
   *         idRevenueCenterStatus:
   *           type: integer
   *           example: 1
   *         status:
   *           type: string
   *           example: "Active"
   *     ProjectItem:
   *       type: object
   *       properties:
   *         idProjectItem:
   *           type: integer
   *           example: 1
   *         idCostCenterProject:
   *           type: integer
   *           example: 1
   *         contract:
   *           type: string
   *           example: "Contract ABC-123"
   *         item:
   *           type: string
   *           example: "Concrete work"
   *         unitMeasure:
   *           type: string
   *           example: "m3"
   *         quantity:
   *           type: string
   *           example: "100"
   *         unitPrice:
   *           type: string
   *           example: "50000"
   *         total:
   *           type: string
   *           example: "5000000"
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
   *     idOrderItem:
   *       in: query
   *       name: idOrderItem
   *       schema:
   *         type: integer
   *       description: ID of the order item
   */

  app.use("/api", routes);
}