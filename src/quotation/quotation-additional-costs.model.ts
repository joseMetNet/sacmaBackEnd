import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class QuotationAdditionalCosts extends Model {
  declare idQuotation: number;
  declare perDiem: number;
  declare sisoValue: number;
  declare tax: number;
  declare commision: number;
  declare pettyCash: number;
  declare policy: number;
}

QuotationAdditionalCosts.init({
  idQuotation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
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