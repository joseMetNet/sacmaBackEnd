import { Application, Router } from "express";
import { verifyToken } from "../middlewares";
import { machineryController } from "./machinery.controller";

export function machineryRoutes(app: Application): void {
  const router: Router = Router();

  router.get("/v1/machineries", [verifyToken], machineryController.findAll);
  router.get("/v1/machineries/types", [verifyToken], machineryController.findMachineryType);
  router.get("/v1/machineries/models", [verifyToken], machineryController.findMachineryModel);
  router.get("/v1/machineries/brands", [verifyToken], machineryController.findMachineryBrand);
  router.get("/v1/machineries/download", [verifyToken], machineryController.download);
  router.get("/v1/machineries/:idMachinery", [verifyToken], machineryController.findById);
  router.delete("/v1/machineries/:idMachinery", [verifyToken], machineryController.delete);
  router.delete("/v1/machineries/machinery-maintenance/:idMachineryMaintenance", [verifyToken], machineryController.deleteMachineryMaintenance);
  router.delete("/v1/machineries/machinery-location/:idMachineryLocationHistory", [verifyToken], machineryController.deleteMachineryLocation);
  router.post("/v1/machineries", [verifyToken], machineryController.create);
  router.post("/v1/machineries/machinery-maintenance", [verifyToken], machineryController.createMachineryMaintenance);
  router.post("/v1/machineries/location-history", [verifyToken], machineryController.createMachinerLocationHistory);
  router.patch("/v1/machineries/location-history", [verifyToken], machineryController.updateMachinerLocationHistory);
  router.patch("/v1/machineries", [verifyToken], machineryController.update);
  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/machineries:
 *   get:
 *     tags: [Machineries]
 *     summary: Find machineries
 *     description: Find all machineries 
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
 *         name: idMachineryType
 *         schema:
 *           type: integer
 *         description: ID of the machinery type
 *       - in: query
 *         name: idMachineryBrand
 *         schema:
 *           type: integer
 *         description: ID of the machinery brand
 *       - in: query
 *         name: serial
 *         schema:
 *           type: string
 *         description: Serial of the machinery
 *       - in: query
 *         name: idMachineryStatus
 *         schema:
 *           type: integer
 *         description: ID of the machinery status
 * 
 *     responses:
 *       200:
 *         description: A list of machineries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Machinery'
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
 * /v1/machineries/download:
 *   get:
 *     tags: [Machineries]
 *     summary: Download machineries
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
 * /v1/machineries:
 *   patch:
 *     tags: [Machineries]
 *     summary: Update a machinery
 *     description: Update a machinery
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMachinery'
 *     responses:
 *       200:
 *         description: Machinery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machinery'
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
 * /v1/machineries/machinery-maintenance:
 *   post:
 *     tags: [Machineries]
 *     summary: Create a machinery maintenance
 *     description: Create a machinery maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateMachineryMaintenance'
 *     responses:
 *       201:
 *         description: Machinery maintence created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineryMaintenance'
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
 * /v1/machineries/location-history:
 *   post:
 *     tags: [Machineries]
 *     summary: Create a machinery location history
 *     description: Create a machinery location history
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateMachineryLocationHistory'
 *     responses:
 *       201:
 *         description: Machinery location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineryLocationHistory'
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
 * /v1/machineries/location-history:
 *   patch:
 *     tags: [Machineries]
 *     summary: Update a machinery location history
 *     description: Update a machinery location history
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMachineryLocationHistory'
 *     responses:
 *       201:
 *         description: Machinery location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineryLocationHistory'
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
 * /v1/machineries/types:
 *   get:
 *     tags: [Machineries]
 *     summary: Find machineries types
 *     description: Find all machineries typesj 
 *     responses:
 *       200:
 *         description: A list of machineries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Machinery'
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
 * /v1/machineries/brands:
 *   get:
 *     tags: [Machineries]
 *     summary: Find machineries brands
 *     description: Find all machineries brands
 *     responses:
 *       200:
 *         description: A list of machineries brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MachineryBrand'
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
 * /v1/machineries/models:
 *   get:
 *     tags: [Machineries]
 *     summary: Find machineries models
 *     description: Find all machineries models
 *     responses:
 *       200:
 *         description: A list of machineries models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MachineryModel'
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
 * /v1/machineries/{idMachinery}:
 *   get:
 *     tags: [Machineries]
 *     summary: Find machinery by ID
 *     description: Use to request machinery by ID
 *     parameters:
 *       - in: path
 *         name: idMachinery
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the machinery to obtain
 *     responses:
 *       200:
 *         description: Machinery retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machinery'
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
 * /v1/machineries/{idMachinery}:
 *   delete:
 *     tags: [Machineries]
 *     summary: Delete machinery by ID
 *     description: Use to delete machinery by ID
 *     parameters:
 *       - in: path
 *         name: idMachinery
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the machinery to delete
 *     responses:
 *       204:
 *         description: Machinery deleted
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
 * /v1/machineries/machinery-location/{idMachineryLocationHistory}:
 *   delete:
 *     tags: [Machineries]
 *     summary: Delete machinery location history
 *     description: Use to delete a location
 *     parameters:
 *       - in: path
 *         name: idMachineryLocationHistory
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the machinery location to delete
 *     responses:
 *       204:
 *         description: Machinery location history deleted
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
 * /v1/machineries/machinery-maintenance/{idMachineryMaintenance}:
 *   delete:
 *     tags: [Machineries]
 *     summary: Delete machinery maintenance by ID
 *     description: Use to delete machinery maintenance by ID
 *     parameters:
 *       - in: path
 *         name: idMachineryMaintenance
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the machinery maintenance to delete
 *     responses:
 *       204:
 *         description: Machinery deleted
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
  * /v1/machineries:
  *   post:
  *     tags: [Machineries]
  *     summary: Create a new machinery
  *     description: Create a new machinery
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             $ref: '#/components/schemas/CreateMachinery'
  *     responses:
  *       201:
  *         description: Machinery created successfully
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Machinery'
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
 * components:
 *   schemas:
 *     Machinery:
 *       type: object
 *       properties:
 *         idMachinery:
 *           type: integer
 *         serial:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: string
 *         imageUrl:
 *           type: string
 *         idMachineryModel:
 *           type: integer
 *         idMachineryType:
 *           type: integer
 *         idMachineryBrand:
 *           type: integer
 *         idMachineryStatus:
 *           type: integer
 *     CreateMachinery:
 *       type: object
 *       properties:
 *         serial:
 *           type: string
 *           example: "D4DS-1234"
 *         description:
 *           type: string
 *           example: "Bulldozer"
 *         price:
 *           type: string
 *           example: "100000"
 *         imageProfile:
 *           type: string
 *           format: binary
 *         idMachineryModel:
 *           type: integer
 *         idMachineryType:
 *           type: integer
 *         idMachineryBrand:
 *           type: integer
 *         idMachineryStatus:
 *           type: integer
 *     UpdateMachinery:
 *       type: object
 *       properties:
 *         idMachinery:
 *           type: number
 *           example: 0
 *         serial:
 *           type: string
 *           example: "D4DS-1234"
 *         description:
 *           type: string
 *           example: "Bulldozer"
 *         price:
 *           type: string
 *           example: "100000"
 *         imageProfile:
 *           type: string
 *           format: binary
 *         idMachineryModel:
 *           type: integer
 *         idMachineryType:
 *           type: integer
 *         idMachineryBrand:
 *           type: integer
 *         idMachineryStatus:
 *           type: integer
 *     CreateMachineryMaintenance:
 *       type: object
 *       properties:
 *         idMachinery:
 *           type: number
 *           example: 0
 *         maintenanceDate:
 *           type: string
 *           example: "2022-01-01"
 *         maintenanceEffectiveDate:
 *           type: string
 *           example: "2022-01-01"
 *         document:
 *           type: string
 *           format: binary
 *     CreateMachineryLocationHistory:
 *       type: object
 *       properties:
 *         idMachinery:
 *           type: number
 *           example: 0
 *         idProject:
 *           type: number
 *           example: 0
 *         idEmployee:
 *           type: number
 *           example: 0
 *         assignmentDate:
 *           type: string
 *           example: "2022-01-01"
 *     UpdateMachineryLocationHistory:
 *       type: object
 *       properties:
 *         idMachineryLocationHistory:
 *           type: number
 *           example: 0
 *         idMachinery:
 *           type: number
 *           example: 0
 *         idProject:
 *           type: number
 *           example: 0
 *         idEmployee:
 *           type: number
 *           example: 0
 *         assignmentDate:
 *           type: string
 *           example: "2022-01-01"
 *     MachineryLocationHistory:
 *       type: object
 *       properties:
 *         idMachineryLocationHistory:
 *           type: number
 *           example: 0
 *         idMachinery:
 *           type: number
 *           example: 0
 *         idProject:
 *           type: number
 *           example: 0
 *         idEmployee:
 *           type: number
 *           example: 0
 *         modificationDate:
 *           type: string
 *           example: "2022-01-01"
 *         assignmentDate:
 *           type: string
 *           example: "2022-01-01"
 *     MachineryMaintenance:
 *       type: object
 *       properties:
 *         idMachineryMaintenance:
 *           type: number
 *           example: 0
 *         idMachinery:
 *           type: number
 *           example: 0
 *         maintenanceDate:
 *           type: string
 *           example: "2022-01-01"
 *         maintenanceEffectiveDate:
 *           type: string
 *           example: "2022-01-01"
 *         documentName:
 *           type: string
 *           example: "Maintenance"
 *         documentUrl:
 *           type: string
 *           format: binary
 * 
 *     MachineryModel:
 *       type: object
 *       properties:
 *         idMachineryModel:
 *           type: integer
 *         machineryModel:
 *           type: string
 *     MachineryType:
 *       type: object
 *       properties:
 *         idMachineryType:
 *           type: integer
 *         machineryType:
 *           type: string
 *     MachineryBrand:
 *       type: object
 *       properties:
 *         idMachineryBrand:
 *           type: integer
 *         machineryBrand:
 *           type: string
 *     MachineryStatus:
 *       type: object
 *       properties:
 *         idMachineryStatus:
 *           type: integer
 *         machineryStatus:
 *           type: string
*/