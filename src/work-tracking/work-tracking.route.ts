import { Application, Router } from "express";
import { WorkTrackingRepository } from "./work-tracking.repository";
import { WorkTrackingService } from "./work-tracking.service";
import { WorkTrackingController } from "./work-tracking.controller";

const workTrackingRepository = new WorkTrackingRepository();
const workTrackingService = new WorkTrackingService(workTrackingRepository);
const workTrackingController = new WorkTrackingController(workTrackingService);

export function workTrackingRoute(app: Application): void {
  const router: Router = Router();

  // GET routes
  router.get("/v1/work-tracking", workTrackingController.findAll);
  router.get("/v1/work-tracking/employee", workTrackingController.findAllByEmployee);
  router.get("/v1/work-tracking/work-hour", workTrackingController.findAllWorkHour);
  router.get("/v1/work-tracking/:idWorkTracking", workTrackingController.findById);

  // POST routes
  router.post("/v1/work-tracking", workTrackingController.create);
  router.post("/v1/work-tracking/create-all", workTrackingController.createAll);

  // PATCH routes
  router.patch("/v1/work-tracking", workTrackingController.update);

  // DELETE routes
  router.delete("/v1/work-tracking/:idWorkTracking", workTrackingController.delete);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/work-tracking:
 *   get:
 *     tags: [Work Tracking]
 *     summary: Find Work Trackings
 *     description: Find all Work Trackings
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
 *         description: Number of items per page
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: int
 *         description: Id of the cost center project
 *       - in: query
 *         name: projectName
 *         schema:
 *           type: string
 *         description: Name of the project
 *       - in: query
 *         name: idEmployee
 *         schema:
 *           type: number
 *         description: Id of the employee
 *       - in: query
 *         name: employeeName
 *         schema:
 *           type: string
 *         description: Name of the employee
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *         description: Month of the Work Tracking
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: Year of the Work Tracking
 *     responses:
 *       200:
 *         description: A list of cost center
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkTrackingDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking/employee:
 *   get:
 *     tags: [Work Tracking]
 *     summary: Find Work Trackings by Employee
 *     description: Find all Work Trackings by Employee
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
 *         description: Number of items per page
 *       - in: query
 *         name: idEmployee
 *         schema:
 *           type: int
 *         description: Id of the employee
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: int
 *         description: Id of the cost center project
 *       - in: query
 *         name: projectName
 *         schema:
 *           type: string
 *         description: Name of the project
 *     responses:
 *       200:
 *         description: A list of cost center
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkTrackingDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking/work-hour:
 *   get:
 *     tags: [Work Tracking]
 *     summary: Find Work hours
 *     description: Find all Work hours
 *     responses:
 *       200:
 *         description: A list of cost center
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkHours'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking/{idWorkTracking}:
 *   get:
 *     tags: [Work Tracking]
 *     summary: Find Work Tracking by ID
 *     description: Use to request a Work Tracking by ID
 *     parameters:
 *       - in: path
 *         name: idWorkTracking
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Work Tracking to get
 *     responses:
 *       200:
 *         description: A Work Tracking object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTrackingDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking/{idWorkTracking}:
 *   delete:
 *     tags: [Work Tracking]
 *     summary: Delete Work Tracking by ID
 *     description: Use to delete a Work Tracking by ID
 *     parameters:
 *       - in: path
 *         name: idWorkTracking
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Work Tracking to delete
 *     responses:
 *       204:
 *         description: No Content - Work Tracking deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking:
 *   post:
 *     tags: [Work Tracking]
 *     summary: Create Work Tracking
 *     description: Create a new Work Tracking
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkTrackingDTO'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTrackingDTO'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking/create-all:
 *   post:
 *     tags: [Work Tracking]
 *     summary: Create All Work Tracking
 *     description: Create multiple Work Tracking
 *     requestBody:
 *       required: true
 *       content:
 *        multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/CreateAllWorkTrackingDTO' 
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTrackingDTO'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/work-tracking:
 *   patch:
 *     tags: [Work Tracking]
 *     summary: Update Work Tracking
 *     description: Update a Work Tracking
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkTrackingDTO'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTrackingDTO'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     FindAllDTO:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: "John Doe"
 *         nit:
 *           type: string
 *           example: "123456789"
 *     IdWorkTrackingDTO:
 *       type: object
 *       properties:
 *         idWorkTracking:
 *           type: integer
 *           example: 1
 *     WorkHours:
 *       type: object
 *       properties:
 *         idWorkHour:
 *           type: integer
 *           example: 1
 *         WorkHour:
 *           type: integer
 *           example: 1
 *     CreateAllWorkTrackingDTO:
 *       type: object
 *       properties:
 *         workTracking:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/CreateWorkTrackingDTO'
 *     CreateWorkTrackingDTO:
 *       type: object
 *       required:
 *         - idEmployee
 *         - idCostCenterProject
 *         - hoursWorked
 *       properties:
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         hoursWorked:
 *           type: integer
 *           example: 8
 *         overtimeHour:
 *           type: integer
 *           example: 2
 *         idNovelty:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           example: "2021-09-01"
 *     UpdateWorkTrackingDTO:
 *       type: object
 *       required:
 *         - idWorkTracking
 *       properties:
 *         idWorkTracking:
 *           type: integer
 *           example: 1
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         hoursWorked:
 *           type: integer
 *           example: 8
 *         overtimeHour:
 *           type: integer
 *           example: 2
 *         idNovelty:
 *           type: integer
 *           example: 1
 *     WorkTrackingDTO:
 *       type: object
 *       properties:
 *         idWorkTracking:
 *           type: integer
 *           example: 1
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         hoursWorked:
 *           type: integer
 *           example: 8
 *         overtimeHour:
 *           type: integer
 *           example: 2
 *         idNovelty:
 *           type: integer
 *           example: 1
 */