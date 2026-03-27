export interface EmployeeReportRow {
  reportStartDate: string;
  reportEndDate: string;
  idEmployee: number;
  idUser: number;
  fullName: string;
  firstName: string;
  lastName: string;
  identityCardNumber: string;
  email: string;
  phoneNumber: string;
  employeeStatus: boolean;
  employeeStatusName: string;
  entryDate: string | null;
  baseSalary: string;
  compensation: string;
  baseSalaryValue: number;
  compensationValue: number;
  totalCompensation: number;
  idContractType: number | null;
  contractType: string | null;
  idPosition: number | null;
  position: string | null;
  idPaymentType: number | null;
  paymentType: string | null;
  idBankAccount: number | null;
  bankAccount: string | null;
  bankAccountNumber: string | null;
  idEps: number | null;
  eps: string | null;
  idArl: number | null;
  arl: string | null;
  idPensionFund: number | null;
  pensionFund: string | null;
  idSeverancePay: number | null;
  severancePay: string | null;
  idCompensationFund: number | null;
  compensationFund: string | null;
  noveltyCount: number;
  noveltyLoanValue: number;
}

export interface EmployeeReportKpis {
  reportStartDate: string;
  reportEndDate: string;
  totalEmployees: number;
  totalActiveEmployees: number;
  totalInactiveEmployees: number;
  totalBaseSalary: number;
  totalCompensation: number;
  averageBaseSalary: number;
  totalNovelties: number;
  totalNoveltyLoanValue: number;
}

export interface NoveltyByTypeRow {
  idNovelty: number;
  novelty: string;
  noveltyCount: number;
  noveltyLoanValue: number;
}

export interface ContractTypeRow {
  idContractType: number;
  contractType: string;
  totalEmployees: number;
}

export interface MonthlyTrendRow {
  monthStart: string;
  year: number;
  month: number;
  monthName: string;
  totalNovelties: number;
  totalNoveltyLoanValue: number;
}

export interface NoveltyDetailRow {
  idEmployeeNovelty: number;
  idEmployee: number;
  fullName: string;
  idNovelty: number;
  novelty: string | null;
  noveltyDate: string;
  endAt: string | null;
  installment: string | null;
  loanValue: string | null;
  observation: string | null;
  documentUrl: string | null;
  idPeriodicity: number | null;
}

export interface EmployeeReportResult {
  employees: EmployeeReportRow[];
  kpis: EmployeeReportKpis | null;
  noveltiesByType: NoveltyByTypeRow[];
  employeesByContractType: ContractTypeRow[];
  monthlyTrend: MonthlyTrendRow[];
  noveltyDetails: NoveltyDetailRow[];
}
