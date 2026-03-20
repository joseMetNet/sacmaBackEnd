import { BuildResponse } from "../../utils/build-response";
import { StatusCode } from "../../utils/general.interfase";
import { ResponseEntity } from "../employee/interface";
import { ReportsRepository } from "./reports.repository";
import { GetReportEmployeesDTO } from "./reports.schema";

export class ReportsService {
  private readonly reportsRepository: ReportsRepository;

  constructor(reportsRepository: ReportsRepository) {
    this.reportsRepository = reportsRepository;
  }

  getReportEmployees = async (filters: GetReportEmployeesDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportEmployees(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al ejecutar el reporte de empleados";
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message });
    }
  };
}
