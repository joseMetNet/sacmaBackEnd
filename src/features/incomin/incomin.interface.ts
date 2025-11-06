export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idExpenditureType?: number;
  consecutive?: string;
  idCostCenterProject?: number;
  idInvoice?: number;
  month?: number;
  year?: number;
}

export interface FindAllExpenditureItemDTO {
  page?: number;
  pageSize?: number;
  idExpenditure: number;
  idExpentitureType?: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  consecutive?: string;
}

export interface CreateDTO {
  idExpenditureType: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  description: string;
  value: string;
  documentUrl?: string;
  refundRequestDate?: string;
  fromDate?: string;
  toDate?: string;
  createdAt?: string;
  orderNumber?: string;

  advance?: number;
  reteguarantee?: number;
  retesource?:  number;
  reteica?: number;
  fic?: number;
  other?: number;
  totalDiscounts?: number;
}

export interface CreateExpenditureItemDTO {
  idExpenditure: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  value: string;
  description: string;
  createdAt?: string;
  totalDiscounts?: number;
}

export interface CreateExpenditureTypeDTO {
  expenditureType: string;
}

export interface UpdateExpenditureTypeDTO {
  idExpenditureType: number;
  expenditureType: string;
}

export interface UpdateDTO {
  idIncome: number;
  idExpenditureType?: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  description?: string;
  value?: string;
  documentUrl?: string;
  refundRequestDate?: string;
  fromDate?: string;
  toDate?: string;
  orderNumber?: string;
  advance?: number;
  reteguarantee?: number;
  retesource?: number;
  reteica?: number;
  fic?: number;
  other?: number;
  totalDiscounts?: number;
}

export interface UpdateExpenditureItemDTO {
  idExpenditureItem: number;
  idExpenditure?: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  value?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  totalDiscounts?: number;
}