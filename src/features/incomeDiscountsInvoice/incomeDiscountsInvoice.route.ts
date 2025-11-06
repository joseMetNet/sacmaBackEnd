import { Application, Router } from "express";
import { IncomeDiscountInvoiceController } from "./incomeDiscountsInvoice.controller";
import { IncomeDiscountInvoiceService } from "./incomeDiscountsInvoice.service";
import { IncomeDiscountInvoiceRepository } from "./incomeDiscountsInvoice.repository";

export function incomeDiscountInvoiceRoute(app: Application) {
    const router = Router();
    const incomeDiscountInvoiceRepository = new IncomeDiscountInvoiceRepository();
    const incomeDiscountInvoiceService = new IncomeDiscountInvoiceService(incomeDiscountInvoiceRepository);
    const incomeDiscountInvoiceController = new IncomeDiscountInvoiceController(incomeDiscountInvoiceService);

    router.get("/v1/getIncomeDiscountInvoice", incomeDiscountInvoiceController.findAll);
    // router.get("/v1/incomeDiscountInvoiceById/:idIncomeDiscountInvoice", incomeDiscountInvoiceController.findById);
    router.get("/v1/incomeDiscountInvoiceById/:idIncome", incomeDiscountInvoiceController.findById);

    router.post("/v1/incomeDiscountInvoice", incomeDiscountInvoiceController.create);

    router.put("/v1/putIncomeDiscountInvoice/:idIncome", incomeDiscountInvoiceController.update);

    router.delete("/v1/deleteIncomeDiscountInvoice/:idIncome", incomeDiscountInvoiceController.delete);
    router.patch("/v1/softDeleteIncomeDiscountInvoice/:idIncome", incomeDiscountInvoiceController.softDelete);
    router.patch("/v1/restoreIncomeDiscountInvoice/:idIncome", incomeDiscountInvoiceController.restore);

    app.use("/api/", router);
}

