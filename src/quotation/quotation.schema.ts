import { z } from "zod";

export const CreateQuotationSchema = z.object({
  name: z.string(),
  idResponsable: z.coerce.number(),
});

export const UpdateQuotationSchema = z.object({
  idQuotation: z.coerce.number(),
  idResponsable: z.number().optional(),
});

export const QuotationSchema = z.object({
  idQuotation: z.coerce.number(),
});

export const FindAllQuotationSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const FindAllQuotationItemSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const FindAllQuotationItemDetailSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const CreateQuotationItemSchema = z.object({
  idQuotation: z.coerce.number(),
  item: z.string(),
  technicalSpecification: z.string(),
  unitMeasure: z.string(),
  quantity: z.coerce.number(),
  unitPrice: z.coerce.number(),
  total: z.coerce.number().optional(),
});

export const UpdateQuotationItemSchema = z.object({
  idQuotationItem: z.coerce.number(),
  idQuotation: z.coerce.number().optional(),
  item: z.string().optional(),
  technicalSpecification: z.string().optional(),
  unitMeasure: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unitPrice: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
});

export const QuotationItemSchema = z.object({
  idQuotationItem: z.coerce.number(),
});


export const QuotationItemDetailSchema = z.object({
  idQuotationItemDetail: z.coerce.number(),
});

export const CreateQuotationItemDetailSchema = z.object({
  idQuotationItem: z.coerce.number(),
  idInput: z.coerce.number(),
  quantity: z.coerce.number(),
});

export const UpdateQuotationItemDetailSchema = z.object({
  idQuotationItemDetail: z.coerce.number(),
  idQuotationItem: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  totalCost: z.coerce.number().optional(),
});

export const QuotationItemDetailFindAllSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
