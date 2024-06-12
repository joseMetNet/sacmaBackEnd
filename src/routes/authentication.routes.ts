import { Application, Router } from "express";
import { authController } from "../controllers";
import { check } from "express-validator";
import { validateEndpoint } from "../controllers/utils";

export function authenticationRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * components:
   *  responses:
   *    successResponse:
   *      description: Successful response
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                example: SUCCESS
   *              data:
   *                type: array
   *                items:
   *                  type: string
   *    failedResponse:
   *      description: Failed response
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                example: FAILED
   *              message:
   *                type: string
   *                example: An internal server error occurred.
   *  schemas:
   *    employee:
   *      type: object
   *      properties:
   *        firstName:
   *          type: string
   *        lastName:
   *          type: string
   *        email:
   *          type: string
   *          format: email
   *        password:
   *          type: string
   *        address:
   *          type: string
   *        phoneNumber:
   *          type: string
   *        idIdentityCard:
   *          type: number
   *        identityCardNumber:
   *          type: string
   *        identityCardExpeditionDate:
   *          type: string
   *          format: date
   *        idIdentityCardExpeditionCity:
   *          type: number
   *        idIdentityCardExpeditionDepartment:
   *          type: number
   *        idRole:
   *          type: number
   *        idPosition:
   *          type: number
   *          nullable: true
   *        idContractType:
   *          type: number
   *          nullable: true
   *        entryDate:
   *          type: string
   *          format: date
   *          nullable: true
   *        baseSalary:
   *          type: string
   *          nullable: true
   *        compensation:
   *          type: string
   *          nullable: true
   *        idPaymentType:
   *          type: number
   *          nullable: true
   *        bankAccountNumber:
   *          type: string
   *          nullable: true
   *        idBankAccount:
   *          type: number
   *          nullable: true
   *        idEps:
   *          type: number
   *          nullable: true
   *        idArl:
   *          type: number
   *          nullable: true
   *        severancePay:
   *          type: string
   *          nullable: true
   *        userName:
   *          type: string
   *          nullable: true
   *        emergencyContactfirstName:
   *          type: string
   *          nullable: true
   *        emergencyContactlastName:
   *          type: string
   *          nullable: true
   *        emergencyContactphoneNumber:
   *          type: string
   *          nullable: true
   *        emergencyContactkinship:
   *          type: string
   *          nullable: true
   *        idPensionFund:
   *          type: number
   *          nullable: true
   *        idCompensationFund:
   *          type: number
   *          nullable: true
   *      required:
   *        - firstName
   *        - lastName
   *        - email
   *        - password
   *        - address
   *        - phoneNumber
   *        - idIdentityCard
   *        - identityCardNumber
   *        - identityCardExpeditionCity
   *        - identityCardExpeditionDepartment
   *        - idRole
   */

  /**
   * @openapi
   *  /v1/auth/register:
   *    post:
   *      security: []
   *      tags: [Authentication Controller]
   *      summary: Register a new user
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/employee'
   *      responses:
   *        '200':
   *          $ref: '#/components/responses/successResponse'
   *        '500':
   *          $ref: '#/components/responses/failedResponse'
   */
  routes.post(
    "/v1/auth/register",
    [
      check("firstName", "firstName is required").notEmpty(),
      validateEndpoint,
      check("lastName", "lastName is required").notEmpty(),
      validateEndpoint,
      check("email", "email is required").notEmpty(),
      validateEndpoint,
      check("password", "password is required").notEmpty(),
      validateEndpoint,
      check("address", "address is required").notEmpty(),
      validateEndpoint,
      check("phoneNumber", "phoneNumber is required").notEmpty(),
      validateEndpoint,
      check("idIdentityCard", "idIdentityCard is required").notEmpty(),
      validateEndpoint,
      check("identityCardNumber", "identityCardNumber is required").notEmpty(),
      validateEndpoint,
      check("identityCardExpeditionDate", "identityCardExpeditionDate is required").notEmpty(),
      validateEndpoint,
      check("idIdentityCardExpeditionCity", "idIdentityCardExpeditionCity is required").notEmpty(),
      validateEndpoint,
      check("idRole", "idRole is required").notEmpty(),
      validateEndpoint,
    ],
    authController.register
  );

  /**
   * @openapi
   *  /v1/auth/login:
   *    post:
   *      security: []
   *      tags: [Authentication Controller]
   *      summary: Login a user
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *      responses:
   *        '200':
   *          $ref: '#/components/responses/successResponse'
   *        '500':
   *          $ref: '#/components/responses/failedResponse'
   */
  routes.post(
    "/v1/auth/login",
    [
      check("email", "email is required").notEmpty(),
      validateEndpoint,
      check("password", "password is required").notEmpty(),
      validateEndpoint,
    ],
    authController.login
  );

  app.use("/api/", routes);
}