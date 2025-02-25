import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { ExpenditureType } from "./expendityre-type.model";
import { CostCenterProject } from "../cost-center";

export class Expenditure extends Model {
  declare idExpenditure: number;
  declare idExpenditureType: number;
  declare idCostCenterProject: number;
  declare description: string;
  declare value: string;
  declare documentUrl: string;
  declare refundRequestDate: string;
}

Expenditure.init(
  {
    idExpenditure: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idExpenditureType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundRequestDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Expenditure",
    timestamps: true,
  }
);

Expenditure.hasOne(ExpenditureType, {
  sourceKey: "idExpenditureType",
  foreignKey: "idExpenditureType",
});

Expenditure.hasOne(CostCenterProject, {
  sourceKey: "idCostCenterProject",
  foreignKey: "idCostCenterProject",
});