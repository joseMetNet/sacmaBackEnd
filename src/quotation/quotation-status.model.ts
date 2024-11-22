import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class QuotationStatus extends Model {
  declare idQuotationStatus: number;
  declare quotationStatus: string;
}

QuotationStatus.init({
  idQuotationStatus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  quotationStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_QuotationStatus",
  timestamps: false,
});