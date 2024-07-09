import { Application, Router } from "express";
import { providerController } from "./provider.controller";

export function providerRoutes(app: Application): void {
  const router: Router = Router();

  /**
   * @openapi
   * /v1/providers:
   *   get:
   *     tags: [Provider]
   *     summary: Get all providers
   *     description: Get a list of all providers
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
   *         description: Social reason of the provider
   *     responses:
   *       200:
   *         description: A list of providers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Provider'
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
  router.get("/v1/providers", providerController.findAll);

  /**
   * @openapi
   * /v1/providers:
   *   post:
   *     tags: [Provider]
   *     summary: Create a new provider
   *     description: Create a new provider with the given details
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/CreateProvider'
   *     responses:
   *       201:
   *         description: Provider created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Provider'
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
  router.post("/v1/providers", providerController.create);

  /**
   * @openapi
   * /v1/providers/{id}:
   *   get:
   *     tags: [Provider]
   *     summary: Get provider by ID
   *     description: Get details of a provider by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the provider
   *     responses:
   *       200:
   *         description: Provider details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Provider'
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
  router.get("/v1/providers/:id", providerController.findById);

  /**
   * @openapi
   * /v1/providers/{id}:
   *   delete:
   *     tags: [Provider]
   *     summary: Delete a provider
   *     description: Delete a provider by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the provider
   *     responses:
   *       204:
   *         description: Provider deleted successfully
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
  router.delete("/v1/providers/:id", providerController.delete);

  /**
   * @openapi
   * /v1/providers:
   *   patch:
   *     tags: [Provider]
   *     summary: Update a provider
   *     description: Update a provider with the given details
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProvider'
   *     responses:
   *       200:
   *         description: Provider updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Provider'
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
  router.patch("/v1/providers", providerController.update);

  /**
 * @openapi
 * components:
 *   schemas:
 *     Provider:
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
 *         providerContactName:
 *           type: string
 *           nullable: true
 *         providerContactEmail:
 *           type: string
 *           nullable: true
 *         providerContactPhoneNumber:
 *           type: string
 *           nullable: true
 *         providerContactPosition:
 *           type: string
 *           nullable: true
 *     CreateProvider:
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
 *         providerContactName:
 *           type: string
 *           nullable: true
 *         providerContactEmail:
 *           type: string
 *           nullable: true
 *         providerContactPhoneNumber:
 *           type: string
 *           nullable: true
 *         providerContactPosition:
 *           type: string
 *           nullable: true
 *     UpdateProvider:
 *       type: object
 *       required:
 *         - idProvider
 *       properties:
 *         idProvider:
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
  app.use("/api/", router)
}