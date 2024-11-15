
export interface CreateQuotationItemDTO {
  idQuotation: number;
  description: string;
  quantity: number;
  price: number;
}

export interface UpdateQuotationItemDTO {
  idQuotationItem: number;
  idQuotation?: number;
  description?: string;
  quantity?: number;
  price?: number;
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
