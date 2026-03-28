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
  router.get("/v1/reports/expenditure-income-invoice", controller.getReportExpenditureIncomeInvoice.bind(controller));

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
 *       tendencia mensual de novedades y detalle de novedades por empleado.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *       Excepción: si solo se envía idNovelty (sin year ni periodo), consulta todos los años.
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
 *         name: idNovelty
 *         schema:
 *           type: integer
 *         description: "ID del tipo de novedad (TB_Novelty). Sin year ni periodo filtra todos los años."
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
 *                           noveltyCount: { type: integer }
 *                           noveltyLoanValue: { type: number }
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
 *                         totalNovelties: { type: integer }
 *                         totalNoveltyLoanValue: { type: number }
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
 *                     monthlyTrend:
 *                       type: array
 *                       description: "Dataset 5: tendencia mensual de novedades en el rango (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           monthStart: { type: string, format: date }
 *                           year: { type: integer }
 *                           month: { type: integer }
 *                           monthName: { type: string }
 *                           totalNovelties: { type: integer }
 *                           totalNoveltyLoanValue: { type: number }
 *                     noveltyDetails:
 *                       type: array
 *                       description: "Dataset 6: detalle de novedades por empleado"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idEmployeeNovelty: { type: integer }
 *                           idEmployee: { type: integer }
 *                           fullName: { type: string }
 *                           idNovelty: { type: integer }
 *                           novelty: { type: string, nullable: true }
 *                           noveltyDate: { type: string, format: date }
 *                           endAt: { type: string, format: date, nullable: true }
 *                           installment: { type: string, nullable: true }
 *                           loanValue: { type: string, nullable: true }
 *                           observation: { type: string, nullable: true }
 *                           documentUrl: { type: string, nullable: true }
 *                           idPeriodicity: { type: integer, nullable: true }
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

