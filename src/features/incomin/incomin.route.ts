import { Application, Router } from "express";

// import { ExpenditureRepository } from "./expenditure.repository";
// import { ExpenditureService } from "./expenditure.service";
// import { ExpenditureController } from "./expenditure.controller";

import { IncominRepository } from "../incomin/incomin.repository";
import { IncominService } from "../incomin/incomin.service";
import { IncominController } from "../incomin/incomin.controller";

export function incominRoute(app: Application) {
    const router = Router();
    const incominRepository = new IncominRepository();
    const incominService = new IncominService(incominRepository);
    const incominController = new IncominController(incominService);

    // const expenditureRepository = new ExpenditureRepository();
    // const expenditureService = new ExpenditureService(expenditureRepository);
    // const expenditureController = new ExpenditureController(expenditureService);

    router.get("/v1/getIncomin", incominController.findAll);
    // router.get("/v1/expenditure/item", expenditureController.findAllExpenditureItem);
    // router.get("/v1/expenditure/type", expenditureController.findAllExpenditureType);
    router.get("/v1/incominById/:idIncome", incominController.findById);

    router.post("/v1/incomin", incominController.create);
    // router.post("/v1/expenditure/item", expenditureController.createExpenditureItem);
    // router.post("/v1/expenditure/type", expenditureController.createExpenditureType);

    router.patch("/v1/putIncomin", incominController.update);
    // router.patch("/v1/expenditure/item", expenditureController.updateExpenditureItem);
    // router.patch("/v1/expenditure/item", expenditureController.updateExpenditureItem);
    // router.patch("/v1/expenditure/type", expenditureController.updateExpenditureType);

    router.delete("/v1/deleteIncomin/:idIncome", incominController.delete);
    // router.delete("/v1/expenditure/item/:idExpenditureItem", expenditureController.deleteExpenditureItem);
    // router.delete("/v1/expenditure/type/:idExpenditureType", expenditureController.deleteExpenditureType);

    app.use("/api/", router);
}

/**
 * @openapi
 * /v1/getIncomin:
 *   get:
 *     tags: [Incomin]
 *     summary: Find all incomins
 *     description: Retrieve a list of incomins
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
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Month of the expenditure
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Year of the expenditure  
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Incomin'
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
 * /v1/incomin:
 *   post:
 *     tags: [Incomin]
 *     summary: Create incomin
 *     description: Create a new incomin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateIncomin'
 *     responses:
 *       201:
 *         description: Incomin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incomin'
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
 * /v1/putIncomin:
 *   patch:
 *     tags: [Incomin]
 *     summary: Update incomin
 *     description: Update an existing incomin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIncomin'
 *     responses:
 *       200:
 *         description: Incomin updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incomin'
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
 * /v1/deleteIncomin/{idIncome}:
 *   delete:
 *     tags: [Incomin]
 *     summary: Delete income
 *     description: Delete an existing income
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income id
 *     responses:
 *       204:
 *         description: Income deleted
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
 * /v1/incominById/{idIncome}:
 *   get:
 *     tags: [Incomin]
 *     summary: Find incomin by id
 *     description: Retrieve a single incomin
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income id
 *     responses:
 *       200:
 *         description: A single income
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incomin'
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
 *     Incomin:
 *       type: object
 *       properties:
 *         idIncome:
 *           type: integer
 *           example: 1
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idInvoice:
 *          type: integer
 *          example: 1
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
 *     CreateIncomin:
 *       type: object
 *       properties:
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idInvoice:
 *          type: integer
 *          example: 1
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
 *         fromDate:
 *           type: string
 *           format: date
 *         toDate:
 *           type: string
 *           format: date
 *         orderNumber:
 *           type: string
 *           example: "023923"
 *     UpdateIncomin:
 *       type: object
 *       properties:
 *         idIncome:
 *           type: integer
 *           example: 1
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idInvoice:
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
 *         fromDate:
 *           type: string
 *           format: string
 *         toDate:
 *           type: string
 *           format: string
 *         orderNumber:
 *           type: string
 *           example: "023923"
 */