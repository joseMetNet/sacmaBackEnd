import z from "zod";

export const findAllMachinerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export const machineryIdSchema = z.object({
  idMachinery: z.coerce.number(),
});