/**
 * @openapi
 * /v1/reports/expenditure-income-invoice:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte integral de egresos, ingresos y facturas
 *     description: >
 *       Ejecuta el SP `SP_ReportExpenditureIncomeInvoice` y devuelve 10 datasets:
 *       movimientos detalle, KPIs de resumen, egresos por tipo, ingresos por estado de factura,
 *       balance por proyecto, tendencia mensual, top 10 proyectos con más gasto,
 *       top 10 proyectos con menos gasto, detalle de facturas con retenciones y
 *       KPIs globales de retenciones.
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
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: "ID del proyecto / centro de costo."
 *       - in: query
 *         name: idExpenditureType
 *         schema:
 *           type: integer
 *         description: "ID del tipo de egreso (TB_ExpenditureType)."
 *       - in: query
 *         name: idInvoiceStatus
 *         schema:
 *           type: integer
 *         description: "ID del estado de factura (TB_InvoiceStatus). Aplica solo a ingresos."
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [ALL, EXPENDITURE, INCOME]
 *         description: "Tipo de movimiento a incluir. Por defecto ALL."
 *       - in: query
 *         name: amountMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto mínimo (inclusive)."
 *       - in: query
 *         name: amountMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto máximo (inclusive)."
 *       - in: query
 *         name: orderNumber
 *         schema:
 *           type: string
 *         description: "Número de orden (búsqueda LIKE)."
 *       - in: query
 *         name: invoiceNumber
 *         schema:
 *           type: string
 *         description: "Número de factura (búsqueda LIKE). Aplica solo a ingresos."
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: "Nombre del cliente (búsqueda LIKE). Aplica solo a ingresos."
 *     responses:
 *       200:
 *         description: Resultado del reporte con 10 datasets
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
 *                     movements:
 *                       type: array
 *                       description: "Dataset 1: detalle de movimientos (egresos e ingresos)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           movementType: { type: string, enum: [EXPENDITURE, INCOME] }
 *                           movementId: { type: integer }
 *                           movementDate: { type: string, format: date }
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           idExpenditureType: { type: integer, nullable: true }
 *                           expenditureType: { type: string, nullable: true }
 *                           idInvoice: { type: integer, nullable: true }
 *                           invoiceNumber: { type: string, nullable: true }
 *                           idInvoiceStatus: { type: integer, nullable: true }
 *                           invoiceStatus: { type: string, nullable: true }
 *                           client: { type: string, nullable: true }
 *                           orderNumber: { type: string, nullable: true }
 *                           description: { type: string, nullable: true }
 *                           amount: { type: number, nullable: true }
 *                           incomeAmount: { type: number }
 *                           expenditureAmount: { type: number }
 *                           fromDate: { type: string, format: date, nullable: true }
 *                           toDate: { type: string, format: date, nullable: true }
 *                           timeDays: { type: integer, nullable: true }
 *                     kpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 2: KPIs generales de resumen"
 *                       properties:
 *                         totalMovements: { type: integer }
 *                         totalExpenditures: { type: integer }
 *                         totalIncomes: { type: integer }
 *                         totalIncomeAmount: { type: number }
 *                         totalExpenditureAmount: { type: number }
 *                         netBalance: { type: number }
 *                         avgExpenditure: { type: number, nullable: true }
 *                         avgIncome: { type: number, nullable: true }
 *                         avgTimeDays: { type: number, nullable: true }
 *                     expendituresByType:
 *                       type: array
 *                       description: "Dataset 3: egresos agrupados por tipo (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idExpenditureType: { type: integer }
 *                           expenditureType: { type: string }
 *                           totalRecords: { type: integer }
 *                           totalExpenditure: { type: number }
 *                     incomesByInvoiceStatus:
 *                       type: array
 *                       description: "Dataset 4: ingresos agrupados por estado de factura (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInvoiceStatus: { type: integer }
 *                           invoiceStatus: { type: string }
 *                           totalRecords: { type: integer }
 *                           totalIncome: { type: number }
 *                     balanceByProject:
 *                       type: array
 *                       description: "Dataset 5: balance por proyecto con sobrecosto y equivalencia presupuestal"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           totalIncome: { type: number }
 *                           totalExpenditure: { type: number }
 *                           projectBalance: { type: number }
 *                           hasOvercost: { type: integer }
 *                           overcostAmount: { type: number }
 *                           plannedBudget: { type: number }
 *                           expenditureVsPlannedPct: { type: number, nullable: true }
 *                           incomeExpenseEquivalence: { type: number, nullable: true }
 *                           avgTimeDays: { type: number, nullable: true }
 *                     monthlyTrend:
 *                       type: array
 *                       description: "Dataset 6: tendencia mensual de ingresos, egresos y balance"
 *                       items:
 *                         type: object
 *                         properties:
 *                           monthStart: { type: string, format: date }
 *                           year: { type: integer }
 *                           month: { type: integer }
 *                           monthName: { type: string }
 *                           totalIncome: { type: number }
 *                           totalExpenditure: { type: number }
 *                           netBalance: { type: number }
 *                     topProjectsMostExpenditure:
 *                       type: array
 *                       description: "Dataset 7: top 10 proyectos con mayor gasto"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           totalExpenditure: { type: number }
 *                     topProjectsLeastExpenditure:
 *                       type: array
 *                       description: "Dataset 8: top 10 proyectos con menor gasto"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           totalExpenditure: { type: number }
 *                     invoiceDeductions:
 *                       type: array
 *                       description: "Dataset 9: detalle de facturas con desglose de retenciones"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInvoice: { type: integer }
 *                           invoiceNumber: { type: string }
 *                           contract: { type: string, nullable: true }
 *                           client: { type: string, nullable: true }
 *                           invoiceValue: { type: number, nullable: true }
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           invoiceStatus: { type: string }
 *                           invoiceCreatedAt: { type: string, format: date-time }
 *                           totalIncomeRecords: { type: integer }
 *                           totalRegisteredAmount: { type: number }
 *                           totalAdvance: { type: number }
 *                           totalReteguarantee: { type: number }
 *                           totalRetesource: { type: number }
 *                           totalReteica: { type: number }
 *                           totalFic: { type: number }
 *                           totalOther: { type: number }
 *                           totalDeductions: { type: number }
 *                           netAmount: { type: number }
 *                           deductionsPct: { type: number, nullable: true }
 *                     retentionKpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 10: KPIs globales de retenciones y neto facturado"
 *                       properties:
 *                         reportStartDate: { type: string, format: date }
 *                         reportEndDate: { type: string, format: date }
 *                         totalInvoicesWithIncome: { type: integer }
 *                         totalGrossIncome: { type: number }
 *                         totalAdvance: { type: number }
 *                         totalReteguarantee: { type: number }
 *                         totalRetesource: { type: number }
 *                         totalReteica: { type: number }
 *                         totalFic: { type: number }
 *                         totalOther: { type: number }
 *                         totalDeductions: { type: number }
 *                         totalNetIncome: { type: number }
 *                         deductionsPct: { type: number, nullable: true }
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
