export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  name?: string;
  nit?: string;
}

export interface FindAllCostCenterContactDTO {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface FindAllCostCenterProjectDTO {
  page?: number;
  pageSize?: number;
  idCostCenter?: number;
  name?: string;
  location?: string;
  address?: string;
  phone?: string;
}

export interface CreateCostCenterContactDTO {
  idCostCenter: number;
  name: string;
  address?: string;
  phone?: string;
  role?: string;
}

export interface CreateCostCenterProjectDTO {
  idCostCenter: number;
  name?: string;
  location?: string;
  address?: string;
  phone?: string;
}

export interface CreateCostCenterDTO {
  nit: string;
  name: string;
  phone?: string;
  imageUrl?: string;
}

export interface UpdateCostCenterDTO {
  idCostCenter: number;
  nit?: string;
  name?: string;
  phone?: string;
}

export interface UpdateCostCenterContactDTO {
  idCostCenterContact: number;
  idCostCenter?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface UpdateCostCenterProjectDTO {
  idCostCenterProject: number;
  idCostCenter?: number;
  name?: string;
  location?: string;
  address?: string;
  phone?: string;
}