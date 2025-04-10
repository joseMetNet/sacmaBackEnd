import { RevenueCenter } from "./revenue-center.model";
import { IRevenueCenter } from "./revenue-center.interface";

export class RevenueCenterRepository {
  async findAll(limit: number, offset: number, filter?: { [key: string]: any }): Promise<{ rows: IRevenueCenter[]; count: number }> {
    return await RevenueCenter.findAndCountAll({
      limit,
      offset,
      where: filter,
    });
  }

  async findById(idRevenueCenter: number): Promise<IRevenueCenter | null> {
    return await RevenueCenter.findByPk(idRevenueCenter);
  }

  async create(data: Partial<IRevenueCenter>): Promise<IRevenueCenter> {
    console.log("Creating revenue center with data:", data);
    return await RevenueCenter.create(data as any);
  }

  async update(idRevenueCenter: number, data: Partial<IRevenueCenter>): Promise<[number]> {
    return await RevenueCenter.update(data, {
      where: { idRevenueCenter },
    });
  }

  async delete(idRevenueCenter: number): Promise<number> {
    return await RevenueCenter.destroy({
      where: { idRevenueCenter },
    });
  }
} 