export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface CreateInputDTO {
  name: string;
  idInputType: number;
  code: string;
  idInputUnitOfMeasure: number;
  cost: string;
  idSupplier: number;
  performance: string;
  price: string;
}

export interface UpdateInputDTO {
  idInput: number;
  name?: string;
  idInputType?: number;
  code?: string;
  idInputUnitOfMeasure?: number;
  cost?: string;
  idSupplier?: number;
  performance?: string;
  price?: string;
}