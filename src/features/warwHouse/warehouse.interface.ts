export interface FindAllWareHouseDTO {
  page?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
}

export interface CreateWareHouse {
  name?: string;
  isActive?: boolean;
}

export interface UpdateWareHouse {
  idWarehouse: number;
  name?: string;
  isActive?: boolean;
}