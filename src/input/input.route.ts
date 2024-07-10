import { Application, Router } from "express";
import { verifyToken } from "../middlewares";
import { inputController } from "./input.controller";

export function inputRoutes(app: Application): void {
  const router: Router = Router();

  router.get("/v1/inputs", [verifyToken], inputController.findAll);
  router.get("/v1/inputs/types", [verifyToken], inputController.findInputTypes);
  router.get("/v1/inputs/units-of-measure", [verifyToken], inputController.findUnitOfMeasures);
  router.get("/v1/inputs/:idInput", [verifyToken], inputController.findById);
  router.delete("/v1/inputs/:idInput", [verifyToken], inputController.delete);
  router.post("/v1/input", [verifyToken], inputController.create);
  router.patch("/v1/input", [verifyToken], inputController.update);
  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/inputs:
 *   get:
 *     tags: [Input]
 *     summary: Find inputs
 *     description: Use to request all inputs
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
 *         description: Name of the input
 *     responses:
 *       200:
 *         description: A list of inputs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Input'
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
 * /v1/inputs/{idInput}:
 *   get:
 *     tags: [Input]
 *     summary: Find input by ID
 *     description: Use to request an input by ID
 *     parameters:
 *       - in: path
 *         name: idInput
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the input
 *     responses:
 *       200:
 *         description: Input details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Input'
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
 * /v1/inputs/types:
 *   get:
 *     tags: [Input]
 *     summary: Find input types
 *     description: Use to request all input types
 *     responses:
 *       200:
 *         description: A list of input types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InputType'
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
 * /v1/inputs/units-of-measure:
 *   get:
 *     tags: [Input]
 *     summary: Find input units of measure
 *     description: Use to request all input units of measure
 *     responses:
 *       200:
 *         description: A list of input units of measure
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InputUnitOfMeasure'
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
 * /v1/inputs/{idInput}:
 *   delete:
 *     tags: [Input]
 *     summary: Delete input by ID
 *     description: Use to delete an input by ID
 *     parameters:
 *       - in: path
 *         name: idInput
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the input
 *     responses:
 *       204:
 *         description: No Content - Input deleted successfully
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
 * /v1/input:
 *   post:
 *     tags: [Input]
 *     summary: Create a new input
 *     description: Use to create a new input
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InputCreate'
 *     responses:
 *       201:
 *         description: Created - Input created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Input'
 *       400:
 *         description: Bad Request
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
 * /v1/input:
 *   patch:
 *     tags: [Input]
 *     summary: Update an existing input
 *     description: Use to update an existing input
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InputUpdate'
 *     responses:
 *       200:
 *         description: OK - Input updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Input'
 *       400:
 *         description: Bad Request
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
 *     Input:
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
 *         vat:
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
 *         - vat
 *         - price
 *     InputType:
 *       type: object
 *       properties:
 *         idInputType:
 *           type: integer
 *         inputType:
 *           type: string
 *     InputUnitOfMeasure:
 *       type: object
 *       properties:
 *         idInputUnitOfMeasure:
 *           type: integer
 *         unitOfMeasure:
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
 *         vat:
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
 *         - vat
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
 *         vat:
 *           type: string
 *         price:
 *           type: string
 *       required:
 *         - idInput
 */
