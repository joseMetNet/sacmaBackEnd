export interface FindAllPurchaseRequestDTO {
  page?: number;
  pageSize?: number;
  purchaseRequest?: string;
  consecutive?: string;
  idInput?: number;
  idWarehouse?: number;
  idSupplier?: number;
  isActive?: boolean;
}

export interface FindAllPurchaseRequestDetailDTO {
  page?: number;
  pageSize?: number;
  idPurchaseRequest?: number;
}

export interface FindAllPurchaseRequestDetailMachineryUsedDTO {
  page?: number;
  pageSize?: number;
  idPurchaseRequest?: number;
  // idPurchaseRequestDetailMachineryUsed?: number;
  // idMachineryType?: number;
  // machineryBrand?: string;
  // serial?: string;
  // idMachineryStatus?: number;
}

export interface FindAllPurchaseRequestDetailMachineryUsedDTOPs {
  idPurchaseRequest?: number;
}

export interface CreatePurchaseRequest {
  consecutive?: string;
  documentUrl?: string;
  idInput?: number;
  idWarehouse?: number;
  idSupplier?: number;
  purchaseRequest?: string;
  quantity?: string;
  price?: string;
  requestDocumentUrl?: string;
  isActive?: boolean;
}

export interface CreatePurchaseRequestWithItems {
  isActive?: boolean;
  purchaseRequest?: string;
  idWarehouse?: number;
  idSupplier?: number;
  items: Array<{
    idInput: number;
    quantity: number;
    price: number;
    originalPrice?: number | string;
    name?: string;
    subtotal?: number;
    unitOfMeasure?: string;
    notes?: string;
  }>;
}


export interface UpdatePurchaseRequestIn {
  data: UpdatePurchaseRequest;
  filePath?: string;
  fileExtension?: string;
  filePathRequest?: string;
  fileExtensionRequest?: string;
}

export interface CreatePurchaseRequestDetail {
  idPurchaseRequest: number;
  idInput: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePurchaseRequestDetailMachineryUsed {
  // idPurchaseRequestDetailMachineryUsed: number;
  idPurchaseRequest: number;
  idMachinery: number;
  idMachineryModel: number;
  idMachineryType: number;
  idMachineryStatus: number;
  idCostCenterProject: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePurchaseRequest {
  idPurchaseRequest: number;
  consecutive?: string;
  documentUrl?: string;
  idInput?: number;
  idWarehouse?: number;
  idSupplier?: number;
  purchaseRequest?: string;
  quantity?: string;
  price?: string;
  requestDocumentUrl?: string;
  isActive?: boolean;
}

export interface UpdatePurchaseRequestDetail {
  idPurchaseRequestDetail: number;
  idPurchaseRequest?: number;
  idInput?: number;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePurchaseRequestDetailMachineryUsed {
  idPurchaseRequestDetailMachineryUsed: number;
  idPurchaseRequest?: number;
  idMachinery?: number;
  idMachineryModel?: number;
  idMachineryType?: number;
  idMachineryStatus?: number;
  createdAt?: string;
  updatedAt?: string;
}