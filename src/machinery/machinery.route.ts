import { Application, Router } from "express";
import { verifyToken } from "../middlewares";
import { machineryController } from "./machinery.controller";

export function machineryRoutes(app: Application): void {
  const router: Router = Router();

  router.get("/v1/machineries", [verifyToken], machineryController.findAll);
  router.get("/v1/machineries/types", [verifyToken], machineryController.findMachineryType);
  router.get("/v1/machineries/models", [verifyToken], machineryController.findMachineryModel);
  router.get("/v1/machineries/brands", [verifyToken], machineryController.findMachineryBrand);
  router.get("/v1/machineries/:idMachinery", [verifyToken], machineryController.findById);
  router.delete("/v1/machineries/:idMachinery", [verifyToken], machineryController.delete); // Confirm this is correct
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the machinery
 *       - in: query
 *         name: idSupplier
 *         schema:
 *           type: integer
 *         description: ID of the supplier
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
 *         status:
 *           type: boolean
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
 *     InputCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         idInputType:
 *           type: integer
 *         code:
 *           type: string
 *         idInputUnitOfMeasure:
 *           type: string
 *         cost:
 *           type: string
 *         idSupplier:
 *           type: integer
 *         performance:
 *           type: string
 *         price:
 *           type: string
 *       required:
 *         - name
 *         - idInputType
 *         - code
 *         - idInputUnitOfMeasure
 *         - cost
 *         - idSupplier
 *         - performance
 *         - price
 *     InputUpdate:
 *       type: object
 *       properties:
 *         idInput:
 *           type: integer
 *         name:
 *           type: string
 *         idInputType:
 *           type: integer
 *         code:
 *           type: string
 *         idInputUnitOfMeasure:
 *           type: string
 *         cost:
 *           type: string
 *         idSupplier:
 *           type: integer
 *         performance:
 *           type: string
 *         price:
 *           type: string
 *       required:
 *         - idInput
*/