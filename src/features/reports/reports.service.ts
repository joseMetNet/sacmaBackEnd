import { BuildResponse } from "../../utils/build-response";
import { StatusCode } from "../../utils/general.interfase";
import { ResponseEntity } from "../employee/interface";
import { ReportsRepository } from "./reports.repository";
import {
  GetReportCostCenterAnalyticsDTO,
  GetReportEmployeesDTO,
  GetReportExpenditureIncomeInvoiceDTO,
} from "./reports.schema";

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

  getReportExpenditureIncomeInvoice = async (
    filters: GetReportExpenditureIncomeInvoiceDTO
  ): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportExpenditureIncomeInvoice(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al ejecutar el reporte de egresos-ingresos-facturas";
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message });
    }
  };

  getReportCostCenterAnalytics = async (filters: GetReportCostCenterAnalyticsDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportCostCenterAnalytics(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al ejecutar el reporte de analitica de centros de costo";
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message });
    }
  };

  getRevenueCentersCatalog = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getRevenueCentersCatalog();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al consultar el catalogo de centros de utilidad";
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message });
    }
  };
}
