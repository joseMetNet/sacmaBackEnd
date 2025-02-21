import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { CostCenterProject } from "../cost-center";

export class ExpenditureItem extends Model{
  declare idExpenditureItem: number;
  declare idExpenditure: number;
  declare idCostCenterProject: number;
  declare value: string;
  declare description: string;
  declare createdAt: string;
  declare updatedAt: string;
}

ExpenditureItem.init({
  idExpenditureItem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idExpenditure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idCostCenterProject: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_ExpenditureItem",
  timestamps: true,
});

ExpenditureItem.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject",
});