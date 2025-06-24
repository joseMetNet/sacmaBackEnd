import z from "zod";

export const findAllSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idRevenueCenter: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  idRevenueCenterStatus: z.coerce.number().optional(),
  idOrderItem: z.coerce.number().optional(),
});

export const idRevenueCenterSchema = z.object({
  idRevenueCenter: z.coerce.number(),
});

export const createRevenueCenterSchema = z.object({
  name: z.string(),
  idCostCenterProject: z.coerce.number(),
  idRevenueCenterStatus: z.coerce.number(),
  fromDate: z.string(),
  toDate: z.string(),
});

export const updateRevenueCenterSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  idRevenueCenterStatus: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const findAllMaterialSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllInputsSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllEppSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllPerDiemSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllPolicySchema = z.object({
  idRevenueCenter: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
});

export const findAllWorkTrackingSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllQuotationSchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const findAllMaterialSummarySchema = z.object({
  idRevenueCenter: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export type FindAllSchema = z.infer<typeof findAllSchema>;
export type IdRevenueCenterSchema = z.infer<typeof idRevenueCenterSchema>;
export type CreateRevenueCenterSchema = z.infer<typeof createRevenueCenterSchema>;
export type UpdateRevenueCenterSchema = z.infer<typeof updateRevenueCenterSchema>;
export type FindAllMaterialSchema = z.infer<typeof findAllMaterialSchema>;
export type FindAllInputsSchema = z.infer<typeof findAllInputsSchema>;
export type FindAllEppSchema = z.infer<typeof findAllEppSchema>;
export type FindAllPerDiemSchema = z.infer<typeof findAllPerDiemSchema>;
export type FindAllPolicySchema = z.infer<typeof findAllPolicySchema>;
export type FindAllWorkTrackingSchema = z.infer<typeof findAllWorkTrackingSchema>;
export type FindAllQuotationSchema = z.infer<typeof findAllQuotationSchema>;
export type FindAllMaterialSummarySchema = z.infer<typeof findAllMaterialSummarySchema>;