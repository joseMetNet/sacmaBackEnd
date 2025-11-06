import z from "zod";

export const moveInputSchema = z.object({
  idPurchaseRequest: z.coerce.number(),
  movementType: z.enum(['Entrada', 'Salida']),
  quantity: z.string().min(1),
  remarks: z.string().optional(),
  createdBy: z.string().optional(),
});

export const findAllInputMovementSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idPurchaseRequest: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  movementType: z.enum(['Entrada', 'Salida']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const idInputMovementSchema = z.object({
  idInputMovement: z.coerce.number()
});
