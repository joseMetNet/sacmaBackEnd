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

// ─── ExpenditureIncomeInvoice Report ─────────────────────────────────────────

export interface MovementRow {
  reportStartDate: string;
  reportEndDate: string;
  movementType: "EXPENDITURE" | "INCOME";
  movementId: number;
  movementDate: string;
  createdAt: string;
  idCostCenterProject: number | null;
  projectName: string;
  idExpenditureType: number | null;
  expenditureType: string | null;
  idInvoice: number | null;
  invoiceNumber: string | null;
  idInvoiceStatus: number | null;
  invoiceStatus: string | null;
  client: string | null;
  orderNumber: string | null;
  description: string | null;
  amount: number | null;
  incomeAmount: number;
  expenditureAmount: number;
  fromDate: string | null;
  toDate: string | null;
  timeDays: number | null;
}

export interface ExpenditureIncomeKpis {
  reportStartDate: string;
  reportEndDate: string;
  totalMovements: number;
  totalExpenditures: number;
  totalIncomes: number;
  totalIncomeAmount: number;
  totalExpenditureAmount: number;
  netBalance: number;
  avgExpenditure: number | null;
  avgIncome: number | null;
  avgTimeDays: number | null;
}

export interface ExpenditureByTypeRow {
  idExpenditureType: number;
  expenditureType: string;
  totalRecords: number;
  totalExpenditure: number;
}

export interface IncomeByInvoiceStatusRow {
  idInvoiceStatus: number;
  invoiceStatus: string;
  totalRecords: number;
  totalIncome: number;
}

export interface ProjectBalanceRow {
  idCostCenterProject: number | null;
  projectName: string;
  totalIncome: number;
  totalExpenditure: number;
  projectBalance: number;
  hasOvercost: number;
  overcostAmount: number;
  plannedBudget: number;
  expenditureVsPlannedPct: number | null;
  incomeExpenseEquivalence: number | null;
  avgTimeDays: number | null;
}

export interface ExpenditureIncomeMonthlyTrendRow {
  monthStart: string;
  year: number;
  month: number;
  monthName: string;
  totalIncome: number;
  totalExpenditure: number;
  netBalance: number;
}

export interface TopProjectExpenditureRow {
  idCostCenterProject: number | null;
  projectName: string;
  totalExpenditure: number;
}

export interface InvoiceDeductionRow {
  idInvoice: number;
  invoiceNumber: string;
  contract: string | null;
  client: string | null;
  invoiceValue: number | null;
  idCostCenterProject: number | null;
  projectName: string;
  invoiceStatus: string;
  invoiceCreatedAt: string;
  totalIncomeRecords: number;
  totalRegisteredAmount: number;
  totalAdvance: number;
  totalReteguarantee: number;
  totalRetesource: number;
  totalReteica: number;
  totalFic: number;
  totalOther: number;
  totalDeductions: number;
  netAmount: number;
  deductionsPct: number | null;
}

export interface RetentionKpisRow {
  reportStartDate: string;
  reportEndDate: string;
  totalInvoicesWithIncome: number;
  totalGrossIncome: number;
  totalAdvance: number;
  totalReteguarantee: number;
  totalRetesource: number;
  totalReteica: number;
  totalFic: number;
  totalOther: number;
  totalDeductions: number;
  totalNetIncome: number;
  deductionsPct: number | null;
}

export interface ExpenditureIncomeInvoiceReportResult {
  movements: MovementRow[];
  kpis: ExpenditureIncomeKpis | null;
  expendituresByType: ExpenditureByTypeRow[];
  incomesByInvoiceStatus: IncomeByInvoiceStatusRow[];
  balanceByProject: ProjectBalanceRow[];
  monthlyTrend: ExpenditureIncomeMonthlyTrendRow[];
  topProjectsMostExpenditure: TopProjectExpenditureRow[];
  topProjectsLeastExpenditure: TopProjectExpenditureRow[];
  invoiceDeductions: InvoiceDeductionRow[];
  retentionKpis: RetentionKpisRow | null;
}
