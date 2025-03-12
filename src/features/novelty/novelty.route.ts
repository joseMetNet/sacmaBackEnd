import { Application, Router } from "express";
import { verifyToken } from "../../middlewares";
import { noveltyController } from "./novelty.controller";

export function noveltyRoutes(app: Application): void {
  const routes: Router = Router();


  routes.post("/v1/novelty", [verifyToken], noveltyController.createNovelty);
  routes.patch("/v1/novelty", [verifyToken], noveltyController.updateNovelty);
  routes.get("/v1/novelty/novelties", [verifyToken], noveltyController.findNovelties);
  routes.get("/v1/novelty", [verifyToken], noveltyController.findNoveltiesByModule);
  routes.get("/v1/novelty/types", [verifyToken], noveltyController.findNoveltyTypes);
  routes.get("/v1/novelty/periodicities", [verifyToken], noveltyController.findPeriodicities);
  routes.get("/v1/novelty/download", [verifyToken], noveltyController.employeeNoveltiesToExcel);
  routes.get("/v1/novelty/:idEmployeeNovelty", [verifyToken], noveltyController.findNoveltyById);
  routes.delete("/v1/novelty/:idEmployeeNovelty", [verifyToken], noveltyController.deleteNovelty);

  /**
   * @openapi
   * /v1/novelty/novelties:
   *   get:
   *     tags: [Novelty]
   *     summary: Get all novelties
   *     description: Get all novelties
   *     parameters:
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/pageSize'
   *       - $ref: '#/components/parameters/idNovelty'
   *       - $ref: '#/components/parameters/firstName'
   *       - $ref: '#/components/parameters/identityCardNumber'
   *       - $ref: '#/components/parameters/noveltyYear'
   *       - $ref: '#/components/parameters/noveltyMonth'
   *     responses:
   *       200:
   *         description: A list of novelties
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Novelty'
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
  * /v1/novelty/download:
  *   get:
  *     tags: [Novelty]
  *     summary: Download novelties
  *     responses:
  *       '200':
  *         description: Successful response
  *         content:
  *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
  *             schema:
  *               type: string
  *               format: binary
  *       '500':
  *         description: Internal server error
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/failedResponse"
  */

  /**
  * @openapi
  * /v1/novelty:
  *   get:
  *     tags: [Novelty]
  *     summary: Find novelties by module
  *     parameters:
  *       - in: query
  *         name: module
  *         schema:
  *           type: string
  *         description: Module name
  *     responses:
  *       '200':
  *         description: Successful response
  *       '500':
  *         description: Internal server error
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/failedResponse"
  */

  /**
   * @openapi
   * /v1/novelty/types:
   *   get:
   *     tags: [Novelty]
   *     summary: Find novelties types
   *     description: Find novelties types
   *     responses:
   *       200:
   *         description: A list of novelties
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/NoveltyType'
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
   * /v1/novelty/periodicities:
   *   get:
   *     tags: [Novelty]
   *     summary: Find periodicities
   *     description: Find periodicities
   *     responses:
   *       200:
   *         description: A list of periodicities
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Periodicity'
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
   * /v1/novelty/{idEmployeeNovelty}:
   *   get:
   *     tags: [Novelty]
   *     summary: Get novelty by ID
   *     parameters:
   *       - $ref: '#/components/parameters/idEmployeeNovelty'
   *     responses:
   *       200:
   *         description: A novelty object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Novelty'
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
   * /v1/novelty:
   *   post:
   *     tags: [Novelty]
   *     summary: Create a new novelty
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/createNovelty'
   *     responses:
   *       201:
   *         description: Created
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/failedResponse'
   */

  /**
   * @openapi
   * /v1/novelty:
   *   patch:
   *     tags: [Novelty]
   *     summary: Update a novelty
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/updateEmployeeNovelty'
   *     responses:
   *       200:
   *         description: Updated
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/failedResponse'
   */

  /**
   * @openapi
   * /v1/novelty/{idEmployeeNovelty}:
   *   delete:
   *     tags: [Novelty]
   *     summary: Delete a novelty
   *     parameters:
   *       - $ref: '#/components/parameters/idEmployeeNovelty'
   *     responses:
   *       200:
   *         description: Deleted
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
   * components:
   *   parameters:
   *     idEmployeeNovelty:
   *       in: path
   *       name: idEmployeeNovelty
   *       required: true
   *       schema:
   *         type: integer
   *       description: Employee novelty ID
   *     page:
   *       in: query
   *       name: page
   *       required: false
   *       schema:
   *         type: integer
   *       description: Page number
   *     pageSize:
   *       in: query
   *       name: pageSize
   *       required: false
   *       schema:
   *         type: string
   *       description: Page size
   *     idNovelty:
   *       in: query
   *       name: idNovelty
   *       required: false
   *       schema:
   *         type: string
   *       description: Novelty ID
   *     firstName:
   *       in: query
   *       name: firstName
   *       required: false
   *       schema:
   *         type: string
   *       description: Employee first name
   *     noveltyYear:
   *       in: query
   *       name: noveltyYear
   *       required: false
   *       schema:
   *         type: string
   *       description: Novelty year
   *     noveltyMonth:
   *       in: query
   *       name: noveltyMonth
   *       required: false
   *       schema:
   *         type: string
   *       description: Novelty month
   *     identityCardNumber:
   *       in: query
   *       name: identityCardNumber
   *       required: false
   *       schema:
   *         type: string
   *       description: Employee identity card number
   *
   *   schemas:
   *     failedResponse:
   *       type: object
   *       properties:
   *         status:
   *           type: string
   *           example: FAILED
   *         message:
   *           type: string
   *           example: An internal server error occurred.
   *     Novelty:
   *       type: object
   *       properties:
   *         idNovelty:
   *           type: integer
   *           example: 1
   *         idEmployee:
   *           type: integer
   *           example: 1
   *         loanValue:
   *           type: string
   *           example: "100.00"
   *         observation:
   *           type: string
   *           example: "Loan for employee"
   *     NoveltyType:
   *       type: object
   *       properties:
   *         idNovelty:
   *           type: integer
   *           example: 1
   *         novelty:
   *           type: string
   *           example: "Loan"
   *     Periodicity:
   *       type: object
   *       properties:
   *         idPeriodicity:
   *           type: integer
   *           example: 1
   *         periodicity:
   *           type: string
   *           example: "Monthly"
   *     createNovelty:
   *       type: object
   *       properties:
   *         idNovelty:
   *           type: integer
   *           example: 1
   *         idEmployee:
   *           type: integer
   *           example: 1
   *         createdAt:
   *           type: string
   *           example: "2021-09-01T00:00:00.000Z"
   *         endAt:
   *           type: string
   *           example: "2021-09-01T00:00:00.000Z"
   *         loanValue:
   *           type: string
   *           example: "100.00"
   *         installment:
   *           type: number
   *           example: 12
   *         idPeriodicity:
   *           type: number
   *           example: 1
   *         document:
   *           type: string
   *           format: binary
   *           example: "Loan for employee"
   *         observation:
   *           type: string
   *           example: "Loan for employee"
   *     updateEmployeeNovelty:
   *       type: object
   *       properties:
   *         idEmployeeNovelty:
   *           type: integer
   *           example: 1
   *         idNovelty:
   *           type: integer
   *           example: 1
   *         createdAt:
   *           type: string
   *           example: "2021-09-01T00:00:00.000Z"
   *         endAt:
   *           type: string
   *           example: "2021-09-01T00:00:00.000Z"
   *         loanValue:
   *           type: string
   *           example: "100.00"
   *         installment:
   *           type: number
   *           example: 12
   *         idPeriodicity:
   *           type: number
   *           example: 1
   *         document:
   *           type: string
   *           format: binary
   *           example: "Loan for employee"
   *         observation:
   *           type: string
   *           example: "Loan for employee"
   */

  app.use("/api", routes);
}
