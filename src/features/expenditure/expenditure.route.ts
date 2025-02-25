import { Application, Router } from "express";
import { ExpenditureRepository } from "./expenditure.repository";
import { ExpenditureService } from "./expenditure.service";
import { ExpenditureController } from "./expenditure.controller";

export function expenditureRoute(app: Application) {
  const router = Router();
  const expenditureRepository = new ExpenditureRepository();
  const expenditureService = new ExpenditureService(expenditureRepository);
  const expenditureController = new ExpenditureController(expenditureService);

  router.get("/v1/expenditure", expenditureController.findAll);
  router.get("/v1/expenditure/item", expenditureController.findAllExpenditureItem);
  router.get("/v1/expenditure/type", expenditureController.findAllExpenditureType);
  router.get("/v1/expenditure/:idExpenditure", expenditureController.findById);

  router.post("/v1/expenditure", expenditureController.create);
  router.post("/v1/expenditure/item", expenditureController.createExpenditureItem);

  router.patch("/v1/expenditure", expenditureController.update);
  router.patch("/v1/expenditure/item", expenditureController.updateExpenditureItem);

  router.delete("/v1/expenditure/:idExpenditure", expenditureController.delete);
  router.delete("/v1/expenditure/item/:idExpenditureItem", expenditureController.deleteExpenditureItem);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/expenditure:
 *   get:
 *     tags: [Expenditure]
 *     summary: Find all expenditures
 *     description: Retrieve a list of expenditures
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
 *         name: consecutive
 *         schema:
 *           type: string
 *         description: Consecutive of the expenditure
 *       - in: query
 *         name: idExpenditureType
 *         schema:
 *           type: integer
 *         description: Number of the expenditure type
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: Number of the cost center project
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expenditure'
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
 * /v1/expenditure/item:
 *   get:
 *     tags: [Expenditure]
 *     summary: Find all expenditures items
 *     description: Retrieve a list of expenditures items
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
 *         name: idExpenditure
 *         schema:
 *           type: integer
 *         description: id of the expenditure
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: Number of the cost center project
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExpenditureItem'
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
 * /v1/expenditure/type:
 *   get:
 *     tags: [Expenditure]
 *     summary: Find all expenditures types
 *     description: Retrieve a list of expenditures types
 *     responses:
 *       200:
 *         description: A list of expenditures types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExpenditureType'
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
 * /v1/expenditure/{idExpenditure}:
 *   get:
 *     tags: [Expenditure]
 *     summary: Find expenditure by id
 *     description: Retrieve a single expenditure
 *     parameters:
 *       - in: path
 *         name: idExpenditure
 *         schema:
 *           type: integer
 *         required: true
 *         description: Expenditure id
 *     responses:
 *       200:
 *         description: A single expenditure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expenditure'
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
 * /v1/expenditure:
 *   post:
 *     tags: [Expenditure]
 *     summary: Create expenditure
 *     description: Create a new expenditure
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenditure'
 *     responses:
 *       201:
 *         description: Expenditure created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expenditure'
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
 * /v1/expenditure/item:
 *   post:
 *     tags: [Expenditure]
 *     summary: Create expenditure item
 *     description: Create a new expenditure item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenditureItem'
 *     responses:
 *       201:
 *         description: Expenditure item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenditureItem'
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
 * /v1/expenditure:
 *   patch:
 *     tags: [Expenditure]
 *     summary: Update expenditure
 *     description: Update an existing expenditure
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExpenditure'
 *     responses:
 *       200:
 *         description: Expenditure updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expenditure'
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
 * /v1/expenditure/item:
 *   patch:
 *     tags: [Expenditure]
 *     summary: Update expenditure item
 *     description: Update an existing expenditure item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExpenditureItem'
 *     responses:
 *       200:
 *         description: Expenditure item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenditureItem'
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
 * /v1/expenditure/{idExpenditure}:
 *   delete:
 *     tags: [Expenditure]
 *     summary: Delete expenditure
 *     description: Delete an existing expenditure
 *     parameters:
 *       - in: path
 *         name: idExpenditure
 *         schema:
 *           type: integer
 *         required: true
 *         description: Expenditure id
 *     responses:
 *       204:
 *         description: Expenditure deleted
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
 * /v1/expenditure/item/{idExpenditureItem}:
 *   delete:
 *     tags: [Expenditure]
 *     summary: Delete expenditure item
 *     description: Delete an existing expenditure item
 *     parameters:
 *       - in: path
 *         name: idExpenditureItem
 *         schema:
 *           type: integer
 *         required: true
 *         description: Expenditure item id
 *     responses:
 *       204:
 *         description: Expenditure item deleted
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
 * @swagger
 * components:
 *   schemas:
 *     Expenditure:
 *       type: object
 *       properties:
 *         idExpenditure:
 *           type: integer
 *           example: 1
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 *         document:
 *           type: string
 *           format: binary
 *         refundRequestDate:
 *           type: string
 *           format: date
 *     ExpenditureItem:
 *       type: object
 *       properties:
 *         idExpenditureItem:
 *           type: integer
 *           example: 1
 *         idExpenditure:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 *     CreateExpenditure:
 *       type: object
 *       properties:
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 *         document:
 *           type: string
 *           format: binary
 *         refundRequestDate:
 *           type: string
 *           format: date
 *     CreateExpenditureItem:
 *       type: object
 *       required:
 *         - idExpenditure
 *         - value
 *         - description
 *       properties:
 *         idExpenditure:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 *     UpdateExpenditure:
 *       type: object
 *       properties:
 *         idExpenditure:
 *           type: integer
 *           example: 1
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 *         document:
 *           type: string
 *           format: binary
 *         refundRequestDate:
 *           type: string
 *           format: string
 *     UpdateExpenditureItem:
 *       type: object
 *       required:
 *         - idExpenditureItem
 *       properties:
 *         idExpenditureItem:
 *           type: integer
 *           example: 1
 *         idExpenditure:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Description"
 *         value:
 *           type: string
 *           example: "100.00"
 */