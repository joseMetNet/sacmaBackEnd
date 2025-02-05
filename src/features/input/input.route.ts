import { Application, Router } from "express";
import { verifyToken } from "../../middlewares";
import { inputController } from "./input.controller";


export function inputRoutes(app: Application): void {
  const router: Router = Router();
  router.use(verifyToken);

  router.get("/v1/inputs/types", inputController.findInputTypes);
  router.get("/v1/inputs/document-type", inputController.findInputDocumentTypes);
  router.get("/v1/inputs/units-of-measure", inputController.findUnitOfMeasures);
  router.get("/v1/inputs/download", inputController.download);
  router.patch("/v1/input/upload-document", inputController.uploadDocument);
  router.post("/v1/input", inputController.create);
  router.patch("/v1/input", inputController.update);
  router.get("/v1/inputs/:idInput", inputController.findById);
  router.delete("/v1/inputs/:idInput", inputController.delete);
  router.get("/v1/inputs", inputController.findAll);
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
 *       - in: query
 *         name: idSupplier
 *         schema:
 *           type: integer
 *         description: ID of the supplier
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
 * /v1/input/upload-document:
 *   patch:
 *     tags: [Input]
 *     summary: Update an input document
 *     description: Use to update or create an input document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateInputDocument'
 *     responses:
 *       200:
 *         description: Input document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InputDocument'
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
 * /v1/inputs/document-type:
 *   get:
 *     tags: [Input]
 *     summary: Find input document types
 *     description: Use to request all input document types
 *     responses:
 *       200:
 *         description: A list of input document types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InputDocumentType'
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
  * /v1/inputs/download:
  *   get:
  *     tags: [Input]
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
 *     InputDocumentType:
 *       type: object
 *       properties:
 *         idInputDocumentType:
 *           type: integer
 *         inputDocumentType:
 *           type: string
 *     InputType:
 *       type: object
 *       properties:
 *         idInputType:
 *           type: integer
 *         inputType:
 *           type: string
 *     CreateInputDocument:
 *       type: object
 *       properties:
 *         idInput:
 *           type: integer
 *           example: 1
 *         idInputDocumentType:
 *           type: integer
 *           example: 1
 *         document:
 *           type: string
 *           format: binary
 *     InputDocument:
 *       type: object
 *       properties:
 *         idInputDocument:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         idInputDocumentType:
 *           type: integer
 *           example: 1
 *         documentUrl:
 *           type: string
 *           example: "http://localhost:3000/api/v1/inputs/1/document"
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
