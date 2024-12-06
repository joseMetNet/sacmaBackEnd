export interface CreateWorkTrackingDTO {
  idEmployee: number;
  idCostCenterProject: number;
  hoursWorked?: number;
  overtimeHour?: number;
  idNovelty?: number;
  createdAt?: string;
}

export interface WorkTrackingRDTO {
  idEmployee: number;
  workedDays: number;
  idUser: number;
  firstName: string;
  lastName: string;
  baseSalary: number;
  projectName: string;
}

export interface WorkTrackingRFindAllDTO {
  rows: WorkTrackingRDTO[];
  count: number;
}

export interface WorkTrackingFindAllDTO {
  rows: WorkTrackingDTO[];
  count: number;
}

export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  idEmployee?: number;
  employeeName?: string;
  idCostCenterProject?: number;
  projectName?: string;
  month?: number;
  year?: number;
}

export interface WorkTrackingByEmployeeDTO {
  projectName: string;
  firstName: string;
  lastName: string;
  identityCardNumber: string;
  position: string;
  workedDays: number;
  month: number;
  year: number;
}

export interface FindAllByEmployeeDTO {
  page?: number;
  pageSize?: number;
  idEmployee?: number;
  idCostCenterProject?: number;
  projectName?: string;
  createdAt?: string;
}

export interface FindAllDailyWorkTrackingDTO {
  page?: number;
  pageSize?: number;
  year?: string;
  month?: string;
  createdAt?: string;
}


export interface DeleteWorkTrackingDTO {
  createdAt: string;
}

export interface DeleteById {
  idWorkTracking: number;
}

export interface UpdateWorkTrackingDTO {
  idWorkTracking: number;
  idEmployee?: number;
  idCostCenterProject?: number;
  hoursWorked?: number;
  overtimeHour?: number;
  idNovelty?: number;
  createdAt?: string;
}

export interface WorkTrackingDTO {
  idWorkTracking: number;
  idEmployee: number;
  idCostCenterProject: number;
  hoursWorked: number;
  overtimeHour?: number;
  idNovelty?: number;
}