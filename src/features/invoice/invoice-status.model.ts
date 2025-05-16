import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class InvoiceStatus extends Model {
  declare idInvoiceStatus: number;
  declare status: string;
}

InvoiceStatus.init({
  idInvoiceStatus: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_InvoiceStatus",
  timestamps: false
}); 