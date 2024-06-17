export interface IUpdateEmployeeNovelty {
  idNovelty: number;
  idEmployee: number;
  loanValue?: string;
  observation?: string;
}

export interface ICreateEmployeeNovelty {
  idNovelty: number;
  loanValue: number;
  idEmployee: number;
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
