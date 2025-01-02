export interface FindAllDTO {
  page?: number;
  pageSize?: number;
}

export interface FindAllOrderItemDTO {
  page?: number;
  pageSize?: number;
}

export interface FindAllOrderItemDetailDTO {
  page?: number;
  pageSize?: number;
}

export interface Order {
  idOrder: number;
  address: string;
  phone: string;
  idEmployee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrder {
  address: string;
  phone: string;
  idEmployee: number;
}

export interface CreateOrderItem {
  idOrder: number;
  idOrderItemStatus: number;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderItemDetail {
  idOrderItem: number;
  description: string;
  unitMeasure: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrder {
  idOrder: number;
  address?: string;
  phone?: string;
  idEmployee?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderItem {
  idOrderItem: number;
  idOrder?: number;
  documentUrl?: string;
  idOrderItemStatus?: number;
  consecutive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderItemDetail {
  idOrderItemDetail: number;
  idOrderItem?: number;
  description?: string;
  unitMeasure?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}