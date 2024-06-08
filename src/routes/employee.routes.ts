import { Application, Router } from "express";
import { employeeController } from "../controllers";
import { verifyToken } from "../middlewares";

export function employeeRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * components:
   *   parameters:
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
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: FAILED
   *                 message:
   *                   type: string
   *                   example: An internal server error occurred.
   */
  routes.get(
    "/v1/employee/basic-info",
    [
      verifyToken,
    ],
    employeeController.findEmployeeAndRoles
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
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: FAILED
   *                 message:
   *                   type: string
   *                   example: An internal server error occurred.
   */
  routes.get(
    "/v1/employee",
    [
      verifyToken,
    ],
    employeeController.findEmployee
  );

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
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: FAILED
   *                 message:
   *                   type: string
   *                   example: An internal server error occurred.
   */
  routes.patch(
    "/v1/employee",[
      verifyToken,
    ],
    employeeController.updateEmployee
  );

  app.use("/api/", routes);
}