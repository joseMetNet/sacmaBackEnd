export interface MoveInputDTO {
  idPurchaseRequest: number;
  movementType: 'Entrada' | 'Salida';
  quantity: string;
  remarks?: string;
  createdBy?: string;
}

export interface FindAllInputMovementDTO {
  page?: number;
  pageSize?: number;
  idPurchaseRequest?: number;
  idInput?: number;
  idWarehouse?: number;
  movementType?: 'Entrada' | 'Salida';
  startDate?: string;
  endDate?: string;
}

export interface InputMovementResponse {
  idInputMovement: number;
  idPurchaseRequest?: number;
  idInput?: number;
  idWarehouse?: number;
  movementType: string;
  quantity: string;
  price?: string;
  remarks?: string;
  createdBy?: string;
  createdAt?: Date;
}
