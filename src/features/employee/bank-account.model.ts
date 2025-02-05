import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class BankAccount extends Model {
  declare idBankAccount: number;
  declare bankAccount: string;
}

BankAccount.init({
  idBankAccount: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  bankAccount: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_BankAccount",
  timestamps: false
});
