import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
import { CostCenterProject } from "../cost-center";
import { ExpenditureItem } from "../expenditure/expenditure-item.model";
// import * as dtos from "../expenditure/expenditure.interface";
// import { Expenditure } from "../expenditure/expenditure.model";

import * as dtos from "./incomin.interface";
import { Incomin } from "./incomin.model";
import { ExpenditureType } from "../expenditure/expendityre-type.model";
import { Invoice } from "../invoice/invoice.model";

export class IncominRepository {
  async findAll(
    limit: number,
    offset: number,
    filter: { [key: string]: any }
  ) {
    return Incomin.findAndCountAll({
      include: [
        {
          model: ExpenditureType,
          required: true,
        },
        {
          model: CostCenterProject,
          required: false,
        },
        {
          model: Invoice,
          required: false,
        },
      ],
      limit,
      offset,
      where: filter,
      order: [["createdAt", "DESC"]],
    });
  }

  findAllValues(
  ) {
    const query = `
     SELECT distinct
    idCostCenterProject, 
    SUM(value) as totalValue
    FROM mvp1.TB_Expenditure    
    GROUP BY
    idCostCenterProject

   `;
    type result = {
      idCostCenterProject: number;
      totalValue: number;
    }
    return dbConnection.query<result>(query, {
      type: QueryTypes.SELECT,
    });
  }

  async findAllExpenditureItem(
    limit: number,
    offset: number,
    filter: { [key: string]: any }
  ) {
    return ExpenditureItem.findAndCountAll({
      include: [
        {
          model: CostCenterProject,
          required: false,
        },
      ],
      limit: limit === -1 ? undefined : limit,
      offset,
      where: filter,
    });
  }

  async findAllExpenditureType() {
    return ExpenditureType.findAll();
  }

  async findById(idIncome: number) {
    return Incomin.findByPk(idIncome, {
      include: [
        {
          model: ExpenditureType,
          required: true,
        },
        {
          model: CostCenterProject,
          required: false,
        },
        {
          model: Invoice,
          required: false,
        },
      ],
    });
  }

  async findExpenditureTypeById(idExpenditureType: number) {
    return ExpenditureType.findByPk(idExpenditureType);
  }

  async findByIdExpenditureItem(idExpenditure: number) {
    return ExpenditureItem.findByPk(idExpenditure, {
      include: [
        {
          model: CostCenterProject,
          required: false,
        },
      ],
    });
  }

  async create(data: dtos.CreateDTO) {
    return Incomin.create(data as any);
  }

  async createExpenditureItem(data: dtos.CreateExpenditureItemDTO
  ) {
    return ExpenditureItem.create(data as any);
  }

  async createExpenditureType(data: dtos.CreateExpenditureTypeDTO) {
    return ExpenditureType.create(data as any);
  }

}