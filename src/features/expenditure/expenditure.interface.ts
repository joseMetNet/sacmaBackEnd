export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idExpenditureType?: number;
  consecutive?: string;
  idCostCenterProject?: number;
  month?: number;
  year?: number;
}

export interface FindAllExpenditureItemDTO {
  page?: number;
  pageSize?: number;
  idExpenditure: number;
  idExpentitureType?: number;
  idCostCenterProject?: number;
  consecutive?: string;
}

export interface CreateDTO {
  idExpenditureType: number;
  idCostCenterProject?: number;
  description: string;
  value: string;
  documentUrl?: string;
  refundRequestDate?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreateExpenditureItemDTO {
  idExpenditure: number;
  idCostCenterProject?: number;
  value: string;
  description: string;
}

export interface CreateExpenditureTypeDTO {
  expenditureType: string;
}

export interface UpdateExpenditureTypeDTO {
  idExpenditureType: number;
  expenditureType: string;
}

export interface UpdateDTO {
  idExpenditure: number;
  idExpenditureType?: number;
  idCostCenterProject?: number;
  description?: string;
  value?: string;
  documentUrl?: string;
  refundRequestDate?: string;
  fromDate?: string;
  toDate?: string;
}

export interface UpdateExpenditureItemDTO {
  idExpenditureItem: number;
  idExpenditure?: number;
  idCostCenterProject?: number;
  value?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}