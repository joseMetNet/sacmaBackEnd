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
  router.get("/v1/reports/cost-center-analytics", controller.getReportCostCenterAnalytics.bind(controller));
  router.get("/v1/reports/revenue-centers", controller.getRevenueCentersCatalog.bind(controller));
  router.get("/v1/reports/quotations", controller.getReportQuotations.bind(controller));
  router.get("/v1/reports/inventory-warehouse-movement", controller.getReportInventoryWarehouseMovement.bind(controller));
  router.get("/v1/reports/purchasing-supply", controller.getReportPurchasingSupply.bind(controller));
  router.get("/v1/reports/suppliers", controller.getReportSuppliers.bind(controller));

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
 * /v1/reports/suppliers:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de proveedores
 *     description: >
 *       Ejecuta el SP `SP_ReportSuppliers` y devuelve 4 datasets:
 *       (1) desempeño por proveedor, (2) contactos, (3) KPIs globales, (4) ranking de proveedores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: Año (modo anual)
 *       - in: query
 *         name: month
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *         description: Mes (modo mensual)
 *       - in: query
 *         name: bimester
 *         schema: { type: integer, minimum: 1, maximum: 6 }
 *         description: Bimestre (1-6)
 *       - in: query
 *         name: semester
 *         schema: { type: integer, minimum: 1, maximum: 2 }
 *         description: Semestre (1-2)
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *         description: Fecha inicio (modo rango libre)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *         description: Fecha fin (modo rango libre)
 *       - in: query
 *         name: idSupplier
 *         schema: { type: integer }
 *         description: ID del proveedor
 *       - in: query
 *         name: supplierStatus
 *         schema: { type: integer, enum: [0, 1] }
 *         description: Estado del proveedor (0=inactivo, 1=activo)
 *       - in: query
 *         name: idCity
 *         schema: { type: integer }
 *         description: ID de la ciudad
 *       - in: query
 *         name: idState
 *         schema: { type: integer }
 *         description: ID del departamento/estado
 *       - in: query
 *         name: searchText
 *         schema: { type: string, maxLength: 128 }
 *         description: Texto libre de búsqueda
 *       - in: query
 *         name: amountMin
 *         schema: { type: number }
 *         description: Monto mínimo
 *       - in: query
 *         name: amountMax
 *         schema: { type: number }
 *         description: Monto máximo
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     suppliers:
 *                       type: array
 *                       description: "Dataset 1: desempeño por proveedor"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string }
 *                           reportEndDate: { type: string }
 *                           idSupplier: { type: integer }
 *                           socialReason: { type: string }
 *                           nit: { type: string }
 *                           status: { type: boolean }
 *                           totalRequests: { type: integer }
 *                           totalRequestDetails: { type: integer }
 *                           totalQuantity: { type: number }
 *                           totalAmount: { type: number }
 *                           firstPurchaseDate: { type: string }
 *                           lastPurchaseDate: { type: string }
 *                     contacts:
 *                       type: array
 *                       description: "Dataset 2: contactos de proveedores"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idSupplierContact: { type: integer }
 *                           idSupplier: { type: integer }
 *                           socialReason: { type: string }
 *                           name: { type: string }
 *                           phoneNumber: { type: string }
 *                           email: { type: string }
 *                           position: { type: string }
 *                     kpis:
 *                       type: object
 *                       description: "Dataset 3: KPIs globales del reporte"
 *                       nullable: true
 *                       properties:
 *                         reportStartDate: { type: string }
 *                         reportEndDate: { type: string }
 *                         totalSuppliers: { type: integer }
 *                         totalActiveSuppliers: { type: integer }
 *                         totalInactiveSuppliers: { type: integer }
 *                         totalRequests: { type: integer }
 *                         totalRequestDetails: { type: integer }
 *                         totalQuantity: { type: number }
 *                         totalAmount: { type: number }
 *                         averageAmountBySupplier: { type: number }
 *                     ranking:
 *                       type: array
 *                       description: "Dataset 4: ranking de proveedores"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idSupplier: { type: integer }
 *                           socialReason: { type: string }
 *                           totalRequests: { type: integer }
 *                           totalQuantity: { type: number }
 *                           totalAmount: { type: number }
 *                           supplierRank: { type: integer }
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
 * /v1/reports/quotations:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de cotizaciones
 *     description: >
 *       Ejecuta el SP `SP_ReportQuotations` y devuelve 6 datasets:
 *       tabla principal de cotizaciones, KPIs generales, cotizaciones por estado,
 *       porcentajes por cotizacion, comentarios y items con su detalle.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Año del reporte. Si no se envía, el SP usa el año actual."
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
 *         name: idQuotation
 *         schema:
 *           type: integer
 *         description: "ID de la cotizacion."
 *       - in: query
 *         name: idQuotationStatus
 *         schema:
 *           type: integer
 *         description: "ID del estado de la cotizacion (TB_QuotationStatus)."
 *       - in: query
 *         name: idResponsable
 *         schema:
 *           type: integer
 *         description: "ID del responsable de la cotizacion."
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: "ID del insumo para filtrar detalle de items."
 *       - in: query
 *         name: amountMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto cotizado mínimo (inclusive)."
 *       - in: query
 *         name: amountMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto cotizado máximo (inclusive)."
 *     responses:
 *       200:
 *         description: Resultado del reporte de cotizaciones con 6 datasets
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
 *                     quotations:
 *                       type: array
 *                       description: "Dataset 1: tabla principal de cotizaciones"
 *                       items:
 *                         type: object
 *                     kpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 2: KPIs generales"
 *                     quotationsByStatus:
 *                       type: array
 *                       description: "Dataset 3: cotizaciones agrupadas por estado"
 *                       items:
 *                         type: object
 *                     quotationPercentages:
 *                       type: array
 *                       description: "Dataset 4: porcentajes por cotizacion"
 *                       items:
 *                         type: object
 *                     quotationComments:
 *                       type: array
 *                       description: "Dataset 5: comentarios de cotizacion"
 *                       items:
 *                         type: object
 *                     quotationItemsDetail:
 *                       type: array
 *                       description: "Dataset 6: items y detalle de insumos por cotizacion"
 *                       items:
 *                         type: object
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
 * /v1/reports/inventory-warehouse-movement:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de inventario y movimientos de bodega
 *     description: >
 *       Ejecuta el SP `SP_ReportInventoryWarehouseMovement` y devuelve 5 datasets:
 *       stock actual por bodega e insumo, trazabilidad detallada de movimientos,
 *       KPIs generales de movimiento, resumen por bodega y motivos de retorno.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *       El filtro de periodo aplica a los movimientos; el stock siempre refleja el estado actual filtrado por bodega/insumo/stock.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Año del reporte. Si no se envía, el SP usa el año actual."
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
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: "ID de la bodega (TB_WareHouse). Filtra stock y movimientos."
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: "ID del insumo (TB_Input). Filtra stock y movimientos."
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: "ID del proyecto / centro de costo. Solo aplica a movimientos."
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [ALL, ENTRADA, SALIDA, RETORNO]
 *         description: "Tipo de movimiento a incluir. Por defecto ALL."
 *       - in: query
 *         name: idReturnReason
 *         schema:
 *           type: integer
 *         description: "ID del motivo de retorno (TB_ReturnReason). Solo aplica a movimientos RETORNO."
 *       - in: query
 *         name: stockMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Stock mínimo disponible (inclusive). Aplica al dataset de stock."
 *       - in: query
 *         name: stockMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Stock máximo disponible (inclusive). Aplica al dataset de stock."
 *     responses:
 *       200:
 *         description: Resultado del reporte con 5 datasets
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
 *                     stock:
 *                       type: array
 *                       description: "Dataset 1: stock actual por bodega e insumo"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           idInventory: { type: integer }
 *                           idWarehouse: { type: integer }
 *                           warehouseName: { type: string, nullable: true }
 *                           idInput: { type: integer }
 *                           inputName: { type: string, nullable: true }
 *                           quantityAvailable: { type: number }
 *                           quantityReserved: { type: number }
 *                           quantityTotal: { type: number }
 *                           averageCost: { type: number, nullable: true }
 *                           lastMovementDate: { type: string, format: date, nullable: true }
 *                           updatedAt: { type: string }
 *                     movements:
 *                       type: array
 *                       description: "Dataset 2: trazabilidad detallada de movimientos"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           idInventoryMovement: { type: integer }
 *                           idInventory: { type: integer, nullable: true }
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string, nullable: true }
 *                           idInput: { type: integer, nullable: true }
 *                           inputName: { type: string, nullable: true }
 *                           idWarehouse: { type: integer, nullable: true }
 *                           warehouseName: { type: string, nullable: true }
 *                           movementType: { type: string }
 *                           quantity: { type: number, nullable: true }
 *                           unitPrice: { type: number, nullable: true }
 *                           totalPrice: { type: number, nullable: true }
 *                           stockBefore: { type: number, nullable: true }
 *                           stockAfter: { type: number, nullable: true }
 *                           remarks: { type: string, nullable: true }
 *                           documentReference: { type: string, nullable: true }
 *                           movementDate: { type: string, format: date }
 *                           idReturnReason: { type: integer, nullable: true }
 *                           reasonCode: { type: string, nullable: true }
 *                           reasonName: { type: string, nullable: true }
 *                     kpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 3: KPIs generales de movimiento"
 *                       properties:
 *                         reportStartDate: { type: string, format: date }
 *                         reportEndDate: { type: string, format: date }
 *                         totalMovements: { type: integer }
 *                         totalEntriesQty: { type: number }
 *                         totalExitsQty: { type: number }
 *                         totalReturnsQty: { type: number }
 *                         totalEntriesAmount: { type: number }
 *                         totalExitsAmount: { type: number }
 *                         totalReturnsAmount: { type: number }
 *                     movementsByWarehouse:
 *                       type: array
 *                       description: "Dataset 4: resumen de movimientos agrupados por bodega"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idWarehouse: { type: integer, nullable: true }
 *                           warehouseName: { type: string }
 *                           movements: { type: integer }
 *                           totalQty: { type: number }
 *                           totalAmount: { type: number }
 *                     returnReasons:
 *                       type: array
 *                       description: "Dataset 5: motivos de retorno con cantidades y montos"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idReturnReason: { type: integer }
 *                           reasonCode: { type: string }
 *                           reasonName: { type: string }
 *                           totalReturns: { type: integer }
 *                           totalReturnedQty: { type: number }
 *                           totalReturnedAmount: { type: number }
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
 * /v1/reports/purchasing-supply:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de compras y abastecimiento
 *     description: >
 *       Ejecuta el SP `SP_ReportPurchasingSupply` y devuelve 5 datasets:
 *       cabecera de solicitudes de compra, detalle de solicitudes,
 *       KPIs de compras, compras agrupadas por proveedor y estado de solicitudes.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Año del reporte. Si no se envía, el SP usa el año actual."
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
 *         name: idPurchaseRequest
 *         schema:
 *           type: integer
 *         description: "ID de la solicitud de compra."
 *       - in: query
 *         name: idSupplier
 *         schema:
 *           type: integer
 *         description: "ID del proveedor (TB_Supplier). Filtra cabecera y detalle."
 *       - in: query
 *         name: idWarehouse
 *         schema:
 *           type: integer
 *         description: "ID de la bodega (TB_WareHouse). Filtra cabecera y detalle."
 *       - in: query
 *         name: idInput
 *         schema:
 *           type: integer
 *         description: "ID del insumo (TB_Input). Filtra cabecera y detalle."
 *       - in: query
 *         name: idPurchaseRequestStatus
 *         schema:
 *           type: integer
 *         description: "ID del estado de la solicitud (TB_PurchaseRequestStatus). Solo aplica a cabecera."
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [ALL, ENTRADA, SALIDA, RETORNO]
 *         description: "Tipo de movimiento a incluir. Por defecto ALL."
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: "Estado activo: 1 = activo, 0 = inactivo. Filtra cabecera y detalle."
 *       - in: query
 *         name: amountMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto mínimo (inclusive). Aplica al totalAmount de la cabecera."
 *       - in: query
 *         name: amountMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: "Monto máximo (inclusive). Aplica al totalAmount de la cabecera."
 *     responses:
 *       200:
 *         description: Resultado del reporte con 5 datasets
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
 *                     purchaseRequests:
 *                       type: array
 *                       description: "Dataset 1: cabecera de solicitudes de compra"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           idPurchaseRequest: { type: integer }
 *                           consecutive: { type: string, nullable: true }
 *                           requestDate: { type: string, format: date }
 *                           idInput: { type: integer, nullable: true }
 *                           inputName: { type: string, nullable: true }
 *                           idWarehouse: { type: integer, nullable: true }
 *                           warehouseName: { type: string, nullable: true }
 *                           idSupplier: { type: integer, nullable: true }
 *                           supplierName: { type: string, nullable: true }
 *                           idPurchaseRequestStatus: { type: integer, nullable: true }
 *                           purchaseRequestStatus: { type: string, nullable: true }
 *                           quantityValue: { type: number, nullable: true }
 *                           priceValue: { type: number, nullable: true }
 *                           totalAmount: { type: number, nullable: true }
 *                           movementType: { type: string }
 *                           isActive: { type: boolean, nullable: true }
 *                     purchaseRequestDetails:
 *                       type: array
 *                       description: "Dataset 2: detalle de solicitudes de compra"
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportStartDate: { type: string, format: date }
 *                           reportEndDate: { type: string, format: date }
 *                           idPurchaseRequestDetail: { type: integer }
 *                           idPurchaseRequest: { type: integer }
 *                           consecutive: { type: string, nullable: true }
 *                           detailDate: { type: string, format: date }
 *                           idInput: { type: integer, nullable: true }
 *                           inputName: { type: string, nullable: true }
 *                           idWarehouse: { type: integer, nullable: true }
 *                           warehouseName: { type: string, nullable: true }
 *                           idSupplier: { type: integer, nullable: true }
 *                           supplierName: { type: string, nullable: true }
 *                           quantityValue: { type: number, nullable: true }
 *                           priceValue: { type: number, nullable: true }
 *                           totalAmount: { type: number, nullable: true }
 *                           movementType: { type: string }
 *                           isActive: { type: boolean, nullable: true }
 *                     kpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 3: KPIs generales de compras"
 *                       properties:
 *                         reportStartDate: { type: string, format: date }
 *                         reportEndDate: { type: string, format: date }
 *                         totalRequests: { type: integer }
 *                         totalRequestAmount: { type: number }
 *                         averageRequestAmount: { type: number, nullable: true }
 *                         totalEntryAmount: { type: number }
 *                         totalExitAmount: { type: number }
 *                         totalReturnAmount: { type: number }
 *                     purchasesBySupplier:
 *                       type: array
 *                       description: "Dataset 4: compras agrupadas por proveedor"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idSupplier: { type: integer, nullable: true }
 *                           supplierName: { type: string }
 *                           totalDetails: { type: integer }
 *                           totalQuantity: { type: number }
 *                           totalAmount: { type: number }
 *                     purchaseRequestsByStatus:
 *                       type: array
 *                       description: "Dataset 5: solicitudes agrupadas por estado"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idPurchaseRequestStatus: { type: integer }
 *                           purchaseRequestStatus: { type: string }
 *                           totalRequests: { type: integer }
 *                           totalAmount: { type: number }
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
 * /v1/reports/cost-center-analytics:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte analitico de centros de costo
 *     description: >
 *       Ejecuta el SP `SP_Report_CostCenter_Analytics` y devuelve 11 datasets:
 *       resumen general, rentabilidad por proyecto, costo por etapa,
 *       tendencia mensual, facturas por estado, analisis de contratos,
 *       resumen de empleados por proyecto, productividad por empleado,
 *       consolidados de contratos pagados/cancelados,
 *       consolidado de materiales por proyecto y detalle de materiales por contrato.
 *       Solo se puede usar **un** tipo de periodo a la vez (month, bimester, semester o dateFrom/dateTo).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Año del reporte. Opcional; si no se envía y se usa month/bimester/semester, aplica sobre todos los años."
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
 *         description: "Fecha inicial del rango (YYYY-MM-DD). Debe enviarse junto con dateTo."
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: "Fecha final del rango (YYYY-MM-DD). Debe enviarse junto con dateFrom."
 *       - in: query
 *         name: idRevenueCenter
 *         schema:
 *           type: integer
 *         description: "ID del centro de utilidad."
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: "ID del proyecto / centro de costo."
 *       - in: query
 *         name: idRevenueCenterStatus
 *         schema:
 *           type: integer
 *         description: "ID del estado del centro de utilidad."
 *       - in: query
 *         name: idInvoiceStatus
 *         schema:
 *           type: integer
 *         description: "ID del estado de factura."
 *       - in: query
 *         name: idExpenditureType
 *         schema:
 *           type: integer
 *         description: "ID del tipo de egreso (TB_ExpenditureType)."
 *     responses:
 *       200:
 *         description: Resultado del reporte con 11 datasets
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
 *                     summary:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 1: resumen general de KPIs"
 *                     profitabilityByProject:
 *                       type: array
 *                       description: "Dataset 2: rentabilidad por proyecto"
 *                       items:
 *                         type: object
 *                     stageCostByProject:
 *                       type: array
 *                       description: "Dataset 3: costo por etapa / tipo de egreso"
 *                       items:
 *                         type: object
 *                     monthlyTrend:
 *                       type: array
 *                       description: "Dataset 4: tendencia mensual"
 *                       items:
 *                         type: object
 *                     invoicesByStatus:
 *                       type: array
 *                       description: "Dataset 5: facturas por estado"
 *                       items:
 *                         type: object
 *                     contractAnalysis:
 *                       type: array
 *                       description: "Dataset 6: analisis de contratos de factura"
 *                       items:
 *                         type: object
 *                     employeesByProject:
 *                       type: array
 *                       description: "Dataset 7: resumen de empleados por proyecto"
 *                       items:
 *                         type: object
 *                     employeeProductivity:
 *                       type: array
 *                       description: "Dataset 8: productividad por empleado/proyecto"
 *                       items:
 *                         type: object
 *                     contractConsolidated:
 *                       type: array
 *                       description: "Dataset 9: consolidados de contratos pagados/cancelados"
 *                       items:
 *                         type: object
 *                     materialConsolidated:
 *                       type: array
 *                       description: "Dataset 10: consolidado de materiales por proyecto"
 *                       items:
 *                         type: object
 *                     materialDetail:
 *                       type: array
 *                       description: "Dataset 11: detalle de materiales por item y contrato"
 *                       items:
 *                         type: object
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
 * /v1/reports/revenue-centers:
 *   get:
 *     tags: [Reports]
 *     summary: Catalogo de centros de utilidad
 *     description: >
 *       Consulta el catalogo unificado de centros de utilidad desde
 *       `TB_RevenueCenter`, `TB_RevenueCenter_Liquidation`,
 *       `TB_RevenueCenter_Inactive` y `TB_RevenueCenter_RetentionGuarantee`.
 *       Retorna registros unicos por `idRevenueCenter` y `name`.
 *     responses:
 *       200:
 *         description: Catalogo de centros de utilidad
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
 *                       idRevenueCenter:
 *                         type: integer
 *                         example: 22
 *                       name:
 *                         type: string
 *                         maxLength: 64
 *                         example: FONTANAR
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
 *       Ejecuta el SP `SP_ReportExpenditureIncomeInvoice` y devuelve 7 datasets base:
 *       egresos por tipo, ingresos por tipo de egreso, ingresos por estado de factura,
 *       top 10 proyectos con más gasto, top 10 proyectos con menos gasto,
 *       avance de facturación por item de proyecto y KPIs globales de retenciones.
 *       Además, devuelve un dataset 8 (estado de cuentas mensual) cuando se envía `year` explícitamente.
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
 *         description: "Fecha inicial del rango (YYYY-MM-DD). Si no se envía, el SP usa el inicio del año resuelto. Exclusivo con month, bimester y semester."
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: "Fecha final del rango (YYYY-MM-DD). Si no se envía, el SP usa el fin del año resuelto. Exclusivo con month, bimester y semester."
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
 *     responses:
 *       200:
 *         description: Resultado del reporte con 7 datasets base y 1 dataset condicional
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
 *                     expendituresByType:
 *                       type: array
 *                       description: "Dataset 1: egresos agrupados por tipo (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idExpenditureType: { type: integer }
 *                           expenditureType: { type: string }
 *                           totalRecords: { type: integer }
 *                           totalExpenditure: { type: number }
 *                     incomesByExpenditureType:
 *                       type: array
 *                       description: "Dataset 2: ingresos agrupados por tipo de egreso (top 8)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idExpenditureType: { type: integer }
 *                           expenditureType: { type: string }
 *                           totalRecords: { type: integer }
 *                           totalIncome: { type: number }
 *                     incomesByInvoiceStatus:
 *                       type: array
 *                       description: "Dataset 3: ingresos agrupados por estado de factura (para gráfica)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idInvoiceStatus: { type: integer }
 *                           invoiceStatus: { type: string }
 *                           totalRecords: { type: integer }
 *                           totalIncome: { type: number }
 *                     topProjectsMostExpenditure:
 *                       type: array
 *                       description: "Dataset 4: top 10 proyectos con mayor gasto"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           totalExpenditure: { type: number }
 *                     topProjectsLeastExpenditure:
 *                       type: array
 *                       description: "Dataset 5: top 10 proyectos con menor gasto"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCostCenterProject: { type: integer, nullable: true }
 *                           projectName: { type: string }
 *                           totalExpenditure: { type: number }
 *                     projectItemsBillingProgress:
 *                       type: array
 *                       description: "Dataset 6: avance de facturación por item / contrato del proyecto"
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProjectItem: { type: integer }
 *                           idCostCenterProject: { type: integer }
 *                           projectName: { type: string }
 *                           item: { type: string, nullable: true }
 *                           unitMeasure: { type: string, nullable: true }
 *                           contract: { type: string, nullable: true }
 *                           plannedQuantity: { type: number }
 *                           unitPrice: { type: number }
 *                           plannedTotal: { type: number }
 *                           totalInvoicedQuantity: { type: number }
 *                           totalInvoicedAmount: { type: number }
 *                           invoicedPct: { type: number, nullable: true }
 *                           pendingQuantity: { type: number }
 *                           pendingPct: { type: number, nullable: true }
 *                           linkedInvoices: { type: integer }
 *                     retentionKpis:
 *                       type: object
 *                       nullable: true
 *                       description: "Dataset 7: KPIs globales de retenciones y neto facturado"
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
 *                     statementOfAccountsMonthly:
 *                       type: array
 *                       description: "Dataset 8 (condicional): estado de cuentas mensual; solo se llena cuando se envía year."
 *                       items:
 *                         type: object
 *                         properties:
 *                           sectionName: { type: string, example: INGRESOS }
 *                           rowName: { type: string, example: Factura }
 *                           Enero: { type: number }
 *                           Febrero: { type: number }
 *                           Marzo: { type: number }
 *                           Abril: { type: number }
 *                           Mayo: { type: number }
 *                           Junio: { type: number }
 *                           Julio: { type: number }
 *                           Agosto: { type: number }
 *                           Septiembre: { type: number }
 *                           Octubre: { type: number }
 *                           Noviembre: { type: number }
 *                           Diciembre: { type: number }
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
