import z from "zod";

export const idWareHouseSchema = z.object({
  idWarehouse: z.coerce.number()
});

export const findAllWareHouseSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  isActive: z.string().optional(),
});

export const createWareHouseSchema = z.object({
  name: z.string().optional(),
  isActive: z.coerce.boolean().optional().default(true),
});

export const updateWareHouseSchema = z.object({
  idWarehouse: z.coerce.number(),
  name: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});