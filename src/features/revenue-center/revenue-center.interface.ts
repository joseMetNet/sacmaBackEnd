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