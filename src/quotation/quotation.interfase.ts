export interface CreateQuotationDTO {
  name: string;
  idResponsable: number;
  builder?: string;
  idQuotationStatus?: number;
  builderAddress?: string;
  projectName?: string;
  itemSummary?: string;
  perDiem?: string;
  sisoNumber?: string;
  advance?: string;
  client?: string;
  executionTime?: string;
  policy?: string;
  technicalCondition?: string;
}

export interface UpdateQuotationDTO {
  idQuotation: number;
  name?: string;
  idQuotationStatus?: number;
  idResponsable?: number;
  builder?: string;
  builderAddress?: string;
  projectName?: string;
  itemSummary?: string;
  perDiem?: string;
  sisoNumber?: string;
  client?: string;
  executionTime?: string;
  policy?: string;
  advance?: string;
  technicalCondition?: string;
}

export interface findAllQuotationDTO {
  page?: number;
  pageSize?: number;
  responsible?: string;
  consecutive?: string;
  quotationStatus?: string;
  builder?: string;
}

export interface findAllQuotationItemDTO {
  page?: number;
  pageSize?: number;
  idQuotation: number;
}

export interface findAllQuotationItemDetailDTO {
  page?: number;
  pageSize?: number;
  idQuotationItem: number;
}

export interface UpdateQuotationStatusDTO {
	idQuotation: number;
	idQuotationStatus: number;
}

export interface CreateQuotationItemDTO {
  idQuotation: number;
  item: string;
  technicalSpecification: string;
  unitMeasure: string;
  quantity: string;
  unitPrice?: string;
  total?: string;
}

export interface QuotationItemDetailDTO {
  idQuotationItemDetail: number;
  idQuotationItem: number;
  idInput: number;
  quantity: string;
  performance: string;
  cost: number;
  totalCost: number;
}

export interface CreateQuotationItemDetailDTO {
  idQuotationItem: number;
  idInput: number;
  performance?: string;
  price?: string;
}

export interface UpdateQuotationItemDetailDTO {
  idQuotationItemDetail: number;
  idQuotationItem?: number;
  idInput?: number;
  quantity?: string;
  performance?: string;
  price?: string;
  totalCost?: string;
}

export interface QuotationItemDetailFindAllDTO {
  rows: QuotationItemDetailDTO[];
  count: number;
}

export interface CreateQuotationPercentageDTO {
  idQuotation: number;
  administration: number;
  unforeseen: number;
  utility: number;
  vat: number;
}

export interface CreateQuotationAdditionalCostDTO {
  idQuotation: number;
  perDiem: number;
  sisoValue: number;
  tax: number;
  commision: number;
  pettyCash: number;
  policy: number;
  utility: number;
}

export interface UpdateQuotationPercentageDTO {
  idQuotationPercentage: number;
  idQuotation?: number;
  administration?: number;
  unforeseen?: number;
  utility?: number;
  vat?: number;
}

export interface UpdateQuotationItemDTO {
  idQuotationItem: number;
  idQuotation?: number;
  item?: string;
  technicalSpecification?: string;
  unitMeasure?: string;
  quantity?: string;
  unitPrice?: string;
  total?: string;
}

export interface QuotationItemDTO {
  idQuotationItem: number;
  idQuotation: number;
  description: string;
  quantity: number;
  price: number;
}

export interface CreateQuotationCommentDTO {
  idQuotation: number;
  idEmployee: number;
  comment: string;
  createdAt?: string;
}

export interface UpdateQuotationCommentDTO {
  idQuotationComment: number;
  idQuotation?: number;
  idEmployee?: number;
  comment?: string;
  createdAt?: string;
}

export interface FindAllQuotationCommentDTO {
  page?: number;
  pageSize?: number;
  idQuotation: number;
}

export interface QuotationSummaryDTO {
  unitValueAIU: string;
  administration: string;
  unforeseen: string;
  utility: string;
  vat: string;
  unitValueAIUIncluded: string;
  totalValue: string;
}

export interface QuotationAdditionalCostSummaryDTO {
  perDiem: string;
  sisoValue: string;
  tax: string;
  commision: string;
  pettyCash: string;
  policy: string;
  utility: string;
  directCost: string;
}

export interface QuotationItemSummaryDTO {
  idQuotationItem: number;
  quantity: number;
  percentage: number;
  firstSum: number;
  unitValue: number;
  totalCost: number;
}