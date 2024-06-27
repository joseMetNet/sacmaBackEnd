export interface IFindEmployeePayrollRequest {
  idEmployee: number;
  page?: number;
  pageSize?: number;
  year?: number;
  month?: number;
}

export interface IUploadPayroll {
  idEmployee: number;
  paymentDate: string;
}

export interface IUpdatePayroll {
  idEmployeePayroll: number;
  paymentDate?: string;
}