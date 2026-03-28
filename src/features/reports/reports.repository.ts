import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
import { GetReportEmployeesDTO } from "./reports.schema";
import { GetReportExpenditureIncomeInvoiceDTO } from "./reports.schema";
import { EmployeeReportResult, ExpenditureIncomeInvoiceReportResult, InvoiceDeductionRow, RetentionKpisRow } from "./reports.interface";

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
      movements: [],
      kpis: null,
      expendituresByType: [],
      incomesByInvoiceStatus: [],
      balanceByProject: [],
      monthlyTrend: [],
      topProjectsMostExpenditure: [],
      topProjectsLeastExpenditure: [],
      invoiceDeductions: [],
      retentionKpis: null,
    };
  }

  private classifyExpenditureFlatRows(rows: any[]): ExpenditureIncomeInvoiceReportResult {
    const result = this.emptyExpenditureResult();

    for (const row of rows) {
      if (!row || typeof row !== "object") continue;

      // Dataset 1 – movements: have movementType = EXPENDITURE | INCOME
      if ("movementType" in row && (row.movementType === "EXPENDITURE" || row.movementType === "INCOME")) {
        result.movements.push(row);
        continue;
      }

      // Dataset 2 – KPIs: have totalMovements
      if ("totalMovements" in row) {
        result.kpis = row;
        continue;
      }

      // Dataset 5 – balance by project: have projectBalance
      if ("projectBalance" in row) {
        result.balanceByProject.push(row);
        continue;
      }

      // Dataset 6 – monthly trend: have monthStart + netBalance
      if ("monthStart" in row && "netBalance" in row) {
        result.monthlyTrend.push(row);
        continue;
      }

      // Dataset 4 – incomes by invoice status: have idInvoiceStatus + totalIncome
      if ("idInvoiceStatus" in row && "totalIncome" in row) {
        result.incomesByInvoiceStatus.push(row);
        continue;
      }

      // Dataset 3 – expenditures by type: have idExpenditureType + totalExpenditure (no projectBalance)
      if ("idExpenditureType" in row && "totalExpenditure" in row && !("projectBalance" in row)) {
        result.expendituresByType.push(row);
        continue;
      }

      // Dataset 9 – invoice deductions: have idInvoice + totalDeductions + invoiceCreatedAt
      if ("idInvoice" in row && "totalDeductions" in row && "invoiceCreatedAt" in row) {
        result.invoiceDeductions.push(row as InvoiceDeductionRow);
        continue;
      }

      // Dataset 10 – retention KPIs: have totalGrossIncome + totalNetIncome
      if ("totalGrossIncome" in row && "totalNetIncome" in row) {
        result.retentionKpis = row as RetentionKpisRow;
        continue;
      }

      // Datasets 7 & 8 – top projects: idCostCenterProject + totalExpenditure only
      // Cannot distinguish in flat mode; all go to topProjectsMostExpenditure
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
        movements: sets[0] ?? [],
        kpis: sets[1]?.[0] ?? null,
        expendituresByType: sets[2] ?? [],
        incomesByInvoiceStatus: sets[3] ?? [],
        balanceByProject: sets[4] ?? [],
        monthlyTrend: sets[5] ?? [],
        topProjectsMostExpenditure: sets[6] ?? [],
        topProjectsLeastExpenditure: sets[7] ?? [],
        invoiceDeductions: sets[8] ?? [],
        retentionKpis: sets[9]?.[0] ?? null,
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
      OrderNumber: filters.orderNumber ?? null,
      InvoiceNumber: filters.invoiceNumber ?? null,
      Client: filters.client ?? null,
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
}
