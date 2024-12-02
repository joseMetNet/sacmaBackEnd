export interface CreateQuotationDTO {
  name: string;
  idResponsable: number;
  builder?: string;
  idQuotationStatus?: number;
  builderAddress?: string;
  projectName?: string;
  itemSummary?: string;
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
}

export interface findAllQuotationDTO {
  page?: number;
  pageSize?: number;
  responsible?: string;
}

export interface findAllQuotationItemDTO {
  page?: number;
  pageSize?: number;
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

export interface QuotationItemDTO {
  idQuotationItem: number;
  idQuotation: number;
  description: string;
  quantity: number;
  price: number;
}

export interface QuotationItemFindAllDTO {
  rows: QuotationItemDTO[];
  count: number;
}

export interface QuotationItemDetailDTO {
  idQuotationItemDetail: number;
  idQuotationItem: number;
  idInput: number;
  quantity: string;
  totalCost: number;
}

export interface CreateQuotationItemDetailDTO {
  idQuotationItem: number;
  idInput: number;
}

export interface UpdateQuotationItemDetailDTO {
  idQuotationItemDetail: number;
  idQuotationItem?: number;
  idInput?: number;
  quantity?: string;
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
  tax: number;
}

export interface UpdateQuotationPercentageDTO {
  idQuotationPercentage: number;
  idQuotation?: number;
  administration?: number;
  unforeseen?: number;
  utility?: number;
  tax?: number;
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

export interface QuotationItemFindAllDTO {
  rows: QuotationItemDTO[];
  count: number;
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
  tax: string;
  unitValueAIUIncluded: string;
}