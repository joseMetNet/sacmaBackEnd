import { QueryTypes } from "sequelize";
import { dbConnection } from "../../config";
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
    SELECT
    	te.idCostCenterProject, 
    	SUM(te.value) as totalValue
    FROM mvp1.TB_Expenditure te
    WHERE
       te.idExpenditureType IN (2, 26)
    GROUP BY
	  te.idCostCenterProject;`;
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
    filter: {[key: string]: any}
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

  async findById(idExpenditure: number) {
    return Expenditure.findByPk(idExpenditure, {
      include: [
        {
          model: ExpenditureType,
          required: true,
        },
        {
          model: CostCenterProject,
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
    return Expenditure.create(data as any);
  }

  async createExpenditureItem(data: dtos.CreateExpenditureItemDTO
  ) {
    return ExpenditureItem.create(data as any);
  }

  async createExpenditureType(data: dtos.CreateExpenditureTypeDTO) {
    return ExpenditureType.create(data as any);
  }

}