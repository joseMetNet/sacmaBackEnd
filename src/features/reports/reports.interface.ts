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

export interface IncomeByExpenditureTypeRow {
  idExpenditureType: number;
  expenditureType: string;
  totalRecords: number;
  totalIncome: number;
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

export interface ProjectItemBillingProgressRow {
  idProjectItem: number;
  idCostCenterProject: number;
  projectName: string;
  item: string | null;
  unitMeasure: string | null;
  contract: string | null;
  plannedQuantity: number;
  unitPrice: number;
  plannedTotal: number;
  totalInvoicedQuantity: number;
  totalInvoicedAmount: number;
  invoicedPct: number | null;
  pendingQuantity: number;
  pendingPct: number | null;
  linkedInvoices: number;
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

export interface StatementOfAccountsMonthlyRow {
  sectionName: string;
  rowName: string;
  Enero: number;
  Febrero: number;
  Marzo: number;
  Abril: number;
  Mayo: number;
  Junio: number;
  Julio: number;
  Agosto: number;
  Septiembre: number;
  Octubre: number;
  Noviembre: number;
  Diciembre: number;
}

export interface ExpenditureIncomeInvoiceReportResult {
  expendituresByType: ExpenditureByTypeRow[];
  incomesByExpenditureType: IncomeByExpenditureTypeRow[];
  incomesByInvoiceStatus: IncomeByInvoiceStatusRow[];
  topProjectsMostExpenditure: TopProjectExpenditureRow[];
  topProjectsLeastExpenditure: TopProjectExpenditureRow[];
  projectItemsBillingProgress: ProjectItemBillingProgressRow[];
  retentionKpis: RetentionKpisRow | null;
  statementOfAccountsMonthly: StatementOfAccountsMonthlyRow[];
}

// ─── CostCenterAnalytics Report ──────────────────────────────────────────────

export interface CostCenterAnalyticsSummaryRow {
  totalIncome: number;
  totalExpenditure: number;
  totalDirectExpenditure: number;
  totalIndirectExpenditure: number;
  totalLaborCost: number;
  totalOvertimeHours: number;
  totalWorkedDays: number;
  grossMargin: number;
  netMargin: number;
  grossMarginPct: number;
  netMarginPct: number;
}

export interface CostCenterAnalyticsProjectProfitabilityRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  TotalIncome: number;
  TotalExpenditure: number;
  DirectExpenditure: number;
  IndirectExpenditure: number;
  LaborCost: number;
  OvertimeHours: number;
  WorkedDays: number;
  GrossMargin: number;
  NetMargin: number;
  Profitability: "GANA" | "PIERDE";
  Why: string;
}

export interface CostCenterAnalyticsStageCostRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  idExpenditureType: number;
  StageOrExpenseType: string;
  ExpenditureClass: "DIRECTO" | "INDIRECTO";
  StageCost: number;
}

export interface CostCenterAnalyticsMonthlyTrendRow {
  year: number;
  month: number;
  income: number;
  expenditure: number;
  overtimeHours: number;
}

export interface CostCenterAnalyticsInvoicesByStatusRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  idInvoiceStatus: number;
  InvoiceStatus: string;
  InvoiceCount: number;
  InvoiceAmount: number;
}

export interface CostCenterAnalyticsContractAnalysisRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  Contract: string;
  idInvoiceStatus: number;
  InvoiceStatus: string;
  InvoiceCount: number;
  InvoiceTotal: number;
  FirstInvoiceDate: string;
  LastInvoiceDate: string;
  AvgInvoiceValue: number;
}

export interface CostCenterAnalyticsEmployeesByProjectRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  EmployeesWorked: number;
  EmployeeProjectWorkDays: number;
  TotalOvertimeHours: number;
  TotalLaborCost: number;
  AvgOvertimePerDay: number;
}

export interface CostCenterAnalyticsEmployeeProductivityRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  idEmployee: number;
  idUser: number | null;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  WorkedDays: number;
  OvertimeHours: number;
  LaborCost: number;
  AvgOvertimePerDay: number;
  WorkloadRankInProject: number;
}

export interface CostCenterAnalyticsContractConsolidatedRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  Contract: string;
  TotalInvoices: number;
  TotalInvoiceAmount: number;
  PaidInvoices: number;
  PaidInvoiceAmount: number;
  CancelledInvoices: number;
  CancelledInvoiceAmount: number;
  PaidInvoicePct: number;
  CancelledInvoicePct: number;
}

export interface CostCenterAnalyticsMaterialConsolidatedRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  MaterialAssignedQty: number;
  MaterialUsedQty: number;
  MaterialReturnedQty: number;
  MaterialInvoicedQty: number;
  NetMaterialOutQty: number;
  PendingToInvoiceQty: number;
}

export interface CostCenterAnalyticsMaterialDetailRow {
  idRevenueCenter: number;
  idCostCenterProject: number;
  ProjectName: string;
  idInput: number;
  MaterialName: string;
  Contract: string;
  quantityAssigned: number;
  quantityUsed: number;
  quantityReturned: number;
  quantityInvoiced: number;
  netSentQty: number;
  pendingToInvoiceQty: number;
}

