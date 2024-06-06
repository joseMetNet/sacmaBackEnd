import { Application, Router } from "express";
import { authController } from "../controllers";
import { check } from "express-validator";
import { validateEndpoint } from "../controllers/utils";

export function authenticationRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * components:
   *  parameters:
   *    language:
   *      required: false
   *      in: query
   *      name: language
   *      default: en-US
   *      schema:
   *        type: string
   *      description: Language to query
   *    profileId:
   *      required: true
   *      in: query
   *      name: profileId
   *      schema:
   *        type: number
   *      description: Profile to query
   *    userId:
   *      required: true
   *      in: query
   *      name: userId
   *      schema:
   *        type: number
   *      description: Required user
   *    optionalUserId:
   *      required: false
   *      in: query
   *      name: userId
   *      schema:
   *        type: number
   *      description: Required used
   *
   *  responses:
   *    completeSurvey:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/survey'
   *    successResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/messageSchema'
   *    failedResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: FAILED
   *        data:
   *          type: object
   *          properties:
   *            property1:
   *              type: string
   *            property2:
   *              type: string
   *            property3:
   *              type: string
   *            propertyn:
   *              type: string
   *    successProfile:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/profileSchema'
   *
   *  schemas:
   *    updateUserSchema:
   *      type: object
   *      properties:
   *        firstName:
   *          type: string
   *        lastName:
   *          type: string
   *        
   *    survey:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile_id:
   *          type: number
   *        category_id:
   *          type: number
   *        question_number:
   *          type: number
   *        question:
   *          type: string
   *        Profile:
   *          $ref: '#/components/schemas/userProfile'
   *        answerOptions:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/answerOption'
   *        category:
   *          $ref: '#/components/schemas/category'
   *        language:
   *          $ref: '#/components/schemas/language'
   *    userResponse:
   *      type: object
   *      properties:
   *        userId:
   *          type: number
   *        questionId:
   *          type: number
   *        answerOptionId:
   *          type: number
   *        openAnswerText:
   *          type: string
   *    userProfile:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile:
   *          type: string
   *    answerOption:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        question_id:
   *          type: number
   *        answer_option:
   *          type: string
   *    category:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        category:
   *          type: string
   *    language:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        language:
   *          type: string
   *    profileSchema:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile:
   *          type: string
   *        photoUrl:
   *          type: string
   *        videoUrl:
   *          type: string
   *        description:
   *          type: string
   *    messageSchema:
   *      type: object
   *      properties:
   *        message:
   *          type: string
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
   *        idIdentityCardExpeditionPlace:
   *          type: string
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
   *        compensationFund:
   *          type: string
   *          nullable: true
   *        idRequiredDocument:
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
   *        - identityCardExpeditionDate
   *        - idIdentityCardExpeditionPlace
   *        - idRole
   */

  /**
   * @openapi
   *  /v1/auth/register:
   *    post:
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
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
  */
  routes.post(
    "/v1/auth/register",
    [check("firstName", "firstName is required").notEmpty(), validateEndpoint],
    [check("lastName", "lastName is required").notEmpty(), validateEndpoint],
    [check("email", "email is required").notEmpty(), validateEndpoint],
    [check("password", "password is required").notEmpty(), validateEndpoint],
    [check("address", "address is required").notEmpty(), validateEndpoint],
    [check("phoneNumber", "phoneNumber is required").notEmpty(), validateEndpoint],
    [check("idIdentityCard", "idIdentityCard is required").notEmpty(), validateEndpoint],
    [check("identityCardNumber", "identityCardNumber is required").notEmpty(), validateEndpoint],
    [check("identityCardExpeditionDate", "identityCardExpeditionDate is required").notEmpty(), validateEndpoint],
    [check("idIdentityCardExpeditionPlace", "idIdentityCardExpeditionPlace is required").notEmpty(), validateEndpoint],
    [check("idRole", "idRole is required").notEmpty(), validateEndpoint],
    authController.register
  );

  /**
   * @openapi
   *  /v1/auth/login:
   *    post:
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
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
  */
  routes.post(
    "/v1/auth/login",
    [check("email", "email is required").notEmpty(), validateEndpoint],
    [check("password", "password is required").notEmpty(), validateEndpoint],
    authController.login
  );

  app.use("/api/", routes);
}