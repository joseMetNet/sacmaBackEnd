import { Application, Router } from "express";
import { costCenterController } from "./cost-center.controller";

export function costCenterRoutes(app: Application): void {
  const router: Router = Router();

  // GET routes
  router.get("/v1/cost-center", costCenterController.findAll);
  router.get("/v1/cost-center/contact", costCenterController.findAllCostCenterContact);
  router.get("/v1/cost-center/project", costCenterController.findAllCostCenterProject);
  router.get("/v1/cost-center/project/item", costCenterController.findAllProjectItem);
  router.get("/v1/cost-center/download", costCenterController.download);
  router.get("/v1/cost-center/:idCostCenter", costCenterController.findById);
  
  // POST routes
  router.post("/v1/cost-center", costCenterController.create);
  router.post("/v1/cost-center/contact", costCenterController.createCostCenterContact);
  router.post("/v1/cost-center/project", costCenterController.createCostCenterProject);
  router.post("/v1/cost-center/project/item", costCenterController.createProjectItem);
  
  // PATCH routes
  router.patch("/v1/cost-center", costCenterController.update);
  router.patch("/v1/cost-center/contact", costCenterController.updateCostCenterContact);
  router.patch("/v1/cost-center/project", costCenterController.updateCostCenterProject);
  router.patch("/v1/cost-center/project/item", costCenterController.updateProjectItem);
  
  // DELETE routes
  router.delete("/v1/cost-center/:idCostCenter", costCenterController.delete);
  router.delete("/v1/cost-center/contact/:idCostCenterContact", costCenterController.deleteCostCenterContact);
  router.delete("/v1/cost-center/project/:idCostCenterProject", costCenterController.deleteCostCenterProject);
  router.delete("/v1/cost-center/project/item/:idProjectItem", costCenterController.deleteProjectItem);

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
*/
