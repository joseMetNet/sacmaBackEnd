import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class PaymentType extends Model {
  declare idPaymentType: number;
  declare paymentType: string;
}

PaymentType.init({
  idPaymentType: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  paymentType: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_PaymentType",
  timestamps: false
});
