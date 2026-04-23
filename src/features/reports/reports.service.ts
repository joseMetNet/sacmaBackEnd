import { BuildResponse } from "../../utils/build-response";
import { StatusCode } from "../../utils/general.interfase";
import { ResponseEntity } from "../employee/interface";
import { ReportsRepository } from "./reports.repository";
import {
  GetReportCostCenterAnalyticsDTO,
  GetReportEmployeesDTO,
  GetReportExpenditureIncomeInvoiceDTO,
  GetReportInventoryWarehouseMovementDTO,
  GetReportPurchasingSupplyDTO,
  GetReportQuotationsDTO,
  GetReportSuppliersDTO,
} from "./reports.schema";

export class ReportsService {
  private readonly reportsRepository: ReportsRepository;

  constructor(reportsRepository: ReportsRepository) {
    this.reportsRepository = reportsRepository;
  }

  private getSqlErrorNumber(err: unknown): number | null {
    if (!err || typeof err !== "object") {
      return null;
    }

    const sqlError = err as {
      number?: unknown;
      parent?: { number?: unknown };
      original?: { number?: unknown };
    };

    for (const candidate of [sqlError.number, sqlError.parent?.number, sqlError.original?.number]) {
      if (typeof candidate === "number") {
        return candidate;
      }
    }

    return null;
  }

  private buildReportErrorResponse(err: unknown, fallbackMessage: string): ResponseEntity {
    const message = err instanceof Error ? err.message : fallbackMessage;
    const errorNumber = this.getSqlErrorNumber(err);
    const statusCode = errorNumber !== null && errorNumber >= 50000 && errorNumber < 60000
      ? StatusCode.BadRequest
      : StatusCode.InternalErrorServer;

    return BuildResponse.buildErrorResponse(statusCode, { message });
  }

  getReportEmployees = async (filters: GetReportEmployeesDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportEmployees(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de empleados");
    }
  };

  getReportExpenditureIncomeInvoice = async (
    filters: GetReportExpenditureIncomeInvoiceDTO
  ): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportExpenditureIncomeInvoice(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de egresos-ingresos-facturas");
    }
  };

  getReportCostCenterAnalytics = async (filters: GetReportCostCenterAnalyticsDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportCostCenterAnalytics(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de analitica de centros de costo");
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

  getReportQuotations = async (filters: GetReportQuotationsDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportQuotations(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de cotizaciones");
    }
  };

  getReportInventoryWarehouseMovement = async (
    filters: GetReportInventoryWarehouseMovementDTO
  ): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportInventoryWarehouseMovement(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de inventario y movimientos de bodega");
    }
  };

  getReportPurchasingSupply = async (filters: GetReportPurchasingSupplyDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportPurchasingSupply(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de compras y abastecimiento");
    }
  };

  getReportSuppliers = async (filters: GetReportSuppliersDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.reportsRepository.getReportSuppliers(filters);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      return this.buildReportErrorResponse(err, "Error al ejecutar el reporte de proveedores");
    }
  };
}
