export interface IUpdateEmployeeNovelty {
  idNovelty: number;
  idEmployee: number;
  loanValue?: string;
  observation?: string;
}

export interface ICreateEmployeeNovelty {
  idNovelty: number;
  idEmployee: number;
  createdAt: string;
  endAt: string;
  documentUrl?: string;
  loanValue?: string;
  installment?: number;
  observation?: string;
}

export interface IFindEmployeeRequest {
  page?: number;
  pageSize?: number;
  idNovelty?: number;
  firstName?: string;
  identityCardNumber? : string;
  noveltyYear? : string;
  noveltyMonth? : string;
}
