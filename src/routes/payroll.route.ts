import { Application, Router } from "express";
import { employeePayrollController } from "../controllers";
import { verifyToken } from "../middlewares";

export function employeePayrollRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * /v1/payroll/find-all:
   *   get:
   *     tags: [Payroll]
   *     summary: Get all payrolls
   *     parameters:
   *       - $ref: "#/components/parameters/idEmployeeQuery"
   *       - $ref: "#/components/parameters/page"
   *       - $ref: "#/components/parameters/pageSize"
   *       - $ref: "#/components/parameters/year"
   *       - $ref: "#/components/parameters/month"
   *     responses:
   *       200:
   *         description: A list of payrolls
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/payroll'
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
  routes.get(
    "/v1/payroll/find-all", 
    verifyToken,
    employeePayrollController.findAll
  );

  /**
   * @openapi
   * /v1/payroll:
   *   patch:
   *     tags: [Payroll]
   *     summary: Update employee payroll by id
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/uploadPayroll'
   *     responses:
   *       '201':
   *         description: Successful updated payroll
   *       '400':
   *         description: Bad request
   *       '404':
   *         description: Not found
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.patch(
    "/v1/payroll",
    [verifyToken],
    employeePayrollController.updateById
  );

  /**
   * @openapi
   * /v1/payroll:
   *   post:
   *     tags: [Payroll]
   *     summary: Upload payroll for employee
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/uploadPayroll'
   *     responses:
   *       '201':
   *         description: Successful uploaded payroll
   *       '400':
   *         description: Bad request
   *       '404':
   *         description: Not found
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/failedResponse"
   */
  routes.post(
    "/v1/payroll",
    [verifyToken],
    employeePayrollController.uploadPayroll
  );

  /**
   * @openapi
   * /v1/payroll/{idEmployeePayroll}:
   *   get:
   *     tags: [Payroll]
   *     summary: Find employee payroll by id
   *     parameters:
   *       - $ref: '#/components/parameters/idEmployeePayroll'
   *     responses:
   *       200:
   *         description: An employee payroll object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/payroll'
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
  routes.get(
    "/v1/payroll/:idEmployeePayroll", 
    [verifyToken], 
    employeePayrollController.findById
  );

  /**
   * @openapi
   * /v1/payroll/{idEmployeePayroll}:
   *   delete:
   *     tags: [Payroll]
   *     summary: Delete employee payroll by id
   *     parameters:
   *       - $ref: "#/components/parameters/idEmployeePayroll"
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
    "/v1/payroll/:idEmployeePayroll",
    [verifyToken],
    employeePayrollController.deleteById
  );


  /**
   * @openapi
   * components:
   *   parameters:
   *     idEmployeePayroll:
   *       in: path
   *       name: idEmployeePayroll
   *       schema:
   *         type: integer
   *       description: Employee payroll id
   *       required: false
   *       default: 1
   *     idEmployeeQuery:
   *       in: query
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
   *     year:
   *       in: query
   *       name: year
   *       schema:
   *         type: integer
   *       description: Year to filter
   *       required: false
   *     month:
   *       in: query
   *       name: month
   *       schema:
   *         type: integer
   *       description: Month to filter
   *       required: false
   *   schemas:
   *     uploadDocument:
   *       type: object
   *       properties:
   *         document:
   *           type: string
   *           format: binary
   *         idEmployee:
   *           type: integer
   *           example: 1
   *         idRequiredDocument:
   *           type: integer
   *           example: 1
   *         expirationDate:
   *           type: string
   *           format: date
   *           example: "2022-01-01"
   *     uploadPayroll:
   *       type: object
   *       properties:
   *         idEmployee:
   *           type: number
   *           example: 4
   *         paymentDate:
   *           type: string
   *           format: date
   *         document:
   *           type: string
   *           format: binary
   *     updatePayroll:
   *       type: object
   *       properties:
   *         idEmployeePayroll:
   *           type: number
   *           example: 34
   *         paymentDate:
   *           type: string
   *           format: date
   *         document:
   *           type: string
   *           format: binary
   *     payroll:
   *       type: object
   *       properties:
   *         idEmployeePayroll:
   *           type: number
   *           example: 9
   *         idEmployee:
   *           type: number
   *           example: 4
   *         paymentDate:
   *           type: string
   *           format: date
   *         documentUrl:
   *           type: string
   *           format: binary
   * 
   */

  app.use("/api/", routes);
}