import { Model, DataTypes } from "sequelize";
import { dbConnection } from "../../config/database";
import { CostCenterProject } from "../cost-center";

export class RevenueCenter extends Model {
  declare idRevenueCenter: number;
  declare name: string;
  declare idCostCenterProject: number;
  declare fromDate: string;
  declare toDate: string;
  declare createdAt: string;
  declare updatedAt: string;
}

RevenueCenter.init(
  {
    idRevenueCenter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_RevenueCenter"
  }
);

RevenueCenter.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject"
});