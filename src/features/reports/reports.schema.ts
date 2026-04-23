import { z } from "zod";

const reportDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD");

export const getReportEmployees = z.object({
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  bimester: z.coerce.number().int().min(1).max(6).optional(),
  semester: z.coerce.number().int().min(1).max(2).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  idEmployee: z.coerce.number().int().optional(),
  employeeStatus: z.coerce.number().int().min(0).max(1).optional(),
  idContractType: z.coerce.number().int().optional(),
  idNovelty: z.coerce.number().int().optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  idPosition: z.coerce.number().int().optional(),
  idRole: z.coerce.number().int().optional(),
});

export type GetReportEmployeesDTO = z.infer<typeof getReportEmployees>;

export const getReportExpenditureIncomeInvoice = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idCostCenterProject: z.coerce.number().int().optional(),
    idExpenditureType: z.coerce.number().int().optional(),
    idInvoiceStatus: z.coerce.number().int().optional(),
    movementType: z.enum(["ALL", "EXPENDITURE", "INCOME"]).optional(),
    amountMin: z.coerce.number().min(0).optional(),
    amountMax: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if (data.amountMin !== undefined && data.amountMax !== undefined && data.amountMin > data.amountMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMin"],
        message: "amountMin no puede ser mayor que amountMax.",
      });
    }
  });

export type GetReportExpenditureIncomeInvoiceDTO = z.infer<typeof getReportExpenditureIncomeInvoice>;

export const getReportCostCenterAnalytics = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idRevenueCenter: z.coerce.number().int().optional(),
    idCostCenterProject: z.coerce.number().int().optional(),
    idRevenueCenterStatus: z.coerce.number().int().optional(),
    idInvoiceStatus: z.coerce.number().int().optional(),
    idExpenditureType: z.coerce.number().int().optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if ((data.dateFrom && !data.dateTo) || (!data.dateFrom && data.dateTo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateFrom"],
        message: "Para rango de fechas debes enviar dateFrom y dateTo.",
      });
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      if (from > to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateFrom"],
          message: "dateFrom no puede ser mayor que dateTo.",
        });
      }
    }
  });

export type GetReportCostCenterAnalyticsDTO = z.infer<typeof getReportCostCenterAnalytics>;

export const getReportQuotations = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idQuotation: z.coerce.number().int().optional(),
    idQuotationStatus: z.coerce.number().int().optional(),
    idResponsable: z.coerce.number().int().optional(),
    idInput: z.coerce.number().int().optional(),
    amountMin: z.coerce.number().min(0).optional(),
    amountMax: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if (data.amountMin !== undefined && data.amountMax !== undefined && data.amountMin > data.amountMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMin"],
        message: "amountMin no puede ser mayor que amountMax.",
      });
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      if (from > to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateFrom"],
          message: "dateFrom no puede ser mayor que dateTo.",
        });
      }
    }
  });

export type GetReportQuotationsDTO = z.infer<typeof getReportQuotations>;

export const getReportInventoryWarehouseMovement = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idWarehouse: z.coerce.number().int().optional(),
    idInput: z.coerce.number().int().optional(),
    idCostCenterProject: z.coerce.number().int().optional(),
    movementType: z.enum(["ALL", "ENTRADA", "SALIDA", "RETORNO"]).optional(),
    idReturnReason: z.coerce.number().int().optional(),
    stockMin: z.coerce.number().min(0).optional(),
    stockMax: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if (data.stockMin !== undefined && data.stockMax !== undefined && data.stockMin > data.stockMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stockMin"],
        message: "stockMin no puede ser mayor que stockMax.",
      });
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      if (from > to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateFrom"],
          message: "dateFrom no puede ser mayor que dateTo.",
        });
      }
    }
  });

export type GetReportInventoryWarehouseMovementDTO = z.infer<typeof getReportInventoryWarehouseMovement>;

export const getReportPurchasingSupply = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idPurchaseRequest: z.coerce.number().int().optional(),
    idSupplier: z.coerce.number().int().optional(),
    idWarehouse: z.coerce.number().int().optional(),
    idInput: z.coerce.number().int().optional(),
    idPurchaseRequestStatus: z.coerce.number().int().optional(),
    movementType: z.enum(["ALL", "ENTRADA", "SALIDA", "RETORNO"]).optional(),
    isActive: z.coerce.number().int().min(0).max(1).optional(),
    amountMin: z.coerce.number().min(0).optional(),
    amountMax: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if (data.amountMin !== undefined && data.amountMax !== undefined && data.amountMin > data.amountMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMin"],
        message: "amountMin no puede ser mayor que amountMax.",
      });
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      if (from > to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateFrom"],
          message: "dateFrom no puede ser mayor que dateTo.",
        });
      }
    }
  });

export type GetReportPurchasingSupplyDTO = z.infer<typeof getReportPurchasingSupply>;

export const getReportSuppliers = z
  .object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    bimester: z.coerce.number().int().min(1).max(6).optional(),
    semester: z.coerce.number().int().min(1).max(2).optional(),
    dateFrom: reportDateSchema.optional(),
    dateTo: reportDateSchema.optional(),
    idSupplier: z.coerce.number().int().optional(),
    supplierStatus: z.coerce.number().int().min(0).max(1).optional(),
    idCity: z.coerce.number().int().optional(),
    idState: z.coerce.number().int().optional(),
    searchText: z.string().max(128).optional(),
    amountMin: z.coerce.number().min(0).optional(),
    amountMax: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const periodModes = [
      data.month !== undefined,
      data.bimester !== undefined,
      data.semester !== undefined,
      data.dateFrom !== undefined || data.dateTo !== undefined,
    ].filter(Boolean).length;

    if (periodModes > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Solo puedes usar un tipo de periodo a la vez: month, bimester, semester o dateFrom/dateTo.",
      });
    }

    if (data.amountMin !== undefined && data.amountMax !== undefined && data.amountMin > data.amountMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMin"],
        message: "amountMin no puede ser mayor que amountMax.",
      });
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      if (from > to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateFrom"],
          message: "dateFrom no puede ser mayor que dateTo.",
        });
      }
    }
  });

export type GetReportSuppliersDTO = z.infer<typeof getReportSuppliers>;