export interface CostCenterAnalyticsReportResult {
  summary: CostCenterAnalyticsSummaryRow | null;
  profitabilityByProject: CostCenterAnalyticsProjectProfitabilityRow[];
  stageCostByProject: CostCenterAnalyticsStageCostRow[];
  monthlyTrend: CostCenterAnalyticsMonthlyTrendRow[];
  invoicesByStatus: CostCenterAnalyticsInvoicesByStatusRow[];
  contractAnalysis: CostCenterAnalyticsContractAnalysisRow[];
  employeesByProject: CostCenterAnalyticsEmployeesByProjectRow[];
  employeeProductivity: CostCenterAnalyticsEmployeeProductivityRow[];
  contractConsolidated: CostCenterAnalyticsContractConsolidatedRow[];
  materialConsolidated: CostCenterAnalyticsMaterialConsolidatedRow[];
  materialDetail: CostCenterAnalyticsMaterialDetailRow[];
}

export interface RevenueCenterCatalogRow {
  idRevenueCenter: number;
  name: string;
}

// ─── Quotations Report ───────────────────────────────────────────────────────

export interface QuotationReportRow {
  reportStartDate: string;
  reportEndDate: string;
  idQuotation: number;
  idResponsable: number;
  name: string;
  consecutive: string | null;
  builder: string | null;
  builderAddress: string | null;
  projectName: string | null;
  itemSummary: string | null;
  client: string | null;
  createdAt: string;
  updatedAt: string;
  idQuotationStatus: number | null;
  quotationStatus: string | null;
  quotedTotalCost: number;
  advanceValue: number;
  itemsCount: number;
  totalItemQuantity: number;
  totalItemAmount: number;
  itemDetailCount: number;
  totalInputQuantity: number;
  totalInputCost: number;
  perDiem: number;
  sisoValue: number;
  taxValue: number;
  commision: number;
  pettyCash: number;
  policyValue: number;
  utilityValue: number;
  commentsCount: number;
}

export interface QuotationReportKpisRow {
  reportStartDate: string;
  reportEndDate: string;
  totalQuotations: number;
  totalQuotedAmount: number;
  averageQuotedAmount: number | null;
  totalItems: number;
  totalItemDetails: number;
  totalInputCost: number;
  totalComments: number;
}

export interface QuotationByStatusRow {
  idQuotationStatus: number;
  quotationStatus: string;
  totalQuotations: number;
  totalQuotedAmount: number;
}

export interface QuotationPercentageRow {
  idQuotation: number;
  name: string;
  idQuotationPercentage: number | null;
  administrationPct: number | null;
  unforeseenPct: number | null;
  utilityPct: number | null;
  vatPct: number | null;
}

export interface QuotationCommentRow {
  idQuotationComment: number;
  idQuotation: number;
  name: string;
  idEmployee: number;
  firstName: string | null;
  lastName: string | null;
  comment: string;
  createdAt: string;
}

export interface QuotationItemDetailRow {
  idQuotation: number;
  name: string;
  idQuotationItem: number;
  item: string;
  technicalSpecification: string | null;
  unitMeasure: string | null;
  itemQuantity: number;
  itemUnitPrice: number;
  itemTotal: number;
  idQuotationItemDetail: number | null;
  idInput: number | null;
  inputName: string | null;
  inputQuantity: number | null;
  inputCost: number | null;
  inputPerformance: number | null;
  inputTotalCost: number | null;
}

export interface QuotationsReportResult {
  quotations: QuotationReportRow[];
  kpis: QuotationReportKpisRow | null;
  quotationsByStatus: QuotationByStatusRow[];
  quotationPercentages: QuotationPercentageRow[];
  quotationComments: QuotationCommentRow[];
  quotationItemsDetail: QuotationItemDetailRow[];
}

// ─── InventoryWarehouseMovement Report ──────────────────────────────────────

export interface InventoryStockRow {
  reportStartDate: string;
  reportEndDate: string;
  idInventory: number;
  idWarehouse: number;
  warehouseName: string | null;
  idInput: number;
  inputName: string | null;
  quantityAvailable: number;
  quantityReserved: number;
  quantityTotal: number;
  averageCost: number | null;
  lastMovementDate: string | null;
  updatedAt: string;
}

export interface InventoryMovementRow {
  reportStartDate: string;
  reportEndDate: string;
  idInventoryMovement: number;
  idInventory: number | null;
  idPurchaseRequest: number | null;
  idPurchaseRequestDetail: number | null;
  idCostCenterProject: number | null;
  projectName: string | null;
  idInput: number | null;
  inputName: string | null;
  idWarehouse: number | null;
  warehouseName: string | null;
  movementType: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
  stockBefore: number | null;
  stockAfter: number | null;
  remarks: string | null;
  documentReference: string | null;
  movementDate: string;
  dateMovement: string | null;
  createdAt: string;
  createdBy: number | null;
  idReturnReason: number | null;
  reasonCode: string | null;
  reasonName: string | null;
}

