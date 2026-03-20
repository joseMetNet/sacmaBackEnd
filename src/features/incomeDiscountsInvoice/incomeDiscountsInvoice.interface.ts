export interface IIncomeDiscountInvoice {
  idIncomeDiscountInvoice?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  value: number; // Obligatorio
  idExpenditureType: number; // Obligatorio
  idCostCenterProject: number; // Obligatorio
  idInvoice: number; // Obligatorio
  refundRequestDate?: Date; // Opcional con valor por defecto
  advance?: number;
  reteguarantee?: number;
  retesource?: number;
  reteica?: number;
  fic?: number;
  other?: number;
  totalDiscounts?: number;
  idIncome?: number;
}

export interface CreateIncomeDiscountInvoiceDTO {
  value: number; // Obligatorio
  idExpenditureType: number; // Obligatorio
  idCostCenterProject: number; // Obligatorio
  idInvoice: number; // Obligatorio
  refundRequestDate?: Date; // Opcional
  advance?: number;
  reteguarantee?: number;
  retesource?: number;
  reteica?: number;
  fic?: number;
  other?: number;
  totalDiscounts?: number;
  idIncome?: number;
}

export interface UpdateIncomeDiscountInvoiceDTO {
  idIncome: number; // Cambio: usar idIncome como identificador principal
  value?: number;
  idExpenditureType?: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  refundRequestDate?: Date;
  advance?: number;
  reteguarantee?: number;
  retesource?: number;
  reteica?: number;
  fic?: number;
  other?: number;
  isActive?: boolean;
  totalDiscounts?: number;
}

export interface FindAllIncomeDiscountInvoiceDTO {
  page?: number;
  pageSize?: number;
  idIncomeDiscountInvoice?: number;
  idExpenditureType?: number;
  idCostCenterProject?: number;
  idInvoice?: number;
  refundRequestDate?: Date;
  isActive?: boolean;
}