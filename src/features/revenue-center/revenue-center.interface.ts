export interface IRevenueCenter {
  idRevenueCenter: number;
  name: string;
  idCostCenterProject: number;
  idRevenueCenterStatus: number;
  idQuotation: number;
  fromDate?: string;
  toDate?: string;
  createdAt: string;
  updatedAt: string;
  invoice?: string;
  spend?: string;
  utility?: string;
}

export interface IRevenueCenterCreate {
  name: string;
  idCostCenterProject: number;
  idRevenueCenterStatus: number;
  idQuotation: number;
  fromDate?: string;
  toDate?: string;
}

export interface IRevenueCenterUpdate {
  name?: string;
  idCostCenterProject?: number;
  idRevenueCenterStatus?: number;
  idQuotation?: number;
  fromDate?: string;
  toDate?: string;
  invoice?: string;   // nuevo
  spend?: string;     // nuevo
  utility?: string;   // nuevo
}

export interface IRelationsProjectItemsMaterialInvoice {
  idRelationsProjectItemsMaterialInvoice: number;
  idCostCenterProject: number | null;
  idInput: number;
  idRevenueCenter: number;
  idProjectItem: number;
  invoicedQuantity: number | null;
}

export interface IRelationsProjectItemsMaterialInvoiceCreate {
  idCostCenterProject?: number | null;
  idInput: number;
  idRevenueCenter: number;
  idProjectItem: number;
  invoicedQuantity?: number | null;
}

export interface IRelationsProjectItemsMaterialInvoiceUpdate {
  idRelationsProjectItemsMaterialInvoice: number;
  invoicedQuantity: number | null;
} 