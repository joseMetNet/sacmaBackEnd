import { Application, Router } from "express";
import { ReportsRepository } from "./reports.repository";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";

export function reportsRoutes(app: Application): void {
  const router: Router = Router();
  const repository = new ReportsRepository();
  const service = new ReportsService(repository);
  const controller = new ReportsController(service);

  // GET routes
  router.get("/v1/reports/employees", controller.getReportEmployees.bind(controller));

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/reports/employees:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de empleados
 *     description: >
 *       Ejecuta el SP `SP_ReportEmployees` y devuelve 6 datasets: detalle de empleados,
 *       KPIs de resumen, novedades por tipo, empleados por tipo de contrato,
 *       horas trabajadas por proyecto y tendencia mensual.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Año del reporte. Si no se indica se usa el año actual."
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: "Mes (1-12). Exclusivo con bimester, semester y dateFrom/dateTo."
 *       - in: query
 *         name: bimester
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 6
 *         description: "Bimestre (1-6). Exclusivo con month, semester y dateFrom/dateTo."
 *       - in: query
 *         name: semester
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2
 *         description: "Semestre (1-2). Exclusivo con month, bimester y dateFrom/dateTo."
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: "Fecha inicial del rango (YYYY-MM-DD). Exclusivo con month, bimester y semester."
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: "Fecha final del rango (YYYY-MM-DD). Exclusivo con month, bimester y semester."
 *       - in: query
 *         name: idEmployee
 *         schema:
 *           type: integer
 *         description: "ID del empleado para filtrar un empleado específico."
 *       - in: query
 *         name: employeeStatus
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: "Estado del empleado: 1 = Activo, 0 = Inactivo."
 *       - in: query
 *         name: idContractType
 *         schema:
 *           type: integer
 *         description: "ID del tipo de contrato."
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: "ID del centro de costo / proyecto."
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Salario base mínimo (inclusive)."
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Salario base máximo (inclusive)."
 *       - in: query
 *         name: idPosition
 *         schema:
 *           type: integer
 *         description: "ID del cargo (TB_Position)."
 *       - in: query
 *         name: idRole
 *         schema:
 *           type: integer
 *         description: "ID del rol (TB_Role)."
 *     responses:
 *       200:
 *         description: Resultado del reporte de empleados con 6 datasets
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
 *                     employees:
 *                       type: array
 *                       description: "Dataset 1: detalle por empleado"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           idEmployee: { type: integer }
 *                           fullName: { type: string }
 *                           identityCardNumber: { type: string }
 *                           email: { type: string }
 *                           phoneNumber: { type: string }
 *                           employeeStatus: { type: boolean }
 *                           employeeStatusName: { type: string }
 *                           entryDate: { type: string, format: date, nullable: true }
 *                           baseSalaryValue: { type: number }
 *                           compensationValue: { type: number }
 *                           totalCompensation: { type: number }
 *                           contractType: { type: string, nullable: true }
 *                           position: { type: string, nullable: true }
 *                           totalHoursWorked: { type: number }
 *                           totalOvertimeHours: { type: number }
 *                           noveltyCount: { type: integer }
 *                           noveltyLoanValue: { type: number }
 *                           projectCount: { type: integer }
 *                           projectList: { type: string }
 *                     kpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 2: KPIs generales de resumen"
 *                       properties:
 *                         totalEmployees: { type: integer }
 *                         totalActiveEmployees: { type: integer }
 *                         totalInactiveEmployees: { type: integer }
 *                         totalBaseSalary: { type: number }
 *                         totalCompensation: { type: number }
 *                         averageBaseSalary: { type: number }
 *                         totalHoursWorked: { type: number }
 *                         totalOvertimeHours: { type: number }
 *                         totalNovelties: { type: integer }
 *                         totalNoveltyLoanValue: { type: number }
 *                         totalProjectsAssignments: { type: integer }
 *                     noveltiesByType:
 *                       type: array
 *                       description: "Dataset 3: novedades por tipo (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idNovelty: { type: integer }
 *                           novelty: { type: string }
 *                           noveltyCount: { type: integer }
 *                           noveltyLoanValue: { type: number }
 *                     employeesByContractType:
 *                       type: array
 *                       description: "Dataset 4: empleados por tipo de contrato (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idContractType: { type: integer }
 *                           contractType: { type: string }
 *                           totalEmployees: { type: integer }
 *                     hoursPerProject:
 *                       type: array
 *                       description: "Dataset 5: horas trabajadas por proyecto (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer }
 *                           projectName: { type: string }
 *                           totalHoursWorked: { type: number }
 *                           totalOvertimeHours: { type: number }
 *                           totalEmployees: { type: integer }
 *                     monthlyTrend:
 *                       type: array
 *                       description: "Dataset 6: tendencia mensual en el rango (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           monthStart: { type: string, format: date }
 *                           year: { type: integer }
 *                           month: { type: integer }
 *                           monthName: { type: string }
 *                           totalHoursWorked: { type: number }
 *                           totalOvertimeHours: { type: number }
 *                           totalNovelties: { type: integer }
 *                           totalNoveltyLoanValue: { type: number }
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
 */
