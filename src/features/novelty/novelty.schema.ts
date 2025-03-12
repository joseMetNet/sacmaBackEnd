import z from "zod";

export const idNoveltySchema = z.object({
  idEmployeeNovelty: z.coerce.number(),
});

export const findNoveltiesByModuleSchema = z.object({
  module: z.string(),
});

export const updateNoveltySchema = z.object({
  idEmployeeNovelty: z.coerce.number(),
  idNovelty: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  endAt: z.string().optional(),
  idPeriodicity: z.coerce.number().optional(),
  loanValue: z.string().optional(),
  installment: z.coerce.number().optional(),
  observation: z.string().optional(),
});

export const createNoveltySchema = z.object({
  idNovelty: z.coerce.number(),
  idEmployee: z.coerce.number(),
  createdAt: z.string(),
  endAt: z.string(),
  loanValue: z.string().optional(),
  idPeriodicity: z.coerce.number().optional(),
  installment: z.coerce.number().optional(),
  observation: z.string().optional(),
});

export const findEmployeeNoveltiesSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idNovelty: z.coerce.number().optional(),
  firstName: z.string().optional(),
  identityCardNumber: z.string().optional(),
  noveltyYear: z.string().optional(),
  noveltyMonth: z.string().optional(),
});
