import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class SeverancePay extends Model {
  declare idSeverancePay: number;
  declare severancePay: string;
}

SeverancePay.init({
  idSeverancePay: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  severancePay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_SeverancePay",
  timestamps: false,
});