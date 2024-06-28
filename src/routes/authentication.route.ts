import { Application, Router } from "express";
import { authController } from "../controllers";
import { check } from "express-validator";
import { validateEndpoint } from "../controllers/utils";
import { verifyAuthRequest, verifyRefreshToken } from "../middlewares";

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
   *    notFoundResponse:
   *      description: Not found response
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                example: FAILED
   *              data:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Not found.
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
   *              data:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: An internal server error occurred.
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
   *        idRole:
   *          type: number
   *        imageProfile:
   *          type: string
   *          format: binary
   *        idPosition:
   *          type: number
   *          nullable: true
   *        idContractType:
   *          type: number
   *          nullable: true
   *        birthDate:
   *          type: string
   *          format: date
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
   *        idSeverancePay:
   *          type: number
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
   *        - userName
   *        - address
   *        - phoneNumber
   *        - idIdentityCard
   *        - identityCardNumber
   *        - identityCardExpeditionDate
   *        - idIdentityCardExpeditionCity
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
   *          multipart/form-data:
   *            schema:
   *              $ref: '#/components/schemas/employee'
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
      check("lastName", "lastName is required").notEmpty(),
      check("email", "email is required").notEmpty(),
      check("userName", "userName is required").notEmpty(),
      check("address", "address is required").notEmpty(),
      check("phoneNumber", "phoneNumber is required").notEmpty(),
      check("idIdentityCard", "idIdentityCard is required").notEmpty(),
      check("identityCardNumber", "identityCardNumber is required").notEmpty(),
      check(
        "identityCardExpeditionDate",
        "identityCardExpeditionDate is required"
      ).notEmpty(),
      check(
        "idIdentityCardExpeditionCity",
        "idIdentityCardExpeditionCity is required"
      ).notEmpty(),
      check("idRole", "idRole is required").notEmpty(),
      validateEndpoint,
      verifyAuthRequest
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
   *        '404':
   *          $ref: '#/components/responses/notFoundResponse'
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

  /**
   * @openapi
   *  /v1/auth/logout:
   *    post:
   *      security: []
   *      tags: [Authentication Controller]
   *      summary: Logout
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                refreshToken:
   *                  type: string
   *      responses:
   *        '200':
   *          $ref: '#/components/responses/successResponse'
   *        '401':
   *          $ref: '#/components/responses/failedResponse'
   */
  routes.post(
    "/v1/auth/logout",
    [
      check("refreshToken", "refreshToken is required").notEmpty(),
      verifyRefreshToken,
    ],
    authController.revokeRefreshToken
  );

  /**
   * @openapi
   *  /v1/auth/refresh-token:
   *    post:
   *      security: []
   *      tags: [Authentication Controller]
   *      summary: Refresh token
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                refreshToken:
   *                  type: string
   *      responses:
   *        '200':
   *          $ref: '#/components/responses/successResponse'
   *        '401':
   *          $ref: '#/components/responses/failedResponse'
   */
  routes.post(
    "/v1/auth/refresh-token",
    [
      check("refreshToken", "refreshToken is required").notEmpty(),
      verifyRefreshToken,
    ],
    authController.createRefreshToken
  );

  app.use("/api/", routes);
}
