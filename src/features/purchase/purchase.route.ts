import {Application, Router} from "express";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";
import { PurchaseService } from "./purchase.service";

export function purchaseRoute(app: Application) {
  const router = Router();
  const purchaseRepository = new PurchaseRepository();
  const purchaseService = new PurchaseService(purchaseRepository);
  const purchaseController = new PurchaseController(purchaseService);

  router.get("/v1/purchase/request", purchaseController.findAllPurchaseRequest);
  router.get("/v1/purchase/request/status", purchaseController.findPurchaseRequestStatus);
  router.get("/v1/purchase/request/detail", purchaseController.findAllPurchaseRequestDetail);
  router.get("/v1/purchase/inventory-purchase", purchaseController.findAllInventoryPurchase);
  router.get("/v1/purchase/request/getDetailMachineryUsed", purchaseController.findAllPurchaseRequestDetailMachineryUsed);
  router.get("/v1/purchase/request/getDetailMachineryUsedPaginatorNot", purchaseController.findAllPurchaseRequestDetailMachineryUsedPaginatorNot);
  router.get("/v1/purchase/request/:idPurchaseRequest", purchaseController.findByIdPurchaseRequest);
  router.get("/v1/purchase/request/detail/:idPurchaseRequestDetail", purchaseController.findByIdPurchaseRequestDetail);  
  // router.get("/v1/purchase/request/getDetailByIdMachineryUsed/:idPurchaseRequest", purchaseController.findByIdPurchaseRequestMachineryUsed);

  router.post("/v1/purchase/request", purchaseController.createPurchaseRequest);
  router.post("/v1/purchase/request/detail", purchaseController.createPurchaseRequestDetail);
  router.post("/v1/purchase/request/detailMachineryUsed", purchaseController.createPurchaseRequestDetailMachineryUsed);
  
  router.patch("/v1/purchase/request", purchaseController.updatePurchaseRequest);
  router.patch("/v1/purchase/request/detail", purchaseController.updatePurchaseRequestDetail);
  router.patch("/v1/purchase/request/updateDetailMachineryUsed", purchaseController.updatePurchaseRequestDetailMachineryUsed);

  router.delete("/v1/purchase/request/:idPurchaseRequest", purchaseController.deletePurchaseRequest);
  router.delete("/v1/purchase/request/detail/:idPurchaseRequestDetail", purchaseController.deletePurchaseRequestDetail);
  router.delete("/v1/purchase/request/deleteDetailMachineryUsed/:idPurchaseRequestDetailMachineryUsed", purchaseController.deletePurchaseRequestDetailMachineryUsed);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/purchase/request:
 *   get:
 *     tags: [Purchase]
 *     summary: Find all purchase requests
 *     description: Retrieve a list of purchase requests
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
 *         description: Consecutive of the purchase request
 *       - in: query
 *         name: purchaseRequest
 *         schema:
 *           type: string
 *         description: Purchase request description
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: Input ID
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: Warehouse ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: A list of purchase requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequest'
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
 * /v1/purchase/request/detail:
 *   get:
 *     tags: [Purchase]
 *     summary: Find all purchase request details
 *     description: Retrieve a list of purchase request details
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
 *         name: idPurchaseRequest
 *         schema:
 *           type: integer
 *         description: ID of the purchase request
 *     responses:
 *       200:
 *         description: A list of purchase request details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequestDetail'
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
 * /v1/purchase/request/status:
 *   get:
 *     tags: [Purchase]
 *     summary: Find all purchase request status
 *     description: Retrieve a list of purchase request status
 *     responses:
 *       200:
 *         description: A list of purchase request status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequestStatus'
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
 * /v1/purchase/request/{idPurchaseRequest}:
 *   get:
 *     tags: [Purchase]
 *     summary: Retrieve a single purchase request
 *     description: Retrieve a single purchase request by its ID
 *     parameters:
 *       - in: path
 *         name: idPurchaseRequest
 *         schema:
 *           type: integer
 *         description: ID of the purchase request to retrieve
 *     responses:
 *       200:
 *         description: A single purchase request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequest'
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
 * /v1/purchase/request/detail/{idPurchaseRequestDetail}:
 *   get:
 *     tags: [Purchase]
 *     summary: Retrieve a single purchase request detail
 *     description: Retrieve a single purchase request detail by its ID
 *     parameters:
 *       - in: path
 *         name: idPurchaseRequestDetail
 *         schema:
 *           type: integer
 *         description: ID of the purchase request detail to retrieve
 *     responses:
 *       200:
 *         description: A single purchase request detail
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequestDetail'
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
 * /v1/purchase/request:
 *   post:
 *     tags: [Purchase]
 *     summary: Create or update purchase requests (UPSERT)
 *     description: |
 *       Create a new purchase request. If 'items' array is provided, processes multiple items with UPSERT logic:
 *       - If a record with the same idWarehouse + idSupplier + idInput exists, it UPDATES the quantity (adds to existing) and price
 *       - If no record exists, it CREATES a new purchase request
 *       - Without 'items' array, creates a single purchase request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CreatePurchaseRequest'
 *               - $ref: '#/components/schemas/CreatePurchaseRequestWithItems'
 *     responses:
 *       201:
 *         description: Purchase Request(s) processed successfully (created/updated)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PurchaseRequest'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "SUCCESS"
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "3 purchase requests processed (2 created, 1 updated)"
 *                         created:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/PurchaseRequest'
 *                         updated:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/PurchaseRequest'
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
 * /v1/purchase/request/detail:
 *   post:
 *     tags: [Purchase]
 *     summary: Create a new purchase request detail
 *     description: Create a new purchase request detail
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseRequestDetail'
 *     responses:
 *       201:
 *         description: Purchase Request Detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
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
 * /v1/purchase/request:
 *   patch:
 *     tags: [Purchase]
 *     summary: Update an existing purchase request (with file upload and automatic cost sync)
 *     description: |
 *       Update an existing purchase request with support for document uploads. The system will:
 *       1. Delete old documents from Azure Blob Storage if new ones are provided
 *       2. Upload new documents (document and/or requestDocument) to Azure Blob Storage
 *       3. Generate proper URLs (e.g., https://sacmaback.blob.core.windows.net/purchase/{uuid}.pdf)
 *       4. If both idInput and price are provided and price changed, automatically update the cost field in TB_Input
 *       5. Update the purchase request with all provided fields
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - idPurchaseRequest
 *             properties:
 *               idPurchaseRequest:
 *                 type: integer
 *                 example: 1
 *               consecutive:
 *                 type: string
 *                 example: "PR-001"
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Main document file (PDF or image)
 *               requestDocument:
 *                 type: string
 *                 format: binary
 *                 description: Request document file (PDF or image)
 *               idInput:
 *                 type: integer
 *                 example: 1
 *               idWarehouse:
 *                 type: integer
 *                 example: 1
 *               idSupplier:
 *                 type: integer
 *                 example: 1
 *               purchaseRequest:
 *                 type: string
 *                 example: "Purchase request description"
 *               quantity:
 *                 type: string
 *                 example: "10"
 *               price:
 *                 type: string
 *                 example: "150000"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Purchase Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PurchaseRequest'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "SUCCESS"
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PurchaseRequest'
 *                         - type: object
 *                           properties:
 *                             costUpdated:
 *                               type: boolean
 *                               example: true
 *                             message:
 *                               type: string
 *                               example: "Purchase request updated and input cost synchronized"
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
 * /v1/purchase/request/detail:
 *   patch:
 *     tags: [Purchase]
 *     summary: Update an existing purchase request detail (with automatic price recalculation)
 *     description: |
 *       Update an existing purchase request detail and automatically recalculate the total price in TB_PurchaseRequest.
 *       The system will:
 *       1. Update the detail record with the provided data (quantity, price, etc.)
 *       2. Recalculate the total price by summing (quantity * price) of all details for that purchase request
 *       3. Update the price field in TB_PurchaseRequest with the new total
 *       
 *       This ensures that TB_PurchaseRequest.price always reflects the sum of all its details.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePurchaseRequestDetail'
 *     responses:
 *       200:
 *         description: Purchase Request Detail updated successfully with price recalculation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/PurchaseRequestDetail'
 *                     - type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Purchase request detail updated successfully"
 *                         totalPriceRecalculated:
 *                           type: number
 *                           example: 10200000
 *                           description: New total price in TB_PurchaseRequest after recalculation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Purchase request detail not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/purchase/request/{idPurchaseRequest}:
 *   delete:
 *     tags: [Purchase]
 *     summary: Delete an existing purchase request
 *     description: Delete an existing purchase request
 *     parameters:
 *       - in: path
 *         name: idPurchaseRequest
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the purchase request to delete
 *     responses:
 *       204:
 *         description: Purchase request deleted successfully
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
 * /v1/purchase/request/detail/{idPurchaseRequestDetail}:
 *   delete:
 *     tags: [Purchase]
 *     summary: Delete an existing purchase request detail (with automatic price recalculation)
 *     description: |
 *       Delete an existing purchase request detail and automatically recalculate the total price in TB_PurchaseRequest.
 *       The system will:
 *       1. Retrieve the detail to be deleted (to get quantity and price)
 *       2. Delete the detail record
 *       3. Recalculate the total price by summing (quantity * price) of all remaining details
 *       4. Update the price field in TB_PurchaseRequest with the new total
 *     parameters:
 *       - in: path
 *         name: idPurchaseRequestDetail
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the purchase request detail to delete
 *     responses:
 *       200:
 *         description: Purchase request detail deleted successfully with price recalculation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Purchase request detail deleted successfully"
 *                     amountSubtracted:
 *                       type: number
 *                       example: 3400000
 *                       description: Amount subtracted from total (quantity * price of deleted detail)
 *                     newTotalPrice:
 *                       type: number
 *                       example: 6800000
 *                       description: New total price in TB_PurchaseRequest after recalculation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Purchase request detail not found
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
 *     PurchaseRequest:
 *       type: object
 *       properties:
 *         idPurchaseRequest:
 *           type: integer
 *           example: 1
 *         consecutive:
 *           type: string
 *           example: "PR-001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2021-09-01T00:00:00.000Z"
 *         documentUrl:
 *           type: string
 *           example: "https://example.com/document.pdf"
 *         idInput:
 *           type: integer
 *           example: 1
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 1
 *         purchaseRequest:
 *           type: string
 *           example: "Purchase request description"
 *         quantity:
 *           type: string
 *           example: "10"
 *         price:
 *           type: string
 *           example: "150000"
 *         requestDocumentUrl:
 *           type: string
 *           example: "https://example.com/request.pdf"
 *         isActive:
 *           type: boolean
 *           example: true
 *     PurchaseRequestDetail:
 *       type: object
 *       properties:
 *         idPurchaseRequestDetail:
 *           type: integer
 *           example: 1
 *         idPurchaseRequest:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Item description"
 *         unitMeasure:
 *           type: string
 *           example: "unit"
 *         quantity:
 *           type: number
 *           example: 1
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     PurchaseRequestStatus:
 *       type: object
 *       properties:
 *         idPurchaseRequestStatus:
 *           type: integer
 *           example: 1
 *         purchaseRequestStatus:
 *           type: string
 *           example: "Purchase request status"
 *     CreatePurchaseRequest:
 *       type: object
 *       properties:
 *         consecutive:
 *           type: string
 *           example: "PR-001"
 *         documentUrl:
 *           type: string
 *           example: "https://example.com/document.pdf"
 *         idInput:
 *           type: integer
 *           example: 1
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 1
 *         purchaseRequest:
 *           type: string
 *           example: "Purchase request description"
 *         quantity:
 *           type: string
 *           example: "10"
 *         price:
 *           type: string
 *           example: "150000"
 *         requestDocumentUrl:
 *           type: string
 *           example: "https://example.com/request.pdf"
 *         isActive:
 *           type: boolean
 *           example: true
 *     CreatePurchaseRequestDetail:
 *       type: object
 *       required:
 *         - idPurchaseRequest
 *         - idInput
 *         - quantity
 *       properties:
 *         idPurchaseRequest:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 1
 *         purchaseRequest:
 *           type: string
 *           example: "Purchase request description"
 *         quantity:
 *           type: number
 *           example: 1
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         price:
 *           type: string
 *           example: "150000"
 *         requestDocumentUrl:
 *           type: string
 *           example: "https://example.com/request.pdf"
 *         documentUrl:
 *           type: string
 *           example: "https://example.com/document.pdf"
 *         isActive:
 *           type: boolean
 *           example: true
 *     UpdatePurchaseRequest:
 *       type: object
 *       required:
 *         - idPurchaseRequest
 *       properties:
 *         idPurchaseRequest:
 *           type: integer
 *           example: 1
 *         consecutive:
 *           type: string
 *           example: "PR-001"
 *         documentUrl:
 *           type: string
 *           example: "https://example.com/document.pdf"
 *         idInput:
 *           type: integer
 *           example: 1
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 1
 *         purchaseRequest:
 *           type: string
 *           example: "Purchase request description"
 *         quantity:
 *           type: string
 *           example: "10"
 *         price:
 *           type: string
 *           example: "150000"
 *         requestDocumentUrl:
 *           type: string
 *           example: "https://example.com/request.pdf"
 *         isActive:
 *           type: boolean
 *           example: true
 *     
 *     CreatePurchaseRequestWithItems:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         isActive:
 *           type: boolean
 *           example: true
 *         requestOrder:
 *           type: string
 *           example: "20"
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 91
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - idInput
 *               - quantity
 *               - price
 *             properties:
 *               idInput:
 *                 type: integer
 *                 example: 214
 *               quantity:
 *                 type: number
 *                 example: 40
 *               price:
 *                 type: number
 *                 example: 85000
 *     
 *     UpdatePurchaseRequestDetail:
 *       type: object
 *       required:
 *         - idPurchaseRequestDetail
 *       properties:
 *         idPurchaseRequestDetail:
 *           type: integer
 *           example: 27
 *         idPurchaseRequest:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 200
 *         idWarehouse:
 *           type: integer
 *           example: 1
 *         idSupplier:
 *           type: integer
 *           example: 92
 *         purchaseRequest:
 *           type: string
 *           example: "002"
 *         quantity:
 *           type: string
 *           example: "10"
 *         price:
 *           type: string
 *           example: "10451"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 */