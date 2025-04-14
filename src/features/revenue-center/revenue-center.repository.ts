import { RevenueCenter } from "./revenue-center.model";
import { IRevenueCenter } from "./revenue-center.interface";
import { CostCenterProject } from "../cost-center";

export class RevenueCenterRepository {

  findAll = (
    limit: number, 
    offset: number, 
    filter?: { [key: string]: any }
  ) => {
    return RevenueCenter.findAndCountAll({
      limit,
      offset,
      where: filter,
      include: [
        {
          model: CostCenterProject,
          required: true,
        },
      ],
    });
  };


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