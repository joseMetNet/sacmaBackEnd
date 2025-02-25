import z from "zod";

export const findAllSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idExpenditureType: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllExpenditureItemSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idExpenditure: z.coerce.number(),
  idExpentitureType: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  consecutive: z.string().optional(),
});

export const idSchema = z.object({
  idExpenditure: z.coerce.number(),
});

export const idExpenditureItemSchema = z.object({
  idExpenditureItem: z.coerce.number(),
});   

export const createSchema = z.object({
  idExpenditureType: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  description: z.string(),
  value: z.string(),
  refundRequestDate: z.string().optional(),
});

export const createExpenditureItemSchema = z.object({
  idExpenditure: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  value: z.string(),
  description: z.string(),
});

export const updateSchema = z.object({
  idExpenditure: z.coerce.number(),
  idExpenditureType: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  description: z.string().optional(),
  value: z.string().optional(),
  refundRequestDate: z.string().optional(),
});

export const updateExpenditureItemSchema = z.object({
  idExpenditureItem: z.coerce.number(),
  idExpenditure: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});