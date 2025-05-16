import { Application, Router } from "express";
import { invoiceController } from "./invoice.controller";

export function invoiceRoutes(app: Application): void {
  const router: Router = Router();

  // GET routes
  router.get("/v1/invoice", invoiceController.findAll);
  router.get("/v1/invoice/status", invoiceController.findAllInvoiceStatus);
  router.get("/v1/invoice/:idInvoice", invoiceController.findById);

  // POST routes
  router.post("/v1/invoice", invoiceController.create);

  // PATCH routes
  router.patch("/v1/invoice", invoiceController.update);

  // DELETE routes
  router.delete("/v1/invoice/:idInvoice", invoiceController.delete);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/invoice:
 *   get:
 *     tags: [Invoice]
 *     summary: Find invoices
 *     description: Find invoices
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
 *           type: integer
 *         description: ID of the cost center project
 *       - in: query
 *         name: idInvoiceStatus
 *         schema:
 *           type: integer
 *         description: ID of the invoice status
 *     responses:
 *       200:
 *         description: A list of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Invoice'
 *                     count:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
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
 * /v1/invoice/{idInvoice}:
 *   get:
 *     tags: [Invoice]
 *     summary: Find invoice by ID
 *     description: Find invoice by ID
 *     parameters:
 *       - in: path
 *         name: idInvoice
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the invoice
 *     responses:
 *       200:
 *         description: Invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
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
 * /v1/invoice/status:
 *   get:
 *     tags: [Invoice]
 *     summary: Find all invoice statuses
 *     description: Find all invoice statuses
 *     responses:
 *       200:
 *         description: A list of invoice statuses
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
 *                     $ref: '#/components/schemas/InvoiceStatus'
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
 * /v1/invoice:
 *   post:
 *     tags: [Invoice]
 *     summary: Create a new invoice
 *     description: Create a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice
 *               - idCostCenterProject
 *               - client
 *               - value
 *               - idInvoiceStatus
 *             properties:
 *               invoice:
 *                 type: string
 *               idCostCenterProject:
 *                 type: integer
 *               client:
 *                 type: string
 *               value:
 *                 type: string
 *               idInvoiceStatus:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Invoice created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request
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
 * /v1/invoice:
 *   patch:
 *     tags: [Invoice]
 *     summary: Update an invoice
 *     description: Update an invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idInvoice
 *             properties:
 *               idInvoice:
 *                 type: integer
 *               invoice:
 *                 type: string
 *               idCostCenterProject:
 *                 type: integer
 *               client:
 *                 type: string
 *               value:
 *                 type: string
 *               idInvoiceStatus:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Invoice updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
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
 * /v1/invoice/{idInvoice}:
 *   delete:
 *     tags: [Invoice]
 *     summary: Delete an invoice
 *     description: Delete an invoice
 *     parameters:
 *       - in: path
 *         name: idInvoice
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the invoice
 *     responses:
 *       200:
 *         description: Invoice deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleted:
 *                       type: boolean
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
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         idInvoice:
 *           type: integer
 *         invoice:
 *           type: string
 *         idCostCenterProject:
 *           type: integer
 *         client:
 *           type: string
 *         value:
 *           type: string
 *         idInvoiceStatus:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         costCenterProject:
 *           $ref: '#/components/schemas/CostCenterProject'
 *         invoiceStatus:
 *           $ref: '#/components/schemas/InvoiceStatus'
 *     InvoiceStatus:
 *       type: object
 *       properties:
 *         idInvoiceStatus:
 *           type: integer
 *         status:
 *           type: string
*/ 