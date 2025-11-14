import z from "zod";

export const idPurchaseRequestSchema = z.object({
  idPurchaseRequest: z.coerce.number()
});

export const idPurchaseRequestDetailSchema = z.object({
  idPurchaseRequestDetail: z.coerce.number()
});

export const idPurchaseRequestDetailMachineryUsed = z.object({
  idPurchaseRequestDetailMachineryUsed: z.coerce.number()
});

export const findAllPurchaseRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  consecutive: z.string().optional(),
  purchaseRequest: z.string().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const findAllPurchaseRequestDetailSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idPurchaseRequest: z.coerce.number()
});

export const findAllPurchaseRequestDetailMachinerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idPurchaseRequest: z.coerce.number()
  // idPurchaseRequestDetailMachineryUsed: z.coerce.number()
});

export const createPurchaseRequestSchema = z.object({
  consecutive: z.string().optional(),
  documentUrl: z.string().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  purchaseRequest: z.string().optional(),
  quantity: z.string().optional(),
  price: z.string().optional(),
  requestDocumentUrl: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const createPurchaseRequestWithItemsSchema = z.object({
  isActive: z.coerce.boolean().optional(),
  purchaseRequest: z.string().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  items: z.array(z.object({
    idInput: z.coerce.number(),
    quantity: z.coerce.number(),
    price: z.coerce.number(),
    originalPrice: z.union([z.coerce.number(), z.string()]).optional(),
    name: z.string().optional(),
    subtotal: z.coerce.number().optional(),
    unitOfMeasure: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, "At least one item is required"),
});


export const createPurchaseRequestDetailSchema = z.object({
  idPurchaseRequest: z.coerce.number(),
  idInput: z.coerce.number(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  purchaseRequest: z.string().optional(),
  quantity: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  price: z.string().optional(),
  requestDocumentUrl: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  documentUrl: z.string().optional(),
});

export const createPurchaseRequestDetailWithItemsSchema = z.object({
  idPurchaseRequest: z.coerce.number(),
  isActive: z.coerce.boolean().optional(),
  purchaseRequest: z.string().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  items: z.array(z.object({
    idInput: z.coerce.number(),
    quantity: z.coerce.number(),
    price: z.coerce.number(),
    originalPrice: z.union([z.coerce.number(), z.string()]).optional(),
    name: z.string().optional(),
    subtotal: z.coerce.number().optional(),
    unitOfMeasure: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, "At least one item is required"),
});

export const createPurchaseRequestDetailMachineryUsedSchema = z.object({
  // idPurchaseRequestDetailMachineryUsed: z.coerce.number(),
  idPurchaseRequest: z.coerce.number(),
  idMachinery: z.coerce.number(),
  idMachineryModel: z.coerce.number(),
  idMachineryType: z.coerce.number(),
  idMachineryStatus: z.coerce.number(),
  idCostCenterProject: z.coerce.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updatePurchaseRequestSchema = z.object({
  idPurchaseRequest: z.coerce.number(),
  consecutive: z.string().optional(),
  documentUrl: z.string().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  purchaseRequest: z.string().optional(),
  quantity: z.string().optional(),
  price: z.string().optional(),
  requestDocumentUrl: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const updatePurchaseRequestDetailSchema = z.object({
  idPurchaseRequestDetail: z.coerce.number(),
  idPurchaseRequest: z.coerce.number().optional(),
  idInput: z.coerce.number().optional(),
  idWarehouse: z.coerce.number().optional(),
  idSupplier: z.coerce.number().optional(),
  purchaseRequest: z.string().optional(),
  quantity: z.union([z.coerce.number(), z.string()]).optional(),
  price: z.union([z.coerce.number(), z.string()]).optional(),
  isActive: z.coerce.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const updatePurchaseRequestDetailMachinerySchema = z.object({
  idPurchaseRequestDetailMachineryUsed: z.coerce.number(),
  idPurchaseRequest: z.coerce.number().optional(),
  idMachinery: z.coerce.number().optional(),
  idMachineryModel: z.coerce.number().optional(),
  idMachineryType: z.coerce.number().optional(),
  idMachineryStatus: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});