import { z } from "zod";

// Schema para registro de entrada de inventario
export const registerInventoryEntrySchema = z.object({
  idPurchaseRequest: z.coerce.number().int().positive("idPurchaseRequest debe ser un número positivo"),
  idPurchaseRequestDetail: z.coerce.number().int().positive("idPurchaseRequestDetail debe ser un número positivo"),
  idInput: z.coerce.number().int().positive("idInput debe ser un número positivo"),
  idWarehouse: z.coerce.number().int().positive("idWarehouse debe ser un número positivo"),
  quantity: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantity debe ser un número decimal positivo",
  }),
  unitPrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "unitPrice debe ser un número decimal positivo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para asignación de material a proyecto
export const assignMaterialToProjectSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
  idInput: z.coerce.number().int().positive("idInput debe ser un número positivo"),
  idWarehouse: z.coerce.number().int().positive("idWarehouse debe ser un número positivo"),
  quantity: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantity debe ser un número decimal positivo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para devolución de material desde proyecto
export const returnMaterialFromProjectSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
  quantityToReturn: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantityToReturn debe ser un número decimal positivo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para consulta de inventario
export const findAllInventorySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  idWarehouse: z.coerce.number().int().positive().optional(),
  idInput: z.coerce.number().int().positive().optional(),
  minStock: z.coerce.number().optional(),
});

// Schema para consulta de movimientos
export const findAllInventoryMovementSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  idInventory: z.coerce.number().int().positive().optional(),
  idWarehouse: z.coerce.number().int().positive().optional(),
  idInput: z.coerce.number().int().positive().optional(),
  movementType: z.enum(["Entrada", "Salida", "AsignacionProyecto", "DevolucionProyecto", "Ajuste", "Transferencia"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Schema para consulta de asignaciones a proyectos
export const findAllProjectAssignmentSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  idCostCenterProject: z.coerce.number().int().positive().optional(),
  idInput: z.coerce.number().int().positive().optional(),
  status: z.enum(["Asignado", "EnUso", "Completado", "Devuelto", "Cancelado"]).optional(),
});

// Schema para ajuste manual de inventario
export const adjustInventorySchema = z.object({
  idInput: z.coerce.number().int().positive("idInput debe ser un número positivo"),
  idWarehouse: z.coerce.number().int().positive("idWarehouse debe ser un número positivo"),
  quantity: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantity debe ser un número decimal positivo",
  }),
  remarks: z.string().min(1, "remarks es requerido para ajustes").max(500),
  createdBy: z.string().max(100).optional(),
  adjustmentType: z.enum(["Increase", "Decrease"]),
});

// Schema para transferencia entre bodegas
export const transferInventorySchema = z.object({
  idInput: z.coerce.number().int().positive("idInput debe ser un número positivo"),
  idWarehouseFrom: z.coerce.number().int().positive("idWarehouseFrom debe ser un número positivo"),
  idWarehouseTo: z.coerce.number().int().positive("idWarehouseTo debe ser un número positivo"),
  quantity: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantity debe ser un número decimal positivo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para parámetro de bodega
export const warehouseParamSchema = z.object({
  idWarehouse: z.coerce.number().int().positive("idWarehouse debe ser un número positivo").optional(),
});

// Schema para parámetro de proyecto
export const projectParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});
