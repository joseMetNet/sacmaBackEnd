export interface MoveInputDTO {
  idPurchaseRequest: number;
  idPurchaseRequestDetail?: number;
  idInput: number;
  idWarehouse: number;
  movementType: 'Entrada' | 'Salida' | 'Retorno';
  quantity: string;
  price?: string;
  remarks?: string;
  createdBy?: string;
}

export interface FindAllInputMovementDTO {
  page?: number;
  pageSize?: number;
  idPurchaseRequest?: number;
  idPurchaseRequestDetail?: number;
  idInput?: number;
  idWarehouse?: number;
  movementType?: 'Entrada' | 'Salida' | 'Retorno';
  startDate?: string;
  endDate?: string;
}

export interface InputMovementResponse {
  idInputMovement: number;
  idPurchaseRequest?: number;
  idPurchaseRequestDetail?: number;
  idInput?: number;
  idWarehouse?: number;
  movementType: string;
  quantity: string;
  price?: string;
  remarks?: string;
  createdBy?: string;
  createdAt?: Date;
}
