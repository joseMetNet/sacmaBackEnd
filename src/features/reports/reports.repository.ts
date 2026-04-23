import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
import { GetReportEmployeesDTO } from "./reports.schema";
import { GetReportExpenditureIncomeInvoiceDTO } from "./reports.schema";
import {
  CostCenterAnalyticsReportResult,
  EmployeeReportResult,
  ExpenditureIncomeInvoiceReportResult,
  IncomeByExpenditureTypeRow,
  InventoryWarehouseMovementReportResult,
  ProjectItemBillingProgressRow,
  PurchasingSupplyReportResult,
  QuotationsReportResult,
  RevenueCenterCatalogRow,
  RetentionKpisRow,
  StatementOfAccountsMonthlyRow,
  SuppliersReportResult,
} from "./reports.interface";
import {
  GetReportCostCenterAnalyticsDTO,
  GetReportInventoryWarehouseMovementDTO,
  GetReportPurchasingSupplyDTO,
  GetReportQuotationsDTO,
  GetReportSuppliersDTO,
} from "./reports.schema";

export class ReportsRepository {
  private emptyResult(): EmployeeReportResult {
    return {
      employees: [],
      kpis: null,
      noveltiesByType: [],
      employeesByContractType: [],
      monthlyTrend: [],
      noveltyDetails: [],
    };
  }

  private classifyFlatRows(rows: any[]): EmployeeReportResult {
    const result = this.emptyResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") {
        continue;
      }

      if ("idEmployeeNovelty" in row && "noveltyDate" in row) {
        result.noveltyDetails.push(row);
        continue;
      }

      if ("reportStartDate" in row && "reportEndDate" in row && "idEmployee" in row && "fullName" in row) {
        result.employees.push(row);
        continue;
      }

      if ("monthStart" in row && "monthName" in row) {
        result.monthlyTrend.push(row);
        continue;
      }

      if ("idNovelty" in row && "novelty" in row && !Object.prototype.hasOwnProperty.call(row, "idEmployee")) {
        result.noveltiesByType.push(row);
        continue;
      }

      if (
        "idContractType" in row &&
        "contractType" in row &&
        "totalEmployees" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idEmployee")
      ) {
        result.employeesByContractType.push(row);
        continue;
      }

