import z from "zod";

export const idNoveltySchema = z.object({
  idEmployeeNovelty: z.coerce.number(),
});

export const updateNoveltySchema = z.object({
  idNovelty: z.coerce.number(),
  idEmployee: z.number(),
  loanValue: z.string().optional(),
  observation: z.string().optional(),
});

export const createNoveltySchema = z.object({
  idNoveltyKind: z.coerce.number(),
  loanValue: z.string(),
  idEmployee: z.coerce.number(),
  observation: z.string().optional(),
});