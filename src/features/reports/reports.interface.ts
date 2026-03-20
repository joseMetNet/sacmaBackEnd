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
  totalHoursWorked: number;
  totalOvertimeHours: number;
  workTrackingCount: number;
  noveltyCount: number;
  noveltyLoanValue: number;
  projectCount: number;
  projectList: string;
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
  totalHoursWorked: number;
  totalOvertimeHours: number;
  totalNovelties: number;
  totalNoveltyLoanValue: number;
  totalProjectsAssignments: number;
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

export interface HoursPerProjectRow {
  idCostCenterProject: number;
  projectName: string;
  totalHoursWorked: number;
  totalOvertimeHours: number;
  totalEmployees: number;
}

export interface MonthlyTrendRow {
  monthStart: string;
  year: number;
  month: number;
  monthName: string;
  totalHoursWorked: number;
  totalOvertimeHours: number;
  totalNovelties: number;
  totalNoveltyLoanValue: number;
}

export interface EmployeeReportResult {
  employees: EmployeeReportRow[];
  kpis: EmployeeReportKpis | null;
  noveltiesByType: NoveltyByTypeRow[];
  employeesByContractType: ContractTypeRow[];
  hoursPerProject: HoursPerProjectRow[];
  monthlyTrend: MonthlyTrendRow[];
}