      if (
        "totalEmployees" in row &&
        "totalActiveEmployees" in row &&
        "totalInactiveEmployees" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idEmployee")
      ) {
        result.kpis = row;
      }
    }

    return result;
  }

  private mapResultSets(rawQueryResult: unknown): EmployeeReportResult {
    const result = this.emptyResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    // Preferred format: first item contains all recordsets (array of arrays).
    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        employees: sets[0] ?? [],
        kpis: sets[1]?.[0] ?? null,
        noveltiesByType: sets[2] ?? [],
        employeesByContractType: sets[3] ?? [],
        monthlyTrend: sets[4] ?? [],
        noveltyDetails: sets[5] ?? [],
      };
    }

    // Fallback format: Sequelize/driver returns rows flattened across recordsets.
    if (Array.isArray(first)) {
      return this.classifyFlatRows(first);
    }

    // Defensive fallback for single-row edge cases.
    return this.classifyFlatRows([first]);
  }

  async getReportEmployees(filters: GetReportEmployeesDTO): Promise<EmployeeReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdEmployee: filters.idEmployee ?? null,
      EmployeeStatus: filters.employeeStatus ?? null,
      IdContractType: filters.idContractType ?? null,
      IdNovelty: filters.idNovelty ?? null,
      SalaryMin: filters.salaryMin ?? null,
      SalaryMax: filters.salaryMax ?? null,
      IdPosition: filters.idPosition ?? null,
      IdRole: filters.idRole ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportEmployees] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapResultSets(rawResult);
  }

  // ─── ExpenditureIncomeInvoice ─────────────────────────────────────────────

  private emptyExpenditureResult(): ExpenditureIncomeInvoiceReportResult {
    return {
      expendituresByType: [],
      incomesByExpenditureType: [],
      incomesByInvoiceStatus: [],
      topProjectsMostExpenditure: [],
      topProjectsLeastExpenditure: [],
      projectItemsBillingProgress: [],
      retentionKpis: null,
      statementOfAccountsMonthly: [],
    };
  }

  private classifyExpenditureFlatRows(rows: any[]): ExpenditureIncomeInvoiceReportResult {
    const result = this.emptyExpenditureResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 7 – retention KPIs
      if ("totalGrossIncome" in row && "totalNetIncome" in row) {
        result.retentionKpis = row as RetentionKpisRow;
        continue;
      }

      // Dataset 6 – project item billing progress
      if ("idProjectItem" in row && "plannedQuantity" in row) {
        result.projectItemsBillingProgress.push(row as ProjectItemBillingProgressRow);
        continue;
      }

      // Dataset 8 (condicional) – estado de cuentas mensual
      if ("sectionName" in row && "rowName" in row && "Enero" in row && "Diciembre" in row) {
        result.statementOfAccountsMonthly.push(row as StatementOfAccountsMonthlyRow);
        continue;
      }

      // Dataset 3 – incomes by invoice status
      if ("idInvoiceStatus" in row && "totalIncome" in row && "totalRecords" in row) {
        result.incomesByInvoiceStatus.push(row);
        continue;
      }

      // Dataset 1 – expenditures by type
      if ("idExpenditureType" in row && "totalExpenditure" in row && "totalRecords" in row) {
        result.expendituresByType.push(row);
        continue;
      }

      // Dataset 2 – incomes by expenditure type
      if (
        "idExpenditureType" in row &&
        "expenditureType" in row &&
        "totalIncome" in row &&
        "totalRecords" in row
      ) {
        result.incomesByExpenditureType.push(row as IncomeByExpenditureTypeRow);
        continue;
      }

      // Datasets 4 & 5 – top projects by expenditure.
      // In flat mode the driver loses recordset boundaries, so both shapes are indistinguishable.
      if ("idCostCenterProject" in row && "totalExpenditure" in row) {
        result.topProjectsMostExpenditure.push(row);
      }
    }

    return result;
  }

  private mapExpenditureResultSets(rawQueryResult: unknown): ExpenditureIncomeInvoiceReportResult {
    const result = this.emptyExpenditureResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    // Preferred: indexed array of arrays
    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        expendituresByType: sets[0] ?? [],
        incomesByExpenditureType: sets[1] ?? [],
        incomesByInvoiceStatus: sets[2] ?? [],
        topProjectsMostExpenditure: sets[3] ?? [],
        topProjectsLeastExpenditure: sets[4] ?? [],
        projectItemsBillingProgress: sets[5] ?? [],
        retentionKpis: sets[6]?.[0] ?? null,
        statementOfAccountsMonthly: sets[7] ?? [],
      };
    }

    // Fallback: flat rows from driver
    if (Array.isArray(first)) {
      return this.classifyExpenditureFlatRows(first);
    }

    return this.classifyExpenditureFlatRows([first]);
  }

  async getReportExpenditureIncomeInvoice(
    filters: GetReportExpenditureIncomeInvoiceDTO
  ): Promise<ExpenditureIncomeInvoiceReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdCostCenterProject: filters.idCostCenterProject ?? null,
      IdExpenditureType: filters.idExpenditureType ?? null,
      IdInvoiceStatus: filters.idInvoiceStatus ?? null,
      MovementType: filters.movementType ?? null,
      AmountMin: filters.amountMin ?? null,
      AmountMax: filters.amountMax ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportExpenditureIncomeInvoice] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapExpenditureResultSets(rawResult);
  }

  // ─── CostCenterAnalytics ──────────────────────────────────────────────────

  private emptyCostCenterAnalyticsResult(): CostCenterAnalyticsReportResult {
    return {
      summary: null,
      profitabilityByProject: [],
      stageCostByProject: [],
      monthlyTrend: [],
      invoicesByStatus: [],
      contractAnalysis: [],
      employeesByProject: [],
      employeeProductivity: [],
      contractConsolidated: [],
      materialConsolidated: [],
      materialDetail: [],
    };
  }

  private classifyCostCenterAnalyticsFlatRows(rows: any[]): CostCenterAnalyticsReportResult {
    const result = this.emptyCostCenterAnalyticsResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 1: resumen general
      if (
        "totalIncome" in row &&
        "totalExpenditure" in row &&
        "totalDirectExpenditure" in row &&
        "totalLaborCost" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idRevenueCenter")
      ) {
        result.summary = row;
        continue;
      }

      // Dataset 2: rentabilidad por proyecto
      if ("Profitability" in row && "Why" in row && "NetMargin" in row) {
        result.profitabilityByProject.push(row);
        continue;
      }

      // Dataset 3: costo por etapa
      if ("StageOrExpenseType" in row && "StageCost" in row && "ExpenditureClass" in row) {
        result.stageCostByProject.push(row);
        continue;
      }

      // Dataset 4: tendencia mensual
      if (
        "year" in row &&
        "month" in row &&
        "income" in row &&
        "expenditure" in row &&
        "overtimeHours" in row
      ) {
        result.monthlyTrend.push(row);
        continue;
      }

      // Dataset 5: facturas por estado
      if ("InvoiceCount" in row && "InvoiceAmount" in row && "idInvoiceStatus" in row) {
        result.invoicesByStatus.push(row);
        continue;
      }

      // Dataset 6: analisis de contratos
      if ("InvoiceTotal" in row && "FirstInvoiceDate" in row && "LastInvoiceDate" in row) {
        result.contractAnalysis.push(row);
        continue;
      }

      // Dataset 7: resumen empleados por proyecto
      if ("EmployeesWorked" in row && "EmployeeProjectWorkDays" in row && "TotalLaborCost" in row) {
        result.employeesByProject.push(row);
        continue;
      }

      // Dataset 8: productividad por empleado/proyecto
      if ("WorkloadRankInProject" in row && "AvgOvertimePerDay" in row && "WorkedDays" in row) {
        result.employeeProductivity.push(row);
        continue;
      }

      // Dataset 9: consolidados de contratos
      if ("TotalInvoices" in row && "PaidInvoices" in row && "CancelledInvoices" in row) {
        result.contractConsolidated.push(row);
        continue;
      }

      // Dataset 10: consolidado de materiales por proyecto
      if ("MaterialAssignedQty" in row && "PendingToInvoiceQty" in row) {
        result.materialConsolidated.push(row);
        continue;
      }

      // Dataset 11: detalle de materiales por item/contrato
      if ("idInput" in row && "MaterialName" in row && "quantityAssigned" in row && "pendingToInvoiceQty" in row) {
        result.materialDetail.push(row);
        continue;
      }

      // Compatibilidad defensiva: filas de contratos en fallback plano.
      if ("Contract" in row && "TotalInvoices" in row && "PaidInvoicePct" in row) {
        result.contractConsolidated.push(row);
      }
    }

    return result;
  }

  private mapCostCenterAnalyticsResultSets(rawQueryResult: unknown): CostCenterAnalyticsReportResult {
    const result = this.emptyCostCenterAnalyticsResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        summary: sets[0]?.[0] ?? null,
        profitabilityByProject: sets[1] ?? [],
        stageCostByProject: sets[2] ?? [],
        monthlyTrend: sets[3] ?? [],
        invoicesByStatus: sets[4] ?? [],
        contractAnalysis: sets[5] ?? [],
        employeesByProject: sets[6] ?? [],
        employeeProductivity: sets[7] ?? [],
        contractConsolidated: sets[8] ?? [],
        materialConsolidated: sets[9] ?? [],
        materialDetail: sets[10] ?? [],
      };
    }

    // Fallback para drivers que devuelven filas planas de multiples resultsets.
    if (Array.isArray(first)) {
      return this.classifyCostCenterAnalyticsFlatRows(first);
    }

    return this.classifyCostCenterAnalyticsFlatRows([first]);
  }

  async getReportCostCenterAnalytics(
    filters: GetReportCostCenterAnalyticsDTO
  ): Promise<CostCenterAnalyticsReportResult> {
    const params: Record<string, any> = {
      IdRevenueCenter: filters.idRevenueCenter ?? null,
      IdCostCenterProject: filters.idCostCenterProject ?? null,
      IdRevenueCenterStatus: filters.idRevenueCenterStatus ?? null,
      IdInvoiceStatus: filters.idInvoiceStatus ?? null,
      IdExpenditureType: filters.idExpenditureType ?? null,
      ReportYear: filters.year ?? null,
      ReportMonth: filters.month ?? null,
      ReportBimester: filters.bimester ?? null,
      ReportSemester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_Report_CostCenter_Analytics] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapCostCenterAnalyticsResultSets(rawResult);
  }

  async getRevenueCentersCatalog(): Promise<RevenueCenterCatalogRow[]> {
    const rows = await dbConnection.query<RevenueCenterCatalogRow>(
      `
      SELECT idRevenueCenter, name
      FROM [mvp1].[TB_RevenueCenter]

      UNION

      SELECT idRevenueCenter, name
      FROM [mvp1].[TB_RevenueCenter_Liquidation]

      UNION

      SELECT idRevenueCenter, name
      FROM [mvp1].[TB_RevenueCenter_Inactive]

      UNION

      SELECT idRevenueCenter, name
      FROM [mvp1].[TB_RevenueCenter_RetentionGuarantee]
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return rows;
  }

  // ─── Quotations ───────────────────────────────────────────────────────────

  private emptyQuotationsResult(): QuotationsReportResult {
    return {
      quotations: [],
      kpis: null,
      quotationsByStatus: [],
      quotationPercentages: [],
      quotationComments: [],
      quotationItemsDetail: [],
    };
  }

  private classifyQuotationsFlatRows(rows: any[]): QuotationsReportResult {
    const result = this.emptyQuotationsResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 2: KPIs
      if (
        "totalQuotations" in row &&
        "totalQuotedAmount" in row &&
        "averageQuotedAmount" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idQuotation")
      ) {
        result.kpis = row;
        continue;
      }

      // Dataset 5: comentarios
      if ("idQuotationComment" in row && "comment" in row) {
        result.quotationComments.push(row);
        continue;
      }

      // Dataset 6: items y detalle
      if ("idQuotationItem" in row && "idQuotationItemDetail" in row) {
        result.quotationItemsDetail.push(row);
        continue;
      }

      // Dataset 4: porcentajes
      if (
        "idQuotationPercentage" in row ||
        "administrationPct" in row ||
        "unforeseenPct" in row ||
        "vatPct" in row
      ) {
        result.quotationPercentages.push(row);
        continue;
      }

      // Dataset 3: estado de cotizaciones
      if ("idQuotationStatus" in row && "totalQuotations" in row && "quotationStatus" in row) {
        result.quotationsByStatus.push(row);
        continue;
      }

      // Dataset 1: tabla principal
      if ("idQuotation" in row && "quotedTotalCost" in row && "itemsCount" in row) {
        result.quotations.push(row);
      }
    }

    return result;
  }

  private mapQuotationsResultSets(rawQueryResult: unknown): QuotationsReportResult {
    const result = this.emptyQuotationsResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        quotations: sets[0] ?? [],
        kpis: sets[1]?.[0] ?? null,
        quotationsByStatus: sets[2] ?? [],
        quotationPercentages: sets[3] ?? [],
        quotationComments: sets[4] ?? [],
        quotationItemsDetail: sets[5] ?? [],
      };
    }

    if (Array.isArray(first)) {
      return this.classifyQuotationsFlatRows(first);
    }

    return this.classifyQuotationsFlatRows([first]);
  }

  async getReportQuotations(filters: GetReportQuotationsDTO): Promise<QuotationsReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdQuotation: filters.idQuotation ?? null,
      IdQuotationStatus: filters.idQuotationStatus ?? null,
      IdResponsable: filters.idResponsable ?? null,
      IdInput: filters.idInput ?? null,
      AmountMin: filters.amountMin ?? null,
      AmountMax: filters.amountMax ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportQuotations] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapQuotationsResultSets(rawResult);
  }

  // ─── InventoryWarehouseMovement ─────────────────────────────────────────

  private emptyInventoryWarehouseMovementResult(): InventoryWarehouseMovementReportResult {
    return {
      stock: [],
      movements: [],
      kpis: null,
      movementsByWarehouse: [],
      returnReasons: [],
    };
  }

  private classifyInventoryWarehouseMovementFlatRows(
    rows: any[]
  ): InventoryWarehouseMovementReportResult {
    const result = this.emptyInventoryWarehouseMovementResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 3: KPIs
      if (
        "totalMovements" in row &&
        "totalEntriesQty" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idInventoryMovement") &&
        !Object.prototype.hasOwnProperty.call(row, "idWarehouse")
      ) {
        result.kpis = row;
        continue;
      }

      // Dataset 5: motivos de retorno
      if ("reasonCode" in row && "totalReturns" in row) {
        result.returnReasons.push(row);
        continue;
      }

      // Dataset 4: resumen por bodega
      if (
        "idWarehouse" in row &&
        "movements" in row &&
        "totalQty" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idInventoryMovement")
      ) {
        result.movementsByWarehouse.push(row);
        continue;
      }

      // Dataset 2: trazabilidad de movimientos
      if ("idInventoryMovement" in row && "movementType" in row) {
        result.movements.push(row);
        continue;
      }

      // Dataset 1: stock actual
      if ("idInventory" in row && "quantityAvailable" in row) {
        result.stock.push(row);
      }
    }

    return result;
  }

  private mapInventoryWarehouseMovementResultSets(
    rawQueryResult: unknown
  ): InventoryWarehouseMovementReportResult {
    const result = this.emptyInventoryWarehouseMovementResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        stock: sets[0] ?? [],
        movements: sets[1] ?? [],
        kpis: sets[2]?.[0] ?? null,
        movementsByWarehouse: sets[3] ?? [],
        returnReasons: sets[4] ?? [],
      };
    }

    if (Array.isArray(first)) {
      return this.classifyInventoryWarehouseMovementFlatRows(first);
    }

    return this.classifyInventoryWarehouseMovementFlatRows([first]);
  }

  async getReportInventoryWarehouseMovement(
    filters: GetReportInventoryWarehouseMovementDTO
  ): Promise<InventoryWarehouseMovementReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdWarehouse: filters.idWarehouse ?? null,
      IdInput: filters.idInput ?? null,
      IdCostCenterProject: filters.idCostCenterProject ?? null,
      MovementType: filters.movementType ?? null,
      IdReturnReason: filters.idReturnReason ?? null,
      StockMin: filters.stockMin ?? null,
      StockMax: filters.stockMax ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportInventoryWarehouseMovement] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapInventoryWarehouseMovementResultSets(rawResult);
  }

  // ─── PurchasingSupply ─────────────────────────────────────────────────

  private emptyPurchasingSupplyResult(): PurchasingSupplyReportResult {
    return {
      purchaseRequests: [],
      purchaseRequestDetails: [],
      kpis: null,
      purchasesBySupplier: [],
      purchaseRequestsByStatus: [],
    };
  }

  private classifyPurchasingSupplyFlatRows(rows: any[]): PurchasingSupplyReportResult {
    const result = this.emptyPurchasingSupplyResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 3: KPIs
      if (
        "totalRequests" in row &&
        "totalRequestAmount" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idPurchaseRequest") &&
        !Object.prototype.hasOwnProperty.call(row, "idSupplier") &&
        !Object.prototype.hasOwnProperty.call(row, "idPurchaseRequestStatus")
      ) {
        result.kpis = row;
        continue;
      }

      // Dataset 5: estado de solicitud
      if ("idPurchaseRequestStatus" in row && "purchaseRequestStatus" in row && "totalRequests" in row) {
        result.purchaseRequestsByStatus.push(row);
        continue;
      }

      // Dataset 4: compras por proveedor
      if (
        "idSupplier" in row &&
        "totalDetails" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idPurchaseRequest")
      ) {
        result.purchasesBySupplier.push(row);
        continue;
      }

      // Dataset 2: detalle de solicitudes
      if ("idPurchaseRequestDetail" in row) {
        result.purchaseRequestDetails.push(row);
        continue;
      }

      // Dataset 1: cabecera de solicitudes
      if ("idPurchaseRequest" in row && "requestDate" in row) {
        result.purchaseRequests.push(row);
      }
    }

    return result;
  }

  private mapPurchasingSupplyResultSets(rawQueryResult: unknown): PurchasingSupplyReportResult {
    const result = this.emptyPurchasingSupplyResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        purchaseRequests: sets[0] ?? [],
        purchaseRequestDetails: sets[1] ?? [],
        kpis: sets[2]?.[0] ?? null,
        purchasesBySupplier: sets[3] ?? [],
        purchaseRequestsByStatus: sets[4] ?? [],
      };
    }

    if (Array.isArray(first)) {
      return this.classifyPurchasingSupplyFlatRows(first);
    }

    return this.classifyPurchasingSupplyFlatRows([first]);
  }

  async getReportPurchasingSupply(
    filters: GetReportPurchasingSupplyDTO
  ): Promise<PurchasingSupplyReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdPurchaseRequest: filters.idPurchaseRequest ?? null,
      IdSupplier: filters.idSupplier ?? null,
      IdWarehouse: filters.idWarehouse ?? null,
      IdInput: filters.idInput ?? null,
      IdPurchaseRequestStatus: filters.idPurchaseRequestStatus ?? null,
      MovementType: filters.movementType ?? null,
      IsActive: filters.isActive ?? null,
      AmountMin: filters.amountMin ?? null,
      AmountMax: filters.amountMax ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportPurchasingSupply] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapPurchasingSupplyResultSets(rawResult);
  }


  // ─── Suppliers ─────────────────────────────────────────────────────────────

  private emptySuppliersResult(): SuppliersReportResult {
    return {
      suppliers: [],
      contacts: [],
      kpis: null,
      ranking: [],
    };
  }

  private classifySuppliersFlatRows(rows: any[]): SuppliersReportResult {
    const result = this.emptySuppliersResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 3: KPIs
      if (
        "totalSuppliers" in row &&
        "totalActiveSuppliers" in row &&
        !Object.prototype.hasOwnProperty.call(row, "idSupplier")
      ) {
        result.kpis = row;
        continue;
      }

      // Dataset 4: ranking
      if ("supplierRank" in row) {
        result.ranking.push(row);
        continue;
      }

      // Dataset 2: contactos
      if ("idSupplierContact" in row) {
        result.contacts.push(row);
        continue;
      }

      // Dataset 1: maestro de proveedores con desempeño
      if ("idSupplier" in row && "totalAmount" in row) {
        result.suppliers.push(row);
      }
    }

    return result;
  }

  private mapSuppliersResultSets(rawQueryResult: unknown): SuppliersReportResult {
    const result = this.emptySuppliersResult();

    if (!Array.isArray(rawQueryResult) || rawQueryResult.length === 0) {
      return result;
    }

    const [first] = rawQueryResult as any[];

    if (Array.isArray(first) && first.length > 0 && Array.isArray(first[0])) {
      const sets = first as any[][];
      return {
        suppliers: sets[0] ?? [],
        contacts: sets[1] ?? [],
        kpis: sets[2]?.[0] ?? null,
        ranking: sets[3] ?? [],
      };
    }

    if (Array.isArray(first)) {
      return this.classifySuppliersFlatRows(first);
    }

    return this.classifySuppliersFlatRows([first]);
  }

  async getReportSuppliers(filters: GetReportSuppliersDTO): Promise<SuppliersReportResult> {
    const params: Record<string, any> = {
      Year: filters.year ?? null,
      Month: filters.month ?? null,
      Bimester: filters.bimester ?? null,
      Semester: filters.semester ?? null,
      DateFrom: filters.dateFrom ?? null,
      DateTo: filters.dateTo ?? null,
      IdSupplier: filters.idSupplier ?? null,
      SupplierStatus: filters.supplierStatus ?? null,
      IdCity: filters.idCity ?? null,
      IdState: filters.idState ?? null,
      SearchText: filters.searchText ?? null,
      AmountMin: filters.amountMin ?? null,
      AmountMax: filters.amountMax ?? null,
    };

    const paramsSql = Object.keys(params)
      .map((key) => `@${key} = :${key}`)
      .join(", ");

    const rawResult = await dbConnection.query(
      `EXEC [mvp1].[SP_ReportSuppliers] ${paramsSql}`,
      {
        replacements: params,
        type: QueryTypes.RAW,
      }
    );

    return this.mapSuppliersResultSets(rawResult);
  }

  
}
