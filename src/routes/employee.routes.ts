import { Application, Router } from "express";
import { employeeController } from "../controllers";
import { verifyToken } from "../middlewares";

export function employeeRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * /v1/employee/city:
   *   get:
   *     tags: [Employee]
   *     summary: Find cities
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/city",
    [verifyToken],
    employeeController.findCities
  );

  /**
   * @openapi
   * /v1/employee/eps:
   *   get:
   *     tags: [Employee]
   *     summary: Find EPS
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */

  routes.get("/v1/employee/eps", [verifyToken], employeeController.findEps);

  /**
   * @openapi
   * /v1/employee/role:
   *   get:
   *     tags: [Employee]
   *     summary: Find roles
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get("/v1/employee/role", [verifyToken], employeeController.findRoles);

  /**
   * @openapi
   * /v1/employee/state:
   *   get:
   *     tags: [Employee]
   *     summary: Find state
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get("/v1/employee/state", [verifyToken], employeeController.findState);

  /**
   * @openapi
   * /v1/employee/arl:
   *   get:
   *     tags: [Employee]
   *     summary: Find ARls
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get("/v1/employee/arl", [verifyToken], employeeController.findArls);

  /**
   * @openapi
   * /v1/employee/contract-type:
   *   get:
   *     tags: [Employee]
   *     summary: Find contract types
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/contract-type",
    [verifyToken],
    employeeController.findContractTypes
  );

  /**
   * @openapi
   * /v1/employee/bank:
   *   get:
   *     tags: [Employee]
   *     summary: Find banks
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idBankAccount:
   *                         type: integer
   *                       bankAccount:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get("/v1/employee/bank", [verifyToken], employeeController.findBanks);

  /**
   * @openapi
   * /v1/employee/payment-method:
   *   get:
   *     tags: [Employee]
   *     summary: Find payment methods
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idPaymentType:
   *                         type: integer
   *                       paymentType:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/payment-method",
    [verifyToken],
    employeeController.findPaymentMethods
  );

  /**
   * @openapi
   * /v1/employee/compensation-fund:
   *   get:
   *     tags: [Employee]
   *     summary: Find compensation funds
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idCompensationFund:
   *                         type: integer
   *                       compensationFund:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */

  routes.get(
    "/v1/employee/compensation-fund",
    [verifyToken],
    employeeController.findCompensationFunds
  );

  /**
   * @openapi
   * /v1/employee/identification-type:
   *   get:
   *     tags: [Employee]
   *     summary: Find identification types
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idIdentityCard:
   *                         type: integer
   *                       identityCard:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/identification-type",
    [verifyToken],
    employeeController.findIdentificationTypes
  );

  /**
   * @openapi
   * /v1/employee/position:
   *   get:
   *     tags: [Employee]
   *     summary: Find positions
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idPosition:
   *                         type: integer
   *                       position:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/position",
    [verifyToken],
    employeeController.findPositions
  );

  /**
   * @openapi
   * /v1/employee/required-document:
   *   get:
   *     tags: [Employee]
   *     summary: Find required documents for employees
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idRequiredDocument:
   *                         type: integer
   *                       requiredDocument:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/required-document",
    [verifyToken],
    employeeController.findRequiredDocuments
  );

  /**
   * @openapi
   * /v1/employee:
   *   get:
   *     tags: [Employee]
   *     summary: Find employees
   *     parameters:
   *       - $ref: "#/components/parameters/page"
   *       - $ref: "#/components/parameters/pageSize"
   *       - $ref: "#/components/parameters/firstName"
   *       - $ref: "#/components/parameters/identityCardNumber"
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       firstName:
   *                         type: string
   *                       lastName:
   *                         type: string
   *                       identityCardNumber:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get("/v1/employee", [verifyToken], employeeController.findEmployee);

  /**
   * @openapi
   * /v1/employee:
   *   patch:
   *     tags: [Employee]
   *     summary: Update employee
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateEmployee'
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     email:
   *                       type: string
   *                     phoneNumber:
   *                       type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.patch(
    "/v1/employee",
    [verifyToken],
    employeeController.updateEmployee
  );


  /**
   * @openapi
   * /v1/employee/{idEmployee}:
   *   delete:
   *     tags: [Employee]
   *     summary: Delete employee
   *     parameters:
   *       - $ref: "#/components/parameters/idEmployee"
   *     responses:
   *       '200':
   *         description: Successful deleted
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.delete(
    "/v1/employee/:idEmployee",
    [verifyToken],
    employeeController.deleteEmployee
  );

  /**
   * @openapi
   * /v1/employee/basic-info:
   *   get:
   *     tags: [Employee]
   *     summary: Find all employees and their roles
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       firstName:
   *                         type: string
   *                       lastName:
   *                         type: string
   *                       role:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee/basic-info",
    [verifyToken],
    employeeController.findEmployeeAndRoles
  );

  /**
   * @openapi
   * /v1/employee:
   *   get:
   *     tags: [Employee]
   *     summary: Find employee by id
   *     parameters:
   *       - $ref: "#/components/parameters/idEmployee"
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: SUCCESS
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       idRequiredDocument:
   *                         type: integer
   *                       requiredDocument:
   *                         type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.get(
    "/v1/employee",
    [verifyToken],
    employeeController.findEmployeeById
  );


  /**
   * @openapi
   * components:
   *   parameters:
   *     idEmployee:
   *       in: path
   *       name: idEmployee
   *       schema:
   *         type: integer
   *       description: Employee id
   *       required: false
   *       default: 1
   *     page:
   *       in: query
   *       name: page
   *       schema:
   *         type: integer
   *       description: Page number
   *       required: false
   *       default: 1
   *     pageSize:
   *       in: query
   *       name: pageSize
   *       schema:
   *         type: integer
   *       description: Page size
   *       required: false
   *     firstName:
   *       in: query
   *       name: firstName
   *       schema:
   *         type: string
   *       description: Name to filter
   *       required: false
   *     identityCardNumber:
   *       in: query
   *       name: identityCardNumber
   *       schema:
   *         type: string
   *       description: Identity card number to filter
   *       required: false
   *   schemas:
   *     failedResponse:
   *       type: object
   *       properties:
   *         status:
   *           type: string
   *           example: FAILED
   *         message:
   *           type: string
   *           example: An internal server error occurred.
   * 
   *     UpdateEmployee:
   *       type: object
   *       properties:
   *         idUser:
   *           type: integer
   *           example: 1
   *         firstName:
   *           type: string
   *           example: John
   *         lastName:
   *           type: string
   *           example: Doe
   *         email:
   *           type: string
   *           example: john.doe@example.com
   *         password:
   *           type: string
   *           example: P@ssw0rd
   *         address:
   *           type: string
   *           example: 123 Main St
   *         phoneNumber:
   *           type: string
   *           example: "+1234567890"
   *         idIdentityCard:
   *           type: integer
   *           example: 123456
   *         identityCardNumber:
   *           type: string
   *           example: ID123456
   *         identityCardExpeditionDate:
   *           type: string
   *           format: date
   *           example: "2022-01-01"
   *         idIdentityCardExpeditionCity:
   *           type: integer
   *           example: 101
   *         idRole:
   *           type: integer
   *           example: 2
   *         idPosition:
   *           type: integer
   *           example: 3
   *         idContractType:
   *           type: integer
   *           example: 1
   *         entryDate:
   *           type: string
   *           format: date
   *           example: "2023-05-01"
   *         baseSalary:
   *           type: string
   *           example: "50000"
   *         compensation:
   *           type: string
   *           example: "10000"
   *         idPaymentType:
   *           type: integer
   *           example: 1
   *         bankAccountNumber:
   *           type: string
   *           example: "123456789"
   *         idBankAccount:
   *           type: integer
   *           example: 1
   *         idEps:
   *           type: integer
   *           example: 1
   *         idArl:
   *           type: integer
   *           example: 1
   *         severancePay:
   *           type: string
   *           example: "5000"
   *         userName:
   *           type: string
   *           example: jdoe
   *         emergencyContactfirstName:
   *           type: string
   *           example: Jane
   *         emergencyContactlastName:
   *           type: string
   *           example: Doe
   *         emergencyContactphoneNumber:
   *           type: string
   *           example: "+1234567890"
   *         emergencyContactkinship:
   *           type: string
   *           example: Sister
   *         idPensionFund:
   *           type: integer
   *           example: 1
   *         idCompensationFund:
   *           type: string
   *           example: "1"
   *         idRequiredDocument:
   *           type: integer
   *           example: 1
   *       required:
   *         - idUser
   */

  app.use("/api/", routes);
}