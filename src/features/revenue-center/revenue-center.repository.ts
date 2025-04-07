import { RevenueCenter } from "./revenue-center.model";
import { IRevenueCenter } from "./revenue-center.interface";

export class RevenueCenterRepository {
  async findAll(limit: number, offset: number, filter?: { [key: string]: any }): Promise<{ rows: IRevenueCenter[]; count: number }> {
    const { rows, count } = await RevenueCenter.findAndCountAll({
      limit,
      offset,
      where: filter,
    });
    return { rows, count };
  }

  async findById(idRevenueCenter: number): Promise<IRevenueCenter | null> {
    return await RevenueCenter.findByPk(idRevenueCenter);
  }

  async create(data: Omit<IRevenueCenter, "idRevenueCenter" | "createdAt" | "updatedAt">): Promise<IRevenueCenter> {
    return await RevenueCenter.create(data);
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