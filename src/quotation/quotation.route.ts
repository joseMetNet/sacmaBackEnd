import { Application, Router } from "express";
import { QuotationController } from "./quotation.controller";
import { QuotationRepository } from "./quotation.repository";
import { QuotationService } from "./quotation.service";

const quotationRepository = new QuotationRepository();
const quotationService = new QuotationService(quotationRepository);
const quotationController = new QuotationController(quotationService);

export function quotationRoute(app: Application): void {
  const router: Router = Router();

  // GET routes
  router.get("/v1/quotation-item-detail", quotationController.findAllQuotationItemDetails);
  router.get("/v1/quotation-item", quotationController.findAllQuotationItems);
  router.get("/v1/quotation-status", quotationController.findAllQuotationStatus);
  router.get("/v1/quotation", quotationController.findAllQuotations);
  router.get("/v1/quotation-item-detail/:idQuotationItemDetail", quotationController.findQuotationItemDetailById);
  router.get("/v1/quotation-item/:idQuotationItem", quotationController.findQuotationItemById);
  router.get("/v1/quotation/:idQuotation", quotationController.findQuotationById);

  // POST routes
  router.post("/v1/quotation", quotationController.createQuotation);
  router.post("/v1/quotation-item", quotationController.createQuotationItem);
  router.post("/v1/quotation-item-detail", quotationController.createQuotationItemDetail);
  router.post("/v1/quotation-percentage", quotationController.createQuotationPercentage);

  // PATCH routes
  router.patch("/v1/quotation", quotationController.updateQuotation);
  router.patch("/v1/quotation-item", quotationController.updateQuotationItem);
  router.patch("/v1/quotation-item-detail", quotationController.updateQuotationItemDetail);
  router.patch("/v1/quotation-percentage", quotationController.updateQuotationPercentage);

  // DELETE routes
  router.delete("/v1/quotation/:idQuotation", quotationController.deleteQuotation);
  router.delete("/v1/quotation-item/:idQuotationItem", quotationController.deleteQuotationItem);
  router.delete("/v1/quotation-item-detail/:idQuotationItemDetail", quotationController.deleteQuotationItemDetail);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/quotation-item-detail:
 *   get:
 *     tags: [Quotation]
 *     summary: Find all Quotation Item Details
 *     description: Retrieve a list of all quotation item details
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
 *     responses:
 *       200:
 *         description: A list of quotation item details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuotationItemDetailDTO'
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
 * /v1/quotation-item:
 *   get:
 *     tags: [Quotation]
 *     summary: Find all Quotation Items
 *     description: Retrieve a list of all quotation items
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
 *     responses:
 *       200:
 *         description: A list of quotation items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuotationItemDTO'
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
 * /v1/quotation:
 *   get:
 *     tags: [Quotation]
 *     summary: Find Quotations
 *     description: Find all Quotations
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
 *         name: customerId
 *         schema:
 *           type: integer
 *         description: Id of the customer
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Name of the customer
 *       - in: query
 *         name: quotationDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the quotation
 *     responses:
 *       200:
 *         description: A list of quotations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuotationDTO'
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
 * /v1/quotation-status:
 *   get:
 *     tags: [Quotation]
 *     summary: Find all Quotation Status
 *     description: Retrieve a list of all quotation status
 *     responses:
 *       200:
 *         description: A list of quotation status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuotationStatusDTO'
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
 * /v1/quotation-item-detail/{idQuotationItemDetail}:
 *   get:
 *     tags: [Quotation]
 *     summary: Find Quotation Item Detail by ID
 *     description: Retrieve a specific quotation item detail by ID
 *     parameters:
 *       - in: path
 *         name: idQuotationItemDetail
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation Item Detail to get
 *     responses:
 *       200:
 *         description: A Quotation Item Detail object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDetailDTO'
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
 * /v1/quotation-item/{idQuotationItem}:
 *   get:
 *     tags: [Quotation]
 *     summary: Find Quotation Item by ID
 *     description: Retrieve a specific quotation item by ID
 *     parameters:
 *       - in: path
 *         name: idQuotationItem
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation Item to get
 *     responses:
 *       200:
 *         description: A Quotation Item object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDTO'
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
 * /v1/quotation/{idQuotation}:
 *   get:
 *     tags: [Quotation]
 *     summary: Find Quotation by ID
 *     description: Use to request a Quotation by ID
 *     parameters:
 *       - in: path
 *         name: idQuotation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation to get
 *     responses:
 *       200:
 *         description: A Quotation object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationDTO'
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
 * /v1/quotation-item-detail:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new Quotation Item Detail
 *     description: Create a new quotation item detail
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationItemDetailDTO'
 *     responses:
 *       201:
 *         description: Quotation Item Detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDetailDTO'
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
 * /v1/quotation-item:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new Quotation Item
 *     description: Create a new quotation item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationItemDTO'
 *     responses:
 *       201:
 *         description: Quotation Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDTO'
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
 * /v1/quotation:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new Quotation
 *     description: Create a new quotation
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationDTO'
 *     responses:
 *       201:
 *         description: Quotation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationDTO'
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
 * /v1/quotation-percentage:
 *   post:
 *     tags: [Quotation]
 *     summary: Create a new Quotation Percentage
 *     description: Create a new quotation percentage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationPercentageDTO'
 *     responses:
 *       201:
 *         description: Quotation Percentage created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationPercentageDTO'
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
 * /v1/quotation-item-detail:
 *   patch:
 *     tags: [Quotation]
 *     summary: Update an existing Quotation Item Detail
 *     description: Update an existing quotation item detail
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationItemDetailDTO'
 *     responses:
 *       200:
 *         description: Quotation Item Detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDetailDTO'
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
 * /v1/quotation-item:
 *   patch:
 *     tags: [Quotation]
 *     summary: Update an existing Quotation Item
 *     description: Update an existing quotation item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationItemDTO'
 *     responses:
 *       200:
 *         description: Quotation Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationItemDTO'
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
 * /v1/quotation:
 *   patch:
 *     tags: [Quotation]
 *     summary: Update an existing Quotation
 *     description: Update an existing quotation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationDTO'
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationDTO'
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
 * /v1/quotation-percentage:
 *   patch:
 *     tags: [Quotation]
 *     summary: Update an existing Quotation Percentage
 *     description: Update an existing quotation percentage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationPercentageDTO'
 *     responses:
 *       200:
 *         description: Quotation Percentage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuotationPercentageDTO'
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
 * /v1/quotation-item-detail/{idQuotationItemDetail}:
 *   delete:
 *     tags: [Quotation]
 *     summary: Delete a Quotation Item Detail
 *     description: Delete a specific quotation item detail by ID
 *     parameters:
 *       - in: path
 *         name: idQuotationItemDetail
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation Item Detail to delete
 *     responses:
 *       204:
 *         description: Quotation Item Detail deleted successfully
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
 * /v1/quotation-item/{idQuotationItem}:
 *   delete:
 *     tags: [Quotation]
 *     summary: Delete a Quotation Item
 *     description: Delete a specific quotation item by ID
 *     parameters:
 *       - in: path
 *         name: idQuotationItem
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation Item to delete
 *     responses:
 *       204:
 *         description: Quotation Item deleted successfully
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
 * /v1/quotation/{idQuotation}:
 *   delete:
 *     tags: [Quotation]
 *     summary: Delete a Quotation
 *     description: Delete a specific quotation by ID
 *     parameters:
 *       - in: path
 *         name: idQuotation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Quotation to delete
 *     responses:
 *       204:
 *         description: Quotation deleted successfully
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
 *     QuotationItemDetailDTO:
 *       type: object
 *       required:
 *         - idQuotationItem
 *         - idInput
 *         - quantity
 *       properties:
 *         idQuotationItem:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *     QuotationItemDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         productId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuotationItemDetailDTO'
 *     QuotationStatusDTO:
 *       type: object
 *       properties:
 *         idQuotationStatus:
 *           type: integer
 *           example: 1
 *         quotationStatus:
 *           type: string
 *     QuotationDTO:
 *       type: object
 *       properties:
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         idResponsable:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Quotation name"
 *         idQuotationStatus:
 *           type: integer
 *           example: 1
 *         builder:
 *           type: string
 *           example: "Amarilo"
 *         builderAddress:
 *           type: string
 *           example: "Calle 123"
 *         projectName:
 *           type: string
 *           example: "Project name"
 *         itemSummary:
 *           type: string
 *           example: "Item summary"
 *         totalCost:
 *           type: number
 *           example: 1000.00
 *     CreateQuotationDTO:
 *       type: object
 *       required:
 *         - idResponsable
 *         - name
 *       properties:
 *         idResponsable:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Quotation name"
 *         builder:
 *           type: string
 *           example: "Amarilo"
 *         builderAddress:
 *           type: string
 *           example: "Calle 123"
 *         projectName:
 *           type: string
 *           example: "Project name"
 *         itemSummary:
 *           type: string
 *           example: "Item summary"
 *     QuotationPercentageDTO:
 *       type: object
 *       properties:
 *         idQuotationPercentage:
 *           type: integer
 *           example: 1
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         administration:
 *           type: number
 *           example: 10.00
 *         utility:
 *           type: number
 *           example: 10.00
 *         unforeseen:
 *           type: number
 *           example: 10.00
 *         tax:
 *           type: number
 *           example: 10.00
 *     CreateQuotationPercentageDTO:
 *       type: object
 *       required:
 *         - idQuotation
 *         - administration
 *         - utility
 *         - unforeseen
 *         - tax
 *       properties:
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         administration:
 *           type: number
 *           example: 10.00
 *         utility:
 *           type: number
 *           example: 10.00
 *         unforeseen:
 *           type: number
 *           example: 10.00
 *         tax:
 *           type: number
 *           example: 10.00
 *     UpdateQuotationPercentageDTO:
 *       type: object
 *       required:
 *         - idQuotationPercentage
 *       properties:
 *         idQuotationPercentage:
 *           type: integer
 *           example: 1
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         administration:
 *           type: number
 *           example: 10.00
 *         utility:
 *           type: number
 *           example: 10.00
 *         unforeseen:
 *           type: number
 *           example: 10.00
 *         tax:
 *           type: number
 *           example: 10.00
 *     UpdateQuotationDTO:
 *       type: object
 *       required:
 *         - idQuotation
 *       properties:
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         idResponsable:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Quotation name"
 *         idQuotationStatus:
 *           type: integer
 *           example: 1
 *         builder:
 *           type: string
 *           example: "Amarilo"
 *         builderAddress:
 *           type: string
 *           example: "Calle 123"
 *         projectName:
 *           type: string
 *           example: "Project name"
 *         itemSummary:
 *           type: string
 *           example: "Item summary"
 *     CreateQuotationItemDTO:
 *       type: object
 *       required:
 *         - idQuotation
 *         - item
 *         - technicalSpecification
 *         - unitMeasure
 *         - quantity
 *         - unitPrice
 *       properties:
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         item:
 *           type: string
 *           example: "Item description"
 *         technicalSpecification:
 *           type: string
 *           example: "Technical specification"
 *         unitMeasure:
 *           type: string
 *           example: "Unit measure"
 *         quantity:
 *            type: integer
 *            example: 10
 *         unitPrice:
 *           type: number
 *           example: 100.00
 *         total:
 *           type: number
 *           example: 1000.00
 *     UpdateQuotationItemDTO:
 *       type: object
 *       required:
 *         - idQuotationItem
 *       properties:
 *         idQuotationItem:
 *           type: integer
 *           example: 1
 *         idQuotation:
 *           type: integer
 *           example: 1
 *         item:
 *           type: string
 *           example: "Item description"
 *         technicalSpecification:
 *           type: string
 *           example: "Technical specification"
 *         unitMeasure:
 *           type: string
 *           example: "Unit measure"
 *         quantity:
 *            type: integer
 *            example: 10
 *         unitPrice:
 *           type: number
 *           example: 100.00
 *         total:
 *           type: number
 *           example: 1000.00
 *     CreateQuotationItemDetailDTO:
 *       type: object
 *       required:
 *         - idQuotationItem
 *         - idInput
 *         - quantity
 *       properties:
 *         idQuotationItem:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *     UpdateQuotationItemDetailDTO:
 *       type: object
 *       required:
 *         - idQuotationItemDetail
 *       properties:
 *         idQuotationItemDetail:
 *           type: integer
 *           example: 1
 *         idQuotationItem:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 10
 *         totalCost:
 *           type: number
 *           example: 100.00
*/