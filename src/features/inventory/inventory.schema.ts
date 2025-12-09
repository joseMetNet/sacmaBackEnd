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
  idReturnReason: z.coerce.number().int().positive().optional(),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para uso de material en proyecto
export const useMaterialInProjectSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
  quantityUsed: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "quantityUsed debe ser un número decimal positivo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para registro de saldo de material en proyecto
export const recordProjectMaterialBalanceSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
  remainingBalance: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "remainingBalance debe ser un número decimal no negativo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para consulta de asignaciones con devoluciones
export const findProjectAssignmentsWithReturnsParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});

export const findProjectAssignmentsWithReturnsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().optional(),
});

// Schema para consulta de inventario
export const findAllInventorySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().optional(),
  idWarehouse: z.coerce.number().int().positive().optional(),
  idInput: z.coerce.number().int().positive().optional(),
  minStock: z.coerce.number().optional(),
  inputName: z.string().optional(),
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

// Schema para parámetro de bodega en ruta
export const warehouseRouteParamSchema = z.object({
  idWarehouse: z.coerce.number().int().positive("idWarehouse debe ser un número positivo"),
});

// Schema para query params de búsqueda por bodega
export const findInventoryByWarehouseSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().optional(),
  inputName: z.string().optional(),
});

// Schema para subida de documentos
export const uploadInventoryDocumentSchema = z.object({
  idInventoryMovement: z.coerce.number().int().positive().optional(),
  idProjectAssignment: z.coerce.number().int().positive().optional(),
  idCostCenterProject: z.coerce.number().int().positive().optional(),
  documentType: z.enum(["DevolucionMaterial", "InventarioFisico", "AjusteInventario", "DanoMaterial", "Otro"]),
  description: z.string().max(500).optional(),
  uploadedBy: z.string().min(1, "uploadedBy es requerido").max(100),
}).refine(data => data.idInventoryMovement || data.idProjectAssignment || data.idCostCenterProject, {
  message: "Debe proporcionar idInventoryMovement, idProjectAssignment o idCostCenterProject"
});

// Schema para consulta de documentos
export const findInventoryDocumentsSchema = z.object({
  idInventoryMovement: z.coerce.number().int().positive().optional(),
  idProjectAssignment: z.coerce.number().int().positive().optional(),
  documentType: z.enum(["DevolucionMaterial", "InventarioFisico", "AjusteInventario", "DanoMaterial", "Otro"]).optional(),
});

// Schema para editar asignación de proyecto
export const editProjectMaterialAssignmentSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
  newQuantityPending: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "newQuantityPending debe ser un número decimal no negativo",
  }),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para editar cantidad devuelta
export const editReturnedMaterialSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
  newQuantityReturned: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "newQuantityReturned debe ser un número decimal no negativo",
  }),
  idReturnReason: z.coerce.number().int().positive().optional(),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

// Schema para consulta de documentos de inventario físico
export const findPhysicalInventoryDocumentsParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});

export const findPhysicalInventoryDocumentsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date debe tener formato YYYY-MM-DD"),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().optional(),
});

// Schema para consulta de devoluciones con documentos
export const findReturnDocumentsParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});

export const findReturnDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().optional(),
});

// Schema para resumen de devoluciones agrupadas por fecha
export const findReturnsSummaryByDateParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});

// Schema para detalle de devoluciones por fecha específica
export const findReturnsDetailByDateParamSchema = z.object({
  idCostCenterProject: z.coerce.number().int().positive("idCostCenterProject debe ser un número positivo"),
});

export const findReturnsDetailByDateQuerySchema = z.object({
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "returnDate debe tener formato YYYY-MM-DD"),
});

// Schemas para TB_InventoryBalance
export const createInventoryBalanceSchema = z.object({
  idProjectAssignment: z.number().int().positive("idProjectAssignment debe ser un número positivo"),
  balance: z.number().int("balance debe ser un número entero"),
  createdBy: z.string().max(100).optional(),
  remarks: z.string().max(500).optional(),
});

export const updateInventoryBalanceSchema = z.object({
  idBalance: z.coerce.number().int().positive("idBalance debe ser un número positivo"),
  balance: z.number().int("balance debe ser un número entero"),
  createdBy: z.string().max(100).optional(),
  remarks: z.string().max(500).optional(),
});

export const findBalanceByAssignmentParamSchema = z.object({
  idProjectAssignment: z.coerce.number().int().positive("idProjectAssignment debe ser un número positivo"),
});

// Schema para actualización de balance en ProjectInventoryAssignment
export const updateProjectAssignmentBalanceItemSchema = z.object({
  idProjectAssignment: z.number().int().positive("idProjectAssignment debe ser un número positivo"),
  balance: z.number().int("balance debe ser un número entero"),
  remarks: z.string().max(500).optional(),
  createdBy: z.string().max(100).optional(),
});

export const updateProjectAssignmentBalanceSchema = z.object({
  items: z.array(updateProjectAssignmentBalanceItemSchema).min(1, "Debe enviar al menos un item"),
});

// Schemas para actualizar y eliminar documentos de inventario
export const updateInventoryDocumentParamSchema = z.object({
  idInventoryDocument: z.coerce.number().int().positive("idInventoryDocument debe ser un número positivo"),
});

export const deleteInventoryDocumentParamSchema = z.object({
  idInventoryDocument: z.coerce.number().int().positive("idInventoryDocument debe ser un número positivo"),
});
