// DTOs para consultas
export interface FindAllInventoryDTO {
  page?: number;
  pageSize?: number;
  idWarehouse?: number;
  idInput?: number;
  minStock?: number;
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
  idPurchaseRequest: number;
  idPurchaseRequestDetail: number;
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
  remarks?: string;
  createdBy?: string;
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
