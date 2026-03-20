import * as dtos from "./warehouse.interface";
import { WareHouse } from "./warehouse.model";

export class WareHouseRepository {

  findAll = (
    filter: { [key: string]: any } = {},
    limit?: number,
    offset?: number
  ) => {
    const queryOptions: any = {
      where: filter,
      order: [["createdAt", "DESC"]],
    };

    // Solo agregar limit y offset si están definidos (para paginación)
    if (limit !== undefined) {
      queryOptions.limit = limit;
    }
    if (offset !== undefined) {
      queryOptions.offset = offset;
    }

    return WareHouse.findAndCountAll(queryOptions);
  };

  findById = (id: number) => {
    return WareHouse.findByPk(id);
  };

  create = (warehouse: dtos.CreateWareHouse) => {
    return WareHouse.create({
      ...warehouse,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
  };

  update = (warehouse: dtos.UpdateWareHouse) => {
    return WareHouse.update({
      ...warehouse,
      updatedAt: new Date()
    }, { 
      where: { idWarehouse: warehouse.idWarehouse } 
    });
  };

  delete = (id: number) => {
    return WareHouse.destroy({ where: { idWarehouse: id } });
  };

  softDelete = (id: number) => {
    return WareHouse.update({
      isActive: false,
      updatedAt: new Date()
    }, { 
      where: { idWarehouse: id } 
    });
  };

  restore = (id: number) => {
    return WareHouse.update({
      isActive: true,
      updatedAt: new Date()
    }, { 
      where: { idWarehouse: id } 
    });
  };
}