export interface FindAllOrderItemDTO {
  page?: number;
  pageSize?: number;
  idCostCenterProject?: number;
  idOrderItemStatus?: number;
  consecutive?: string;
}

export interface FindAllOrderItemDetailDTO {
  page?: number;
  pageSize?: number;
  idOrderItem?: number;
}

export interface CreateOrderItem {
  idOrderItemStatus: number;
  idEmployee: number;
  idCostCenterProject: number;
  address?: string;
  phone?: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderItemDetail {
  idOrderItem: number;
  idInput: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderItem {
  idOrderItem: number;
  idEmployee?: number;
  idCostCenterProject?: number;
  address?: string;
  phone?: string;
  documentUrl?: string;
  idOrderItemStatus?: number;
  consecutive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderItemDetail {
  idOrderItemDetail: number;
  idOrderItem?: number;
  idInput?: number;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}