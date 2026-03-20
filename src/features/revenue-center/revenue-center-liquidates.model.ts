import { Model, DataTypes } from "sequelize";
import { dbConnection } from "../../config/database";
import { CostCenterProject } from "../cost-center";
import { RevenueCenterStatus } from "./revenue-center-status-model";
import { Quotation } from "../quotation/quotation.model";

export class RevenueCenterLiquidation extends Model {
  declare idRevenueCenter: number;
  declare name: string;
  declare idCostCenterProject: number;
  declare idRevenueCenterStatus: number;
  declare idQuotation: number;
  declare fromDate?: string;
  declare toDate?: string;
  declare createdAt: string;
  declare updatedAt: string;
}

RevenueCenterLiquidation.init(
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
    idRevenueCenterStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idQuotation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoice: {                // nuevo campo
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0.0"
    },
    spend: {                  // nuevo campo
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0.0"
    },
    utility: {                //  nuevo campo
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0.0"
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
    tableName: "TB_RevenueCenter_Liquidation"
  }
);

RevenueCenterLiquidation.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject"
});

RevenueCenterLiquidation.hasOne(RevenueCenterStatus, {
  foreignKey: "idRevenueCenterStatus",
  sourceKey: "idRevenueCenterStatus"
});

RevenueCenterLiquidation.hasOne(Quotation, {
  sourceKey: "idQuotation",
  foreignKey: "idQuotation"
});