import z from "zod";

export const idSchema = z.object({
  idOrder: z.coerce.number()
});

export const idOrderItemSchema = z.object({
  idOrderItem: z.coerce.number()
});

export const idOrderItemDetailSchema = z.object({
  idOrderItemDetail: z.coerce.number()
});

export const findAllSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});

export const findAllOrderItemSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});

export const findAllOrderItemDetailSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});

export const createOrderSchema = z.object({
  address: z.string(),
  phone: z.string(),
  idEmployee: z.coerce.number()
});

export const createOrderItemSchema = z.object({
  idOrder: z.coerce.number(),
  idOrderItemStatus: z.coerce.number(),
});

export const createOrderItemDetailSchema = z.object({
  idOrderItem: z.coerce.number(),
  description: z.string(),
  unitMeasure: z.string(),
  quantity: z.coerce.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderSchema = z.object({
  idOrder: z.coerce.number(),
  address: z.coerce.string().optional(),
  phone: z.string().optional(),
  idEmployee: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderItemSchema = z.object({
  idOrderItem: z.coerce.number(),
  idOrder: z.coerce.number().optional(),
  idOrderItemStatus: z.coerce.number().optional(),
  consecutive: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updateOrderItemDetailSchema = z.object({
  idOrderItemDetail: z.coerce.number(),
  idOrderItem: z.coerce.number().optional(),
  description: z.string().optional(),
  unitMeasure: z.string().optional(),
  quantity: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
