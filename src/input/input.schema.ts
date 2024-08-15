import z from "zod";

export const findAll = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  idSupplier: z.coerce.number().optional(),
});

export const idInput = z.object({
  idInput: z.coerce.number(),
});

export const createInput = z.object({
  name: z.string(),
  idInputType: z.coerce.number(),
  code: z.string(),
  idInputUnitOfMeasure: z.coerce.number(),
  cost: z.string(),
  idSupplier: z.coerce.number(),
  performance: z.string(),
  price: z.string(),
});

export const updateInput = z.object({
  idInput: z.coerce.number(),
  name: z.string().optional(),
  idInputType: z.coerce.number().optional(),
  code: z.string().optional(),
  idInputUnitOfMeasure: z.coerce.number().optional(),
  cost: z.string().optional(),
  idSupplier: z.coerce.number().optional(),
  performance: z.string().optional(),
  price: z.string().optional(),
});