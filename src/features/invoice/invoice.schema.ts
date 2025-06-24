import { z } from "zod";

export const findAll = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  idInvoiceStatus: z.coerce.number().optional(),
});

export const idInvoice = z.object({
  idInvoice: z.coerce.number(),
});

export const createInvoice = z.object({
  invoice: z.string(),
  idCostCenterProject: z.coerce.number(),
  client: z.string(),
  value: z.string(),
  contract: z.string(),
  documentUrl: z.string().optional(),
  idInvoiceStatus: z.coerce.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const updateInvoice = z.object({
  idInvoice: z.coerce.number(),
  invoice: z.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  client: z.string().optional(),
  value: z.string().optional(),
  contract: z.string().optional(),
  documentUrl: z.string().optional(),
  idInvoiceStatus: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Export the inferred types as DTOs
export type FindAllDTO = z.infer<typeof findAll>;
export type IdInvoiceDTO = z.infer<typeof idInvoice>;
export type CreateInvoiceDTO = z.infer<typeof createInvoice>;
export type UpdateInvoiceDTO = z.infer<typeof updateInvoice>; 