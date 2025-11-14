import z from "zod";

export const moveInputSchema = z.object({
  idPurchaseRequest: z.coerce.number(),
  idPurchaseRequestDetail: z.coerce.number().optional(),
  idInput: z.coerce.number(),
  idWarehouse: z.coerce.number(),
  movementType: z.enum(['Entrada', 'Salida', 'Retorno']),
  quantity: z.string().min(1),
  price: z.string().optional(),
  remarks: z.string().optional(),
  createdBy: z.string().optional(),
});

export const findAllInputMovementSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idPurchaseRequest: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  movementType: z.enum(['Entrada', 'Salida', 'Retorno']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const idInputMovementSchema = z.object({
  idInputMovement: z.coerce.number()
});
