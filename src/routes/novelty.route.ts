import { Application, Router } from "express";
import { verifyToken } from "../middlewares";
import { noveltyController } from "../controllers";

export function noveltyRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * /v1/novelty/novelties:
   *   get:
   *     tags: [Novelty]
   *     summary: Get all novelties
   *     description: Get all novelties
   *     parameters:
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
  routes.get("/v1/novelty/novelties", [verifyToken], noveltyController.findNovelties);

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
  routes.get("/v1/novelty/:idEmployeeNovelty", [verifyToken], noveltyController.findNoveltyById);

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
  routes.post("/v1/novelty", [verifyToken], noveltyController.createNovelty);

  /**
   * @openapi
   * /v1/novelty:
   *   patch:
   *     tags: [Novelty]
   *     summary: Update a novelty
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Novelty'
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
  routes.patch("/v1/novelty", [verifyToken], noveltyController.updateNovelty);

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
  routes.delete("/v1/novelty/:idEmployeeNovelty", [verifyToken], noveltyController.deleteNovelty);

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
   *         periodicity:
   *           type: string
   *           example: "monthly"
   *         document:
   *           type: string
   *           format: binary
   *           example: "Loan for employee"
   *         observation:
   *           type: string
   *           example: "Loan for employee"
   * 
   */

  app.use("/api", routes);
}
