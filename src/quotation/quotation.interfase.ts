export interface CreateQuotationDTO {
  name: string;
  idResponsable: number;
}

export interface UpdateQuotationDTO {
  idQuotation: number;
  idResponsable?: number;
}

export interface QuotationDTO {
  idQuotation: number;
  idResponsable: number;
}

export interface findAllQuotationDTO {
  page?: number;
  pageSize?: number;
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
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface UpdateQuotationItemDTO {
  idQuotationItem: number;
  idQuotation?: number;
  item?: string;
  technicalSpecification?: string;
  unitMeasure?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
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
  quantity: number;
  totalCost: number;
}

export interface CreateQuotationItemDetailDTO {
  idQuotationItem: number;
  idInput: number;
  quantity: number;
}

export interface UpdateQuotationItemDetailDTO {
  idQuotationItemDetail: number;
  idQuotationItem?: number;
  idInput?: number;
  quantity?: number;
  totalCost?: number;
}

export interface QuotationItemDetailFindAllDTO {
  rows: QuotationItemDetailDTO[];
  count: number;
}