export interface InventoryMovementKpisRow {
  reportStartDate: string;
  reportEndDate: string;
  totalMovements: number;
  totalEntriesQty: number;
  totalExitsQty: number;
  totalReturnsQty: number;
  totalEntriesAmount: number;
  totalExitsAmount: number;
  totalReturnsAmount: number;
}

export interface InventoryByWarehouseRow {
  idWarehouse: number | null;
  warehouseName: string;
  movements: number;
  totalQty: number;
  totalAmount: number;
}

export interface InventoryReturnReasonRow {
  idReturnReason: number;
  reasonCode: string;
  reasonName: string;
  totalReturns: number;
  totalReturnedQty: number;
  totalReturnedAmount: number;
}

export interface InventoryWarehouseMovementReportResult {
  stock: InventoryStockRow[];
  movements: InventoryMovementRow[];
  kpis: InventoryMovementKpisRow | null;
  movementsByWarehouse: InventoryByWarehouseRow[];
  returnReasons: InventoryReturnReasonRow[];
}

// ─── PurchasingSupply Report ─────────────────────────────────────────────

export interface PurchaseRequestRow {
  reportStartDate: string;
  reportEndDate: string;
  idPurchaseRequest: number;
  consecutive: string | null;
  createdAt: string;
  updatedAt: string;
  requestDate: string;
  idInput: number | null;
  inputName: string | null;
  idWarehouse: number | null;
  warehouseName: string | null;
  idSupplier: number | null;
  supplierName: string | null;
  idPurchaseRequestStatus: number | null;
  purchaseRequestStatus: string | null;
  purchaseRequest: string | null;
  quantity: string | null;
  price: string | null;
  quantityValue: number | null;
  priceValue: number | null;
  totalAmount: number | null;
  movementType: string;
  isActive: boolean | null;
}

export interface PurchaseRequestDetailRow {
  reportStartDate: string;
  reportEndDate: string;
  idPurchaseRequestDetail: number;
  idPurchaseRequest: number;
  consecutive: string | null;
  createdAt: string;
  detailDate: string;
  idInput: number | null;
  inputName: string | null;
  idWarehouse: number | null;
  warehouseName: string | null;
  idSupplier: number | null;
  supplierName: string | null;
  purchaseRequest: string | null;
  quantity: string | null;
  price: string | null;
  quantityValue: number | null;
  priceValue: number | null;
  totalAmount: number | null;
  movementType: string;
  isActive: boolean | null;
}

export interface PurchasingSupplyKpisRow {
  reportStartDate: string;
  reportEndDate: string;
  totalRequests: number;
  totalRequestAmount: number;
  averageRequestAmount: number | null;
  totalEntryAmount: number;
  totalExitAmount: number;
  totalReturnAmount: number;
}

export interface PurchaseBySupplierRow {
  idSupplier: number | null;
  supplierName: string;
  totalDetails: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface PurchaseRequestByStatusRow {
  idPurchaseRequestStatus: number;
  purchaseRequestStatus: string;
  totalRequests: number;
  totalAmount: number;
}

export interface PurchasingSupplyReportResult {
  purchaseRequests: PurchaseRequestRow[];
  purchaseRequestDetails: PurchaseRequestDetailRow[];
  kpis: PurchasingSupplyKpisRow | null;
  purchasesBySupplier: PurchaseBySupplierRow[];
  purchaseRequestsByStatus: PurchaseRequestByStatusRow[];
}

// ─── Suppliers Report ─────────────────────────────────────────────────────────

export interface SupplierPerformanceRow {
  reportStartDate: string;
  reportEndDate: string;
  idSupplier: number;
  socialReason: string;
  nit: string | null;
  status: boolean | null;
  totalRequests: number;
  totalRequestDetails: number;
  totalQuantity: number;
  totalAmount: number;
  firstPurchaseDate: string | null;
  lastPurchaseDate: string | null;
}

export interface SupplierContactRow {
  idSupplierContact: number;
  idSupplier: number;
  socialReason: string;
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
  position: string | null;
}

export interface SuppliersKpisRow {
  reportStartDate: string;
  reportEndDate: string;
  totalSuppliers: number;
  totalActiveSuppliers: number;
  totalInactiveSuppliers: number;
  totalRequests: number;
  totalRequestDetails: number;
  totalQuantity: number;
  totalAmount: number;
  averageAmountBySupplier: number | null;
}

export interface SupplierRankingRow {
  idSupplier: number;
  socialReason: string;
  totalRequests: number;
  totalQuantity: number;
  totalAmount: number;
  supplierRank: number;
}

export interface SuppliersReportResult {
  suppliers: SupplierPerformanceRow[];
  contacts: SupplierContactRow[];
  kpis: SuppliersKpisRow | null;
  ranking: SupplierRankingRow[];
}