/**
 * @openapi
 * /v1/getIncomeDiscountInvoice:
 *   get:
 *     tags: [Income Discount Invoice]
 *     summary: Find all income discount invoices
 *     description: Retrieve a list of income discount invoices
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
 *         name: idIncomeDiscountInvoice
 *         schema:
 *           type: integer
 *         description: Income discount invoice ID
 *       - in: query
 *         name: idExpenditureType
 *         schema:
 *           type: integer
 *         description: Expenditure type ID
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: Cost center project ID
 *       - in: query
 *         name: idInvoice
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *       - in: query
 *         name: refundRequestDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Refund request date
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Active status
 *     responses:
 *       200:
 *         description: A list of income discount invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IncomeDiscountInvoice'
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
 * /v1/incomeDiscountInvoice:
 *   post:
 *     tags: [Income Discount Invoice]
 *     summary: Create income discount invoice
 *     description: Create a new income discount invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIncomeDiscountInvoice'
 *     responses:
 *       201:
 *         description: Income discount invoice created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncomeDiscountInvoice'
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
 * /v1/putIncomeDiscountInvoice/{idIncome}:
 *   put:
 *     tags: [Income Discount Invoice]
 *     summary: Update income discount invoice
 *     description: Update an existing income discount invoice
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income discount invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIncomeDiscountInvoice'
 *     responses:
 *       200:
 *         description: Income discount invoice updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncomeDiscountInvoice'
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
 * /v1/deleteIncomeDiscountInvoice/{idIncome}:
 *   delete:
 *     tags: [Income Discount Invoice]
 *     summary: Delete income discount invoice
 *     description: Delete an existing income discount invoice
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income discount invoice ID
 *     responses:
 *       204:
 *         description: Income discount invoice deleted
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
 * /v1/incomeDiscountInvoiceById/{idIncome}:
 *   get:
 *     tags: [Income Discount Invoice]
 *     summary: Find income discount invoice by id
 *     description: Retrieve a single income discount invoice
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income discount invoice ID
 *     responses:
 *       200:
 *         description: A single income discount invoice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncomeDiscountInvoice'
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
 * /v1/softDeleteIncomeDiscountInvoice/{idIncome}:
 *   patch:
 *     tags: [Income Discount Invoice]
 *     summary: Soft delete income discount invoice
 *     description: Soft delete an existing income discount invoice
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income discount invoice ID
 *     responses:
 *       200:
 *         description: Income discount invoice soft deleted
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
 * /v1/restoreIncomeDiscountInvoice/{idIncome}:
 *   patch:
 *     tags: [Income Discount Invoice]
 *     summary: Restore income discount invoice
 *     description: Restore a soft deleted income discount invoice
 *     parameters:
 *       - in: path
 *         name: idIncome
 *         schema:
 *           type: integer
 *         required: true
 *         description: Income discount invoice ID
 *     responses:
 *       200:
 *         description: Income discount invoice restored
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
 *     IncomeDiscountInvoice:
 *       type: object
 *       properties:
 *         idIncomeDiscountInvoice:
 *           type: integer
 *           example: 1
 *         value:
 *           type: number
 *           example: 1000.50
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idInvoice:
 *           type: integer
 *           example: 1
 *         refundRequestDate:
 *           type: string
 *           format: date
 *           example: "2023-12-01"
 *         advance:
 *           type: number
 *           example: 100.00
 *         reteguarantee:
 *           type: number
 *           example: 50.00
 *         retesource:
 *           type: number
 *           example: 75.00
 *         reteica:
 *           type: number
 *           example: 25.00
 *         fic:
 *           type: number
 *           example: 15.00
 *         other:
 *           type: number
 *           example: 30.00
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateIncomeDiscountInvoice:
 *       type: object
 *       required:
 *         - value
 *         - idExpenditureType
 *         - idCostCenterProject
 *         - idInvoice
 *       properties:
 *         value:
 *           type: number
 *           example: 1000.50
 *           description: Invoice value (required)
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *           description: Expenditure type ID (required)
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *           description: Cost center project ID (required)
 *         idInvoice:
 *           type: integer
 *           example: 1
 *           description: Invoice ID (required)
 *         refundRequestDate:
 *           type: string
 *           format: date
 *           example: "2023-12-01"
 *           description: Refund request date (optional, defaults to current date)
 *         advance:
 *           type: number
 *           example: 100.00
 *           description: Advance amount (optional, defaults to 0)
 *         reteguarantee:
 *           type: number
 *           example: 50.00
 *           description: Guarantee retention (optional, defaults to 0)
 *         retesource:
 *           type: number
 *           example: 75.00
 *           description: Source retention (optional, defaults to 0)
 *         reteica:
 *           type: number
 *           example: 25.00
 *           description: ICA retention (optional, defaults to 0)
 *         fic:
 *           type: number
 *           example: 15.00
 *           description: FIC amount (optional, defaults to 0)
 *         other:
 *           type: number
 *           example: 30.00
 *           description: Other discounts (optional, defaults to 0)
 *           example: 15.00
 *         other:
 *           type: number
 *           example: 30.00
 *     UpdateIncomeDiscountInvoice:
 *       type: object
 *       required:
 *         - idIncomeDiscountInvoice
 *       properties:
 *         idIncomeDiscountInvoice:
 *           type: integer
 *           example: 1
 *         value:
 *           type: number
 *           example: 1000.50
 *         idExpenditureType:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idInvoice:
 *           type: integer
 *           example: 1
 *         refundRequestDate:
 *           type: string
 *           format: date
 *           example: "2023-12-01"
 *         advance:
 *           type: number
 *           example: 100.00
 *         reteguarantee:
 *           type: number
 *           example: 50.00
 *         retesource:
 *           type: number
 *           example: 75.00
 *         reteica:
 *           type: number
 *           example: 25.00
 *         fic:
 *           type: number
 *           example: 15.00
 *         other:
 *           type: number
 *           example: 30.00
 *         isActive:
 *           type: boolean
 *           example: true
 */