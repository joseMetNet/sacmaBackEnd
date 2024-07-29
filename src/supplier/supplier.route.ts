import { Application, Router } from "express";
import { supplierController } from "./supplier.controller";
import { verifyToken } from "../middlewares";

export function supplierRoutes(app: Application): void {
  const router: Router = Router();

  /**
   * @openapi
   * /v1/suppliers/document-types:
   *   get:
   *     tags: [Supplier]
   *     summary: find document types
   *     description: Find all document types
   *     responses:
   *       200:
   *         description: A list of document types
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SupplierDocument'
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
  router.get(
    "/v1/suppliers/document-types",
    supplierController.findDocumentTypes
  );

  /**
   * @openapi
   * /v1/suppliers/upload-document:
   *   post:
   *     tags: [Supplier]
   *     summary: Upload required document
   *     description: Upload a required document for a supplier
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/UploadDocument'
   *     responses:
   *       201:
   *         description: Supplier created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SupplierDocument'
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
  router.post(
    "/v1/suppliers/upload-document",
    [verifyToken],
    supplierController.uploadRequiredDocument
  );

  /**
   * @openapi
   * /v1/suppliers:
   *   get:
   *     tags: [Supplier]
   *     summary: Get all suppliers
   *     description: Get a list of all suppliers
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
   *         name: socialReason
   *         schema:
   *           type: string
   *         description: Social reason of the supplier
   *     responses:
   *       200:
   *         description: A list of suppliers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Supplier'
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
  router.get(
    "/v1/suppliers",
    [verifyToken],
    supplierController.findAll
  );

  /**
   * @openapi
   * /v1/suppliers:
   *   post:
   *     tags: [Supplier]
   *     summary: Create a new supplier
   *     description: Create a new supplier with the given details
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/CreateSupplier'
   *     responses:
   *       201:
   *         description: Supplier created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Supplier'
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
  router.post(
    "/v1/suppliers",
    [verifyToken],
    supplierController.create
  );

  /**
   * @openapi
   * /v1/suppliers/{id}:
   *   get:
   *     tags: [Supplier]
   *     summary: Get supplier by ID
   *     description: Get details of a supplier by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the supplier
   *     responses:
   *       200:
   *         description: Supplier details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Supplier'
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
  router.get(
    "/v1/suppliers/:id",
    [verifyToken],
    supplierController.findById
  );

  /**
   * @openapi
   * /v1/suppliers/{id}:
   *   delete:
   *     tags: [Supplier]
   *     summary: Delete a supplier
   *     description: Delete a supplier by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the supplier
   *     responses:
   *       204:
   *         description: Supplier deleted successfully
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
  router.delete(
    "/v1/suppliers/:id",
    [verifyToken],
    supplierController.delete
  );

  /**
   * @openapi
   * /v1/suppliers:
   *   patch:
   *     tags: [Supplier]
   *     summary: Update a supplier
   *     description: Update a supplier with the given details
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/UpdateSupplier'
   *     responses:
   *       200:
   *         description: Supplier updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Supplier'
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
  router.patch(
    "/v1/suppliers",
    [verifyToken],
    supplierController.update
  );

  /**
 * @openapi
 * components:
 *   schemas:
 *     UploadDocument:
 *       type: object
 *       properties:
 *         idDocumentType:
 *           type: integer
 *         idSupplier:
 *           type: integer
 *         document:
 *           type: string
 *           format: binary
 *     SupplierDocument:
 *       type: object
 *       properties:
 *         idDocumentType:
 *           type: integer
 *         documentType:
 *           type: string
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         socialReason:
 *           type: string
 *         nit:
 *           type: string
 *         telephone:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         idState:
 *           type: integer
 *         idCity:
 *           type: integer
 *         address:
 *           type: string
 *         status:
 *           type: boolean
 *         imageProfile:
 *           type: string
 *           format: binary
 *         idAccountType:
 *           type: integer
 *           nullable: true
 *         idBankAccount:
 *           type: integer
 *           nullable: true
 *         accountNumber:
 *           type: string
 *           nullable: true
 *         accountHolder:
 *           type: string
 *           nullable: true
 *         accountHolderId:
 *           type: string
 *           nullable: true
 *         paymentMethod:
 *           type: string
 *           nullable: true
 *         observation:
 *           type: string
 *           nullable: true
 *         supplierContactName:
 *           type: string
 *           nullable: true
 *         supplierContactEmail:
 *           type: string
 *           nullable: true
 *         supplierContactPhoneNumber:
 *           type: string
 *           nullable: true
 *         supplierContactPosition:
 *           type: string
 *           nullable: true
 *     CreateSupplier:
 *       type: object
 *       required:
 *         - socialReason
 *         - nit
 *         - telephone
 *         - phoneNumber
 *         - idState
 *         - idCity
 *         - address
 *         - status
 *       properties:
 *         socialReason:
 *           type: string
 *         nit:
 *           type: string
 *         telephone:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         idState:
 *           type: integer
 *         idCity:
 *           type: integer
 *         address:
 *           type: string
 *         status:
 *           type: boolean
 *         imageProfile:
 *           type: string
 *           format: binary
 *         idAccountType:
 *           type: integer
 *           nullable: true
 *         idBankAccount:
 *           type: integer
 *           nullable: true
 *         accountNumber:
 *           type: string
 *           nullable: true
 *         accountHolder:
 *           type: string
 *           nullable: true
 *         accountHolderId:
 *           type: string
 *           nullable: true
 *         paymentMethod:
 *           type: string
 *           nullable: true
 *         observation:
 *           type: string
 *           nullable: true
 *         contactInfo:
 *           type: string
 *           nullable: true
 * 
 *     CreateContactSupplier:
 *       type: object
 *       properties:
 *         supplierContactName:
 *           type: string
 *           nullable: true
 *         supplierContactEmail:
 *           type: string
 *           nullable: true
 *         supplierContactPhoneNumber:
 *           type: string
 *           nullable: true
 *         supplierContactPosition:
 *           type: string
 *           nullable: true
 *     UpdateSupplier:
 *       type: object
 *       required:
 *         - idSupplier
 *       properties:
 *         idSupplier:
 *           type: integer
 *         socialReason:
 *           type: string
 *           nullable: true
 *         nit:
 *           type: string
 *           nullable: true
 *         telephone:
 *           type: string
 *           nullable: true
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *         idState:
 *           type: integer
 *           nullable: true
 *         idCity:
 *           type: integer
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         status:
 *           type: boolean
 *           nullable: true
 *         imageProfile:
 *           type: string
 *           nullable: true
 *         idAccountType:
 *           type: integer
 *           nullable: true
 *         idBankAccount:
 *           type: integer
 *           nullable: true
 *         accountNumber:
 *           type: string
 *           nullable: true
 *         accountHolder:
 *           type: string
 *           nullable: true
 *         accountHolderId:
 *           type: string
 *           nullable: true
 *         paymentMethod:
 *           type: string
 *           nullable: true
 *         observation:
 *           type: string
 *           nullable: true
 */
  app.use("/api/", router);
}