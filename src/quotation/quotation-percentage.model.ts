import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class QuotationPercentage extends Model {
  declare idQuotationPercentage: number;
  declare idQuotation: number;
  declare administration: number;
  declare unforeseen: number;
  declare utility: number;
  declare vat: number;
}

QuotationPercentage.init({
  idQuotationPercentage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idQuotation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  administration: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  unforeseen: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  utility: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  vat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_QuotationPercentage",
  timestamps: false,
});