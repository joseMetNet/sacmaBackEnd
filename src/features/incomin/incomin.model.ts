import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { ExpenditureType } from "../expenditure/expendityre-type.model";
import { CostCenterProject } from "../cost-center";
import { Invoice } from "../invoice/invoice.model";

export class Incomin extends Model {
  declare idIncome: number;
  declare idExpenditureType: number;
  declare idCostCenterProject: number;
  declare idInvoice: number;
  declare description: string;
  declare value: string;
  declare documentUrl: string;
  declare refundRequestDate: string;
  declare fromDate: string;
  declare toDate: string;
  declare orderNumber?: string;
  declare createdAt: string;
  declare updatedAt: string;
}

Incomin.init(
  {
    idIncome: {
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
      allowNull: true,
    },
    idInvoice: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    fromDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "TB_Income",
    timestamps: true,
  }
);

Incomin.hasOne(ExpenditureType, {
  sourceKey: "idExpenditureType",
  foreignKey: "idExpenditureType",
});

Incomin.hasOne(CostCenterProject, {
  sourceKey: "idCostCenterProject",
  foreignKey: "idCostCenterProject",
});

Incomin.hasOne(Invoice, {
  sourceKey: "idInvoice",
  foreignKey: "idInvoice",
});