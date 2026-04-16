import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
import { GetReportEmployeesDTO } from "./reports.schema";
import { GetReportExpenditureIncomeInvoiceDTO } from "./reports.schema";
import {
  CostCenterAnalyticsReportResult,
  EmployeeReportResult,
  ExpenditureIncomeInvoiceReportResult,
  IncomeByExpenditureTypeRow,
  ProjectItemBillingProgressRow,
  RevenueCenterCatalogRow,
  RetentionKpisRow,
  StatementOfAccountsMonthlyRow,
} from "./reports.interface";
import { GetReportCostCenterAnalyticsDTO } from "./reports.schema";

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
      employeeProjectDetail: [],
      transactionalDetail: [],
      contractAnalysis: [],
      employeesByProject: [],
      employeeProductivity: [],
      contractConsolidated: [],
    };
  }

  private classifyCostCenterAnalyticsFlatRows(rows: any[]): CostCenterAnalyticsReportResult {
    const result = this.emptyCostCenterAnalyticsResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 7: detalle transaccional
      if ("SourceType" in row && "EventDate" in row && "Amount" in row) {
        result.transactionalDetail.push(row);
        continue;
      }

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
        "hoursWorked" in row &&
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

      // Dataset 6: detalle por empleado/proyecto
      if (
        "idEmployee" in row &&
        "workedDays" in row &&
        "hoursWorked" in row &&
        "laborCost" in row &&
        "Enero" in row &&
        "Diciembre" in row
      ) {
        result.employeeProjectDetail.push(row);
        continue;
      }

      // Dataset 8: analisis de contratos
      if ("InvoiceTotal" in row && "FirstInvoiceDate" in row && "LastInvoiceDate" in row) {
        result.contractAnalysis.push(row);
        continue;
      }

      // Dataset 9: resumen empleados por proyecto
      if ("EmployeesWorked" in row && "EmployeeProjectWorkDays" in row && "TotalLaborCost" in row) {
        result.employeesByProject.push(row);
        continue;
      }

      // Dataset 10: productividad por empleado/proyecto
      if ("WorkloadRankInProject" in row && "AvgHoursPerDay" in row && "WorkedDays" in row) {
        result.employeeProductivity.push(row);
        continue;
      }

      // Dataset 11: consolidados de contratos
      if ("TotalInvoices" in row && "PaidInvoices" in row && "CancelledInvoices" in row) {
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
        employeeProjectDetail: sets[5] ?? [],
        transactionalDetail: sets[6] ?? [],
        contractAnalysis: sets[7] ?? [],
        employeesByProject: sets[8] ?? [],
        employeeProductivity: sets[9] ?? [],
        contractConsolidated: sets[10] ?? [],
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
}
