export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idExpenditureType?: number;
  consecutive?: string;
  idCostCenterProject?: number;
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
  refundRequestDate?: Date;
}

export interface CreateExpenditureItemDTO {
  idExpenditure: number;
  idCostCenterProject?: number;
  value: string;
  description: string;
}

export interface UpdateDTO {
  idExpenditure: number;
  idExpenditureType?: number;
  idCostCenterProject?: number;
  description?: string;
  value?: string;
  documentUrl?: string;
  refundRequestDate?: Date;
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