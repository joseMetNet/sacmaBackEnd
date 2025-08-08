import { Application, Router } from "express";
import { costCenterController } from "./cost-center.controller";

export function costCenterRoutes(app: Application): void {
  const router: Router = Router();

  // GET routes
  router.get("/v1/cost-center", costCenterController.findAll);
  router.get("/v1/cost-center/contact", costCenterController.findAllCostCenterContact);
  router.get("/v1/cost-center/project", costCenterController.findAllCostCenterProject);
  router.get("/v1/cost-center/project/item", costCenterController.findAllProjectItem);
  router.get("/v1/cost-center/project/item/by-contract", costCenterController.findProjectItemsByContract);
  router.get("/v1/cost-center/project/list-contract", costCenterController.listProjectContracts);
  router.get("/v1/cost-center/project/document", costCenterController.findAllProjectDocument);
  router.get("/v1/cost-center/download", costCenterController.download);
  router.get("/v1/cost-center/:idCostCenter", costCenterController.findById);

  // POST routes
  router.post("/v1/cost-center", costCenterController.create);
  router.post("/v1/cost-center/contact", costCenterController.createCostCenterContact);
  router.post("/v1/cost-center/project", costCenterController.createCostCenterProject);
  router.post("/v1/cost-center/project/item", costCenterController.createProjectItem);
  router.post("/v1/cost-center/project/document", costCenterController.createProjectDocument);

  // PATCH routes
  router.patch("/v1/cost-center", costCenterController.update);
  router.patch("/v1/cost-center/contact", costCenterController.updateCostCenterContact);
  router.patch("/v1/cost-center/project", costCenterController.updateCostCenterProject);
  router.patch("/v1/cost-center/project/item", costCenterController.updateProjectItem);
  router.patch("/v1/cost-center/project/item/multiple", costCenterController.upsertInvoiceProjectItems);
  router.patch("/v1/cost-center/project/document", costCenterController.updateProjectDocument);

  // DELETE routes
  router.delete("/v1/cost-center/:idCostCenter", costCenterController.delete);
  router.delete("/v1/cost-center/contact/:idCostCenterContact", costCenterController.deleteCostCenterContact);
  router.delete("/v1/cost-center/project/:idCostCenterProject", costCenterController.deleteCostCenterProject);
  router.delete("/v1/cost-center/project/item/:idProjectItem", costCenterController.deleteProjectItem);
  router.delete("/v1/cost-center/project/document/:idProjectDocument", costCenterController.deleteProjectDocument);

  app.use("/api/", router);
}


/**
  * @openapi
  * /v1/cost-center/download:
  *   get:
  *     tags: [Cost Center]
  *     summary: Download inputs
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
 * /v1/cost-center:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find cost centers
 *     description: Find cost centers
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
 *         name: nit
 *         schema:
 *           type: string
 *         description: NIT of the cost center
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the cost center
 *     responses:
 *       200:
 *         description: A list of cost center
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CostCenterContact'
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
 * /v1/cost-center/project/item:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find project items
 *     description: Find project items
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
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: A list of project items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectItem'
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
 * /v1/cost-center/project/list-contract:
 *   get:
 *     tags: [Cost Center]
 *     summary: List project contracts
 *     description: Get all contracts associated with a project
 *     parameters:
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: A list of contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     contracts:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Contract A", "Contract B", "Contract C"]
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
 * /v1/cost-center/project/document:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find project documents
 *     description: Find project documents
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
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: A list of project documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectDocument'
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
 * /v1/cost-center/contact:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find cost centers contact by ID
 *     description: Find cost centers contact by ID
 *     parameters:
 *       - in: query
 *         name: idCostCenter
 *         schema:
 *           type: integer
 *         description: ID of the cost center
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the cost center contact
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email of the cost center contact
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Phone of the cost center contact
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Role of the cost center contact
 *     responses:
 *       200:
 *         description: A list of cost center contact
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CostCenterContact'
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
 * /v1/cost-center/project:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find cost centers project by ID
 *     description: Find cost centers project by ID
 *     parameters:
 *       - in: query
 *         name: idCostCenter
 *         schema:
 *           type: integer
 *         description: ID of the cost center
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the cost center contact
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location of the cost center contact
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Phone of the cost center contact
 *     responses:
 *       200:
 *         description: A list of cost center contact
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CostCenterContact'
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
 * /v1/cost-center/{idCostCenter}:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find cost center by ID
 *     description: Use to request cost center by ID
 *     parameters:
 *       - in: path
 *         name: idCostCenter
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center
 *     responses:
 *       200:
 *         description: A cost center object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenter'
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
 * /v1/cost-center/{idCostCenter}:
 *   delete:
 *     tags: [Cost Center]
 *     summary: Delete cost center by ID
 *     description: Use to request delete cost center by ID
 *     parameters:
 *       - in: path
 *         name: idCostCenter
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center
 *     responses:
 *       204:
 *         description: No Content - Cost center deleted successfully
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
 * /v1/cost-center/project/item/{idProjectItem}:
 *   delete:
 *     tags: [Cost Center]
 *     summary: Delete project item by ID
 *     description: Use to delete a project item by ID
 *     parameters:
 *       - in: path
 *         name: idProjectItem
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project item
 *     responses:
 *       204:
 *         description: No Content - Project item deleted successfully
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
 * /v1/cost-center/contact/{idCostCenterContact}:
 *   delete:
 *     tags: [Cost Center]
 *     summary: Delete cost center contact by ID
 *     description: Use to delete a cost center contact by ID
 *     parameters:
 *       - in: path
 *         name: idCostCenterContact
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center contact
 *     responses:
 *       204:
 *         description: No Content - Cost center contact deleted successfully
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
 * /v1/cost-center/project/{idCostCenterProject}:
 *   delete:
 *     tags: [Cost Center]
 *     summary: Delete cost center project by ID
 *     description: Use to delete a cost center project by ID
 *     parameters:
 *       - in: path
 *         name: idCostCenterProject
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center project
 *     responses:
 *       204:
 *         description: No Content - Cost center project deleted successfully
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
 * /v1/cost-center/project/document/{idProjectDocument}:
 *   delete:
 *     tags: [Cost Center]
 *     summary: Delete project document by ID
 *     description: Use to delete a project document by ID
 *     parameters:
 *       - in: path
 *         name: idProjectDocument
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project document
 *     responses:
 *       204:
 *         description: No Content - Project document deleted successfully
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
 * /v1/cost-center:
 *   post:
 *     tags: [Cost Center]
 *     summary: Create a cost center
 *     description: Create a cost center
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateCostCenter'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenter'
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
 * /v1/cost-center/project/item:
 *   post:
 *     tags: [Cost Center]
 *     summary: Create a project item
 *     description: Create a project item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectItem'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectItem'
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
 * /v1/cost-center/project/document:
 *   post:
 *     tags: [Cost Center]
 *     summary: Create a project document
 *     description: Create a project document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectDocument'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectDocument'
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
 * /v1/cost-center/contact:
 *   post:
 *     tags: [Cost Center]
 *     summary: Create a cost center contact
 *     description: Create a cost center contact
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateCostCenterContact'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenterContact'
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
 * /v1/cost-center/project:
 *   post:
 *     tags: [Cost Center]
 *     summary: Create a cost center project
 *     description: Create a cost center project
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateCostCenterProject'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenterProject'
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
 * /v1/cost-center/contact:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update a cost center contact
 *     description: Update a cost center contact
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCostCenterContact'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenterContact'
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
 * /v1/cost-center/project/item:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update a project item
 *     description: Update a project item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectItem'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectItem'
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
 * /v1/cost-center/project/document:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update a project document
 *     description: Update a project document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectDocument'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectDocument'
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
 * /v1/cost-center/project:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update a cost center project
 *     description: Update a cost center project
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCostCenterProject'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenterProject'
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
 * /v1/cost-center:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update a cost center
 *     description: Update a cost center
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCostCenter'
 *     responses:
 *       201:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostCenter'
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
 * components:
 *   schemas:
 *     CostCenter:
 *       type: object
 *       properties:
 *         idCostCenter:
 *           type: integer
 *         nit:
 *           type: string
 *         name:
 *           type: string
 *         imageUrl:
 *           type: string
 *           format: binary
 *         phone:
 *           type: string
 *     ProjectItem:
 *       type: object
 *       properties:
 *         idProjectItem:
 *           type: integer
 *           format: int64
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         item:
 *           type: string
 *           format: string
 *         unitMeasure:
 *           type: string
 *           format: string
 *         quantity:
 *           type: string
 *           format: string
 *         unitPrice:
 *           type: string
 *           format: string
 *         total:
 *           type: string
 *           format: string
 *         contract:
 *           type: string
 *           format: string
 *         invoicedQuantity:
 *           type: string
 *           format: string
 *     CostCenterContact:
 *       type: object
 *       properties:
 *         idCostCenterContact:
 *           type: integer
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *     CostCenterProject:
 *       type: object
 *       properties:
 *         idCostCenterProject:
 *           type: integer
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *     CreateCostCenter:
 *       type: object
 *       properties:
 *         nit:
 *           type: string
 *         name:
 *           type: string
 *         imageUrl:
 *           type: string
 *           format: binary
 *         phone:
 *           type: string
 *     ProjectDocument:
 *       type: object
 *       properties:
 *         idProjectDocument:
 *           type: integer
 *           format: int64
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         document:
 *           type: string
 *           format: binary
 *         description:
 *           type: string
 *           format: string
 *         value:
 *           type: string
 *           format: string
 *     CreateProjectItem:
 *       type: object
 *       required:
 *         - idCostCenterProject
 *         - item
 *         - unitMeasure
 *         - quantity
 *         - unitPrice
 *       properties:
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         item:
 *           type: string
 *           format: string
 *         unitMeasure:
 *           type: string
 *           format: string
 *         quantity:
 *           type: string
 *           format: string
 *         unitPrice:
 *           type: string
 *           format: string
 *         contract:
 *           type: string
 *           format: string
 *         invoicedQuantity:
 *           type: string
 *           format: string
 *     CreateCostCenterContact:
 *       type: object
 *       properties:
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *     CreateCostCenterProject:
 *       type: object
 *       required:
 *         - idCostCenter
 *         - name
 *       properties:
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *     CreateProjectDocument:
 *       type: object
 *       properties:
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         document:
 *           type: string
 *           format: binary
 *         description:
 *           type: string
 *           format: string
 *         value:
 *           type: string
 *           format: string
 *         fromDate:
 *           type: string
 *           example: 2021-01-01
 *         toDate:
 *           type: string
 *           example: 2021-12-31
 *     UpdateCostCenter:
 *       type: object
 *       properties:
 *         idCostCenter:
 *           type: integer
 *         nit:
 *           type: string
 *         name:
 *           type: string
 *         imageUrl:
 *           type: string
 *           format: binary
 *         phone:
 *           type: string
 *     UpdateProjectItem:
 *       type: object
 *       required:
 *         - idProjectItem
 *       properties:
 *         idProjectItem:
 *           type: integer
 *           format: int64
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         item:
 *           type: string
 *           format: string
 *         unitMeasure:
 *           type: string
 *           format: string
 *         quantity:
 *           type: string
 *           format: string
 *         unitPrice:
 *           type: string
 *           format: string
 *         contract:
 *           type: string
 *           format: string
 *         invoicedQuantity:
 *           type: string
 *           format: string
 *     UpdateCostCenterContact:
 *       type: object
 *       properties:
 *         idCostCenterContact:
 *           type: integer
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *     UpdateCostCenterProject:
 *       type: object
 *       required:
 *         - idCostCenterProject
 *       properties:
 *         idCostCenterProject:
 *           type: integer
 *         idCostCenter:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         document:
 *           type: string
 *           format: binary
 *     UpdateProjectDocument:
 *       type: object
 *       properties:
 *         idProjectDocument:
 *           type: integer
 *           format: int64
 *         idCostCenterProject:
 *           type: integer
 *           format: int64
 *         document:
 *           type: string
 *           format: binary
 *         description:
 *           type: string
 *           format: string
 *         value:
 *           type: string
 *           format: string
 *         fromDate:
 *           type: string
 *           example: 2021-01-01
 *         toDate:
 *           type: string
 *           example: 2021-12-31
*/

/**
 * @openapi
 * /v1/cost-center/project/item/by-contract:
 *   get:
 *     tags: [Cost Center]
 *     summary: Find project items by contract
 *     description: Find project items filtered by contract
 *     parameters:
 *       - in: query
 *         name: contract
 *         schema:
 *           type: string
 *         required: true
 *         description: Contract name to filter by
 *     responses:
 *       200:
 *         description: A list of project items filtered by contract
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectItem'
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
 * /v1/cost-center/project/item/multiple:
 *   patch:
 *     tags: [Cost Center]
 *     summary: Update multiple project items
 *     description: Update invoiced quantity for multiple project items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idInvoice:
 *                       type: integer
 *                       description: ID of the invoice
 *                     idProjectItem:
 *                       type: integer
 *                       description: ID of the project item
 *                     contract:
 *                       type: string
 *                       description: Contract name for the item
 *                     invoicedQuantity:
 *                       type: string
 *                       description: Invoiced quantity for the item
 *                   required:
 *                     - contract
 *                     - idProjectItem
 *                     - invoicedQuantity
 *             required:
 *               - projectItems
 *     responses:
 *       200:
 *         description: Successfully updated project items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectItem'
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
