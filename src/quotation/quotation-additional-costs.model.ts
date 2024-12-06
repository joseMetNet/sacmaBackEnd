import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class QuotationAdditionalCost extends Model {
  declare idQuotationAdditionalCost: number;
  declare idQuotation: number;
  declare perDiem: number;
  declare sisoValue: number;
  declare tax: number;
  declare commision: number;
  declare pettyCash: number;
  declare policy: number;
}

QuotationAdditionalCost.init({
  idQuotationAdditionalCost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  idQuotation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  perDiem: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sisoValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  commision: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pettyCash: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  policy: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_QuotationAdditionalCost",
  timestamps: false,
});