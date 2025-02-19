import { CostCenterProject } from "../cost-center";
import { ExpenditureItem } from "./expenditure-item.model";
import * as dtos from "./expenditure.interface";
import { Expenditure } from "./expenditure.model";
import { ExpenditureType } from "./expendityre-type.model";

export class ExpenditureRepository {
  async findAll(
    limit: number,
    offset: number,
    filter: {[key: string]: any}
  ) {
    return Expenditure.findAndCountAll({
      include: [
        {
          model: ExpenditureType,
          required: true,
        },
        {
          model: CostCenterProject,
          required: true,
        },
      ],
      limit,
      offset,
      where: filter,
    });
  }

  async findAllExpenditureItem(
    limit: number,
    offset: number,
    filter: {[key: string]: any}
  ) {
    return ExpenditureItem.findAndCountAll({
      include: [
        {
          model: CostCenterProject,
          required: true,
        },
      ],
      limit: limit === -1 ? undefined : limit,
      offset,
      where: filter,
    });
  }

  async findById(idExpenditure: number) {
    return Expenditure.findByPk(idExpenditure, {
      include: [
        {
          model: ExpenditureType,
          required: true,
        },
        {
          model: CostCenterProject,
          required: true,
        },
      ],
    });
  }

  async findByIdExpenditureItem(idExpenditure: number) {
    return ExpenditureItem.findByPk(idExpenditure, {
      include: [
        {
          model: CostCenterProject,
          required: true,
        },
      ],
    });
  }

  async create(data: dtos.CreateDTO) {
    return Expenditure.create(data as any);
  }

  async createExpenditureItem(data: dtos.CreateExpenditureItemDTO
  ) {
    return ExpenditureItem.create(data as any);
  }

}