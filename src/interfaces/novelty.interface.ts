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
