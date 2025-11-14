import z from "zod";

export const idOrderItemSchema = z.object({
  idOrderItem: z.coerce.number()
});

export const idOrderItemDetailSchema = z.object({
  idOrderItemDetail: z.coerce.number()
});

export const deleteOrderItemDetailSchema = z.object({
  idOrderItemDetail: z.coerce.number(),
  quantity: z.coerce.number().optional(),
  idPurchaseRequestDetail: z.coerce.number().optional()
});

export const idOrderItemDetailMachineryUsed = z.object({
  idOrderItemDetailMachineryUsed: z.coerce.number()
});

export const findAllOrderItemSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  consecutive: z.string().optional(),
  orderRequest: z.string().optional(),
  idOrderItemStatus: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
});

export const findAllOrderItemDetailSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idOrderItem: z.coerce.number()
});

export const findAllOrderItemDetailMachinerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idOrderItem: z.coerce.number()
  // idOrderItemDetailMachineryUsed: z.coerce.number()
});

export const createOrderItemSchema = z.object({
  idOrderItemStatus: z.coerce.number(),
  idEmployee: z.coerce.number(),
  idCostCenterProject: z.coerce.number(),
  address: z.string().optional(),
  orderRequest: z.string().optional(),
});

export const createOrderItemDetailSchema = z.object({
  idOrderItem: z.coerce.number(),
  idInput: z.coerce.number(),
  quantity: z.coerce.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const createOrderItemDetailMachineryUsedSchema = z.object({
  // idOrderItemDetailMachineryUsed: z.coerce.number(),
  idOrderItem: z.coerce.number(),
  idMachinery: z.coerce.number(),
  idMachineryModel: z.coerce.number(),
  idMachineryType: z.coerce.number(),
  idMachineryStatus: z.coerce.number(),
  idCostCenterProject: z.coerce.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderItemSchema = z.object({
  idOrderItem: z.coerce.number(),
  idOrderItemStatus: z.coerce.number().optional(),
  idEmployee: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  address: z.string().optional(),
  orderRequest: z.string().optional(),
  consecutive: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderItemDetailSchema = z.object({
  idOrderItemDetail: z.coerce.number(),
  idOrderItem: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderItemDetailMachinerySchema = z.object({
  idOrderItemDetailMachineryUsed: z.coerce.number(),
  idOrderItem: z.coerce.number().optional(),
  idMachinery: z.coerce.number().optional(),
  idMachineryModel: z.coerce.number().optional(),
  idMachineryType: z.coerce.number().optional(),
  idMachineryStatus: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
