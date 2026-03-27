import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
import { GetReportEmployeesDTO } from "./reports.schema";
import { EmployeeReportResult } from "./reports.interface";

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
}
