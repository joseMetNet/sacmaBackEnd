export interface FindAllOrderItemDTO {
  page?: number;
  pageSize?: number;
  orderRequest?: string;
  idCostCenterProject?: number;
  idOrderItemStatus?: number;
  consecutive?: string;
}

export interface FindAllOrderItemDetailDTO {
  page?: number;
  pageSize?: number;
  idOrderItem?: number;
}

export interface FindAllOrderItemDetailMachineryUsedDTO {
  page?: number;
  pageSize?: number;
  idOrderItem?: number;
  // idOrderItemDetailMachineryUsed?: number;
  // idMachineryType?: number;
  // machineryBrand?: string;
  // serial?: string;
  // idMachineryStatus?: number;
}

export interface CreateOrderItem {
  idOrderItemStatus: number;
  idEmployee: number;
  idCostCenterProject: number;
  address?: string;
  orderRequest?: string;
  documentUrl?: string;
  orderDocumentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface UpdateOrderItemIn {
  data: UpdateOrderItem;
  filePath?: string;
  fileExtension?: string;
  filePathOrder?: string;
  fileExtensionOrder?: string;
}

export interface CreateOrderItemDetail {
  idOrderItem: number;
  idInput: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderItemDetailMachineryUsed {
  // idOrderItemDetailMachineryUsed: number;
  idOrderItem: number;
  idMachinery: number;
  idMachineryModel: number;
  idMachineryType: number;
  idMachineryStatus: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderItem {
  idOrderItem: number;
  idEmployee?: number;
  idCostCenterProject?: number;
  address?: string;
  orderRequest?: string;
  documentUrl?: string;
  orderDocumentUrl?: string;
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

export interface UpdateOrderItemDetailMachineryUsed {
  idOrderItemDetailMachineryUsed: number;
  idOrderItem?: number;
  idMachinery?: number;
  idMachineryModel?: number;
  idMachineryType?: number;
  idMachineryStatus?: number;
  createdAt?: string;
  updatedAt?: string;
}