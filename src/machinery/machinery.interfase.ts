export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idMachinery?: number;
  idMachineryType?: number;
  idMachineryBrand?: number;
  serial?: string;
  idMachineryStatus?: number;
}

export interface CreateDTO {
  serial: string;
  description: string;
  price: string;
  idMachineryModel: number;
  idMachineryType: number;
  idMachineryBrand: number;
  idMachineryStatus: number;
  status?: string;
}

export interface MachineryLocationDTO {
  idMachinery: number;
  idProject: number;
  idEmployee: number;
  modificationDate: string;
  assignmentDate: string;
}

export interface UpdateDTO {
  idMachinery: number;
  serial?: string;
  description?: string;
  price?: string;
  idMachineryModel?: number;
  idMachineryType?: number;
  idMachineryBrand?: number;
  idMachineryStatus?: number;
  status?: string;
}

export interface MachineryMaintenanceDTO {
  idMachinery: number;
  maintenanceDate: string;
  maintenanceEffectiveDate: string;
  documentName: string;
}