export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idMachinery?: number;
  idMachineryType?: number;
  idMachineryBrand?: number;
  serial?: string;
  idMachineryStatus?: number;
}

export interface UploadMachineryDocumentDTO {
  idMachinery: number;
  idMachineryDocumentType: number;
}

export interface CreateDTO {
  serial: string;
  description: string;
  price: string;
  idMachineryModel: number;
  idMachineryType: number;
  idMachineryBrand: number;
  idMachineryStatus: number;
}

export interface MachineryLocationDTO {
  idMachinery: number;
  idProject: number;
  idEmployee: number;
  assignmentDate: string;
}

export interface CreateMachineryLocationDTO {
  idMachineryLocationHistory: number;
  idMachinery?: number;
  idProject?: number;
  idEmployee?: number;
  assignmentDate?: string;
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
}

export interface MachineryMaintenanceDTO {
  idMachinery: number;
  maintenanceDate: string;
  maintenanceEffectiveDate: string;
  documentName?: string;
}