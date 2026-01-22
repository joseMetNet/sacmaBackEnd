// DTOs para consultas
export interface FindAllInventoryDTO {
  page?: number;
  pageSize?: number;
  idWarehouse?: number;
  idInput?: number;
  minStock?: number;
  inputName?: string;
}

export interface FindInventoryByWarehouseDTO {
  page?: number;
  pageSize?: number;
  inputName?: string;
}

export interface FindAllInventoryMovementDTO {
  page?: number;
  pageSize?: number;
  idInventory?: number;
  idWarehouse?: number;
  idInput?: number;
  movementType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface FindAllProjectAssignmentDTO {
  page?: number;
  pageSize?: number;
  idCostCenterProject?: number;
  idInput?: number;
  status?: string;
}

// DTOs para Entrada de Inventario (SP_RegisterInventoryEntry)
export interface RegisterInventoryEntryDTO {
  idPurchaseRequest?: number;
  idPurchaseRequestDetail?: number;
  idInput: number;
  idWarehouse: number;
  quantity: string;
  unitPrice: string;
  remarks?: string;
  createdBy?: string;
}

// DTOs para Asignación a Proyecto (SP_AssignMaterialToProject)
export interface AssignMaterialToProjectDTO {
  idCostCenterProject: number;
  idInput: number;
  idWarehouse: number;
  quantity: string;
  remarks?: string;
  createdBy?: string;
}

// DTOs para Devolución de Proyecto (SP_ReturnMaterialFromProject)
export interface ReturnMaterialFromProjectDTO {
  idProjectAssignment: number;
  quantityToReturn: string;
  idReturnReason?: number;
  remarks?: string;
  createdBy?: string;
}

// DTOs para Uso de Material en Proyecto (SP_UseMaterialInProject)
export interface UseMaterialInProjectDTO {
  idProjectAssignment: number;
  quantityUsed: string;
  remarks?: string;
  createdBy?: string;
}

// DTOs para Registro de Saldo de Material en Proyecto (SP_RecordProjectMaterialBalance)
export interface RecordProjectMaterialBalanceDTO {
  idProjectAssignment: number;
  remainingBalance: string;
  remarks?: string;
  createdBy?: string;
}

// DTOs para consulta de asignaciones con devoluciones
export interface FindProjectAssignmentsWithReturnsDTO {
  idCostCenterProject: number;
  page?: number;
  pageSize?: number;
}

export interface ProjectAssignmentWithReturnResult {
  idProjectAssignment: number;
  idCostCenterProject: number;
  idInput: number;
  Material: string;
  Almacen: string;
  CantidadAsignada: number;
  CantidadUsada: number;
  CantidadDevuelta: number;
  CantidadPendiente: number;
  PrecioUnitario: number;
  ValorDevuelto: number;
  FechaAsignacion: Date;
  Estado: string;
  AsignadoPor: string;
  FechaDevolucion: Date | null;
  NumDevoluciones: number | null;
}

// DTOs para documentos de inventario
export interface UploadInventoryDocumentDTO {
  idInventoryMovement?: number;
  idProjectAssignment?: number;
  idCostCenterProject?: number;
  documentType: string;
  description?: string;
  uploadedBy: string;
}

export interface InventoryDocumentResult {
  idInventoryDocument: number;
  idInventoryMovement: number | null;
  idProjectAssignment: number | null;
  idCostCenterProject: number | null;
  documentType: string;
  fileName: string;
  fileExtension: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  description: string | null;
  uploadedBy: string | null;
  uploadedAt: Date;
  isActive: boolean;
}

// DTOs para motivos de devolución
export interface ReturnReasonResult {
  idReturnReason: number;
  reasonCode: string;
  reasonName: string;
  requiresDocument: boolean;
  isActive: boolean;
}

// DTOs de respuesta
export interface InventoryByWarehouseDTO {
  idInventory: number;
  idInput: number;
  inputName: string;
  idWarehouse: number;
  warehouseName: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityTotal: number;
  averageCost: number;
  totalValue: number;
  lastMovementDate: Date;
  updatedAt: Date;
}

export interface ProjectMaterialsAssignedDTO {
  idProjectAssignment: number;
  idCostCenterProject: number;
  idInput: number;
  inputName: string;
  idWarehouse: number;
  warehouseName: string;
  quantityAssigned: number;
  quantityUsed: number;
  quantityReturned: number;
  quantityPending: number;
  unitPrice: number;
  totalCost: number;
  assignmentDate: Date;
  status: string;
  createdBy: string;
  balance: number;
}

// DTO para ajuste manual de inventario
export interface AdjustInventoryDTO {
  idInput: number;
  idWarehouse: number;
  quantity: string;
  remarks: string;
  createdBy: string;
  adjustmentType: "Increase" | "Decrease";
}

// DTO para transferencia entre bodegas
export interface TransferInventoryDTO {
  idInput: number;
  idWarehouseFrom: number;
  idWarehouseTo: number;
  quantity: string;
  remarks?: string;
  createdBy?: string;
}

// DTO para editar asignación de proyecto (SP_EditProjectMaterialAssignment)
export interface EditProjectMaterialAssignmentDTO {
  idProjectAssignment: number;
  newQuantityPending: string;  // Cuánto QUEDA disponible en el proyecto
  remarks?: string;
  createdBy?: string;
}

// DTO para editar cantidad devuelta (SP_EditReturnedMaterial)
export interface EditReturnedMaterialDTO {
  idProjectAssignment: number;
  newQuantityReturned: string;  // Nueva cantidad devuelta total
  idReturnReason?: number;
  remarks?: string;
  createdBy?: string;
}

// DTOs para consultas de documentos
export interface FindPhysicalInventoryDocumentsDTO {
  idCostCenterProject: number;
  date: string;
  page?: number;
  pageSize?: number;
}

export interface PhysicalInventoryDocumentResult {
  idInventoryDocument: number;
  idCostCenterProject: number;
  filePath: string;
  description: string | null;
  fileExtension: string | null;
  uploadedBy: string | null;
  uploadedAt: Date;
  isActive: boolean;
}

export interface FindReturnDocumentsDTO {
  idCostCenterProject: number;
  page?: number;
  pageSize?: number;
}

export interface ReturnDocumentResult {
  idInventoryMovement: number;
  Proyecto: number;
  Material: string;
  CantidadDevuelta: number;
  Motivo: string | null;
  Observaciones: string | null;
  FechaDevolucion: Date;
  NumDocumentos: number;
  filePath: string | null;
}

// DTOs para resumen de devoluciones agrupadas por fecha
export interface FindReturnsSummaryByDateDTO {
  idCostCenterProject: number;
}

export interface ReturnsSummaryByDateResult {
  FechaDevolucion: string;
  TotalDevoluciones: number;
  CantidadTotalDevuelta: number;
  Materiales: string | null;
  Motivos: string | null;
}

// DTOs para detalle de devoluciones por fecha específica
export interface FindReturnsDetailByDateDTO {
  idCostCenterProject: number;
  returnDate: string; // formato: YYYY-MM-DD
}

export interface ReturnsDetailByDateResult {
  idInventoryMovement: number;
  FechaDevolucion: string;
  HoraDevolucion: string;
  // idProyecto: number;
  Proyecto: number;
  Material: string;
  CantidadDevuelta: number;
  CodigoMotivo: string | null;
  // MotivoDevolucion: string | null;
  Motivo: string | null;
  Observaciones: string | null;
  UsuarioRegistro: string | null;
  TieneEvidencia: string;
  ArchivoEvidencia: string | null;
  // RutaArchivo: string | null;
  filePath: string | null;
  TipoArchivo: string | null;
  description: string | null;
  idProjectAssignment: number | null;
}

// DTOs para TB_InventoryBalance
export interface CreateInventoryBalanceDTO {
  idProjectAssignment?: number;
  idInput?: number;
  idCostCenterProject?: number;
  balance?: number;
  quantity?: number;
  createdBy?: string;
  remarks?: string;
}

export interface UpdateInventoryBalanceDTO {
  idBalance: number;
  idProjectAssignment?: number;
  idInput?: number;
  idCostCenterProject?: number;
  balance?: number;
  quantity?: number;
  createdBy?: string;
  remarks?: string;
}

export interface FindBalanceByAssignmentDTO {
  idProjectAssignment: number;
}

export interface InventoryBalanceResult {
  idBalance: number;
  idProjectAssignment?: number;
  idInput?: number;
  idCostCenterProject?: number;
  balance?: number;
  createdAt?: Date;
  createdBy?: string;
  remarks?: string;
  quantity?: number;
}

// DTOs para actualización de balance en ProjectInventoryAssignment
export interface UpdateProjectAssignmentBalanceItemDTO {
  idProjectAssignment: number;
  idCostCenterProject?: number;
  idInput?: number;
  quantity?: number;
  balance: number;
  remarks?: string;
  createdBy?: string;
}

export interface UpdateProjectAssignmentBalanceDTO {
  items: UpdateProjectAssignmentBalanceItemDTO[];
}

export interface UpdateProjectAssignmentBalanceResult {
  updated: number;
  items: {
    idProjectAssignment: number;
    previousBalance: number;
    newBalance: number;
    idBalanceHistory: number;
  }[];
}

// DTOs para actualizar y eliminar documentos de inventario
export interface UpdateInventoryDocumentDTO {
  idInventoryDocument: number;
  filePath: string;
  fileExtension?: string;
  fileSize?: number;
  mimeType?: string;
  originalName?: string;
}

export interface DeleteInventoryDocumentDTO {
  idInventoryDocument: number;
}
