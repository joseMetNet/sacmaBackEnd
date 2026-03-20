import { z } from "zod";

export const createIncomeDiscountInvoiceSchema = z.object({
  value: z.number().min(0, "Value must be greater than or equal to 0"), // Obligatorio
  idExpenditureType: z.number().int().min(1, "ExpenditureType ID is required"), // Obligatorio
  idCostCenterProject: z.number().int().min(1, "CostCenterProject ID is required"), // Obligatorio
  idInvoice: z.number().int().min(1, "Invoice ID is required"), // Obligatorio
  refundRequestDate: z.string().optional(), // Opcional - se asigna fecha actual por defecto
  advance: z.number().min(0).optional().default(0),
  reteguarantee: z.number().min(0).optional().default(0),
  retesource: z.number().min(0).optional().default(0),
  reteica: z.number().min(0).optional().default(0),
  fic: z.number().min(0).optional().default(0),
  other: z.number().min(0).optional().default(0),
  totalDiscounts: z.number().min(0).optional().default(0),
  idIncome: z.number().min(0).optional().default(0),
});

export const updateIncomeDiscountInvoiceSchema = z.object({
  idIncome: z.number().int().min(1, "idIncome is required"), // Cambio: usar idIncome como identificador
  value: z.number().min(0, "Value must be greater than or equal to 0").optional(),
  idExpenditureType: z.number().int().min(1, "ExpenditureType ID is required").optional(),
  idCostCenterProject: z.number().int().min(1, "CostCenterProject ID is required").optional(),
  idInvoice: z.number().int().min(1, "Invoice ID is required").optional(),
  refundRequestDate: z.string().optional(),
  advance: z.number().min(0).optional(),
  reteguarantee: z.number().min(0).optional(),
  retesource: z.number().min(0).optional(),
  reteica: z.number().min(0).optional(),
  fic: z.number().min(0).optional(),
  other: z.number().min(0).optional(),
  totalDiscounts: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const findAllIncomeDiscountInvoiceSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  idIncomeDiscountInvoice: z.string().optional(),
  idExpenditureType: z.string().optional(),
  idCostCenterProject: z.string().optional(),
  idInvoice: z.string().optional(),
  idIncome: z.string().optional(),
  totalDiscounts: z.string().optional(),
  refundRequestDate: z.string().optional(),
  isActive: z.string().optional(),
});

export const idIncomeDiscountInvoiceSchema = z.object({
  // idIncomeDiscountInvoice: z.string(),
  idIncome: z.coerce.number(),
});

export type CreateIncomeDiscountInvoiceSchema = z.infer<typeof createIncomeDiscountInvoiceSchema>;
export type UpdateIncomeDiscountInvoiceSchema = z.infer<typeof updateIncomeDiscountInvoiceSchema>;
export type FindAllIncomeDiscountInvoiceSchema = z.infer<typeof findAllIncomeDiscountInvoiceSchema>;
export type IdIncomeDiscountInvoiceSchema = z.infer<typeof idIncomeDiscountInvoiceSchema>;