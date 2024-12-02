import { z } from "zod";

export const CreateQuotationSchema = z.object({
  name: z.string(),
  idResponsable: z.coerce.number(),
  builder: z.string().optional(),
  builderAddress: z.string().optional(),
  projectName: z.string().optional(),
  itemSummary: z.string().optional(),
});

export const UpdateQuotationSchema = z.object({
  idQuotation: z.coerce.number(),
  name: z.string().optional(),
  idQuotationStatus: z.coerce.number().optional(),
  idResponsable: z.number().optional(),
  builder: z.string().optional(),
  builderAddress: z.string().optional(),
  projectName: z.string().optional(),
  itemSummary: z.string().optional(),
});

export const QuotationSchema = z.object({
  idQuotation: z.coerce.number(),
});

export const FindAllQuotationSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  responsible: z.string().optional(),
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
  quantity: z.string(),
  unitPrice: z.string().optional(),
  total: z.string().optional(),
});

export const UpdateQuotationItemSchema = z.object({
  idQuotationItem: z.coerce.number(),
  idQuotation: z.coerce.number().optional(),
  item: z.string().optional(),
  technicalSpecification: z.string().optional(),
  unitMeasure: z.string().optional(),
  quantity: z.string().optional(),
  unitPrice: z.string().optional(),
  total: z.string().optional(),
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
});

export const UpdateQuotationItemDetailSchema = z.object({
  idQuotationItemDetail: z.coerce.number(),
  idQuotationItem: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  quantity: z.string().optional(),
  totalCost: z.string().optional(),
});

export const QuotationItemDetailFindAllSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const CreateQuotationPercentageSchema = z.object({
  idQuotation: z.coerce.number(),
  administration: z.coerce.number(),
  unforeseen: z.coerce.number(),
  utility: z.coerce.number(),
  tax: z.coerce.number(),
});

export const UpdateQuotationPercentageSchema = z.object({
  idQuotationPercentage: z.coerce.number(),
  idQuotation: z.coerce.number().optional(),
  administration: z.coerce.number().optional(),
  unforeseen: z.coerce.number().optional(),
  utility: z.coerce.number().optional(),
  tax: z.coerce.number().optional(),
});

export const CreateQuotationCommentSchema = z.object({
  idQuotation: z.coerce.number(),
  idEmployee: z.coerce.number(),
  comment: z.string(),
  createAt: z.string().optional(),
});

export const UpdateQuotationCommentSchema = z.object({
  idQuotationComment: z.coerce.number(),
  idQuotation: z.coerce.number().optional(),
  idEmployee: z.coerce.number().optional(),
  comment: z.string().optional(),
  createAt: z.string().optional(),
});

export const FindAllQuotationCommentSchema = z.object({
  idQuotation: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const QuotationCommentSchema = z.object({
  idQuotationComment: z.coerce.number(),
});