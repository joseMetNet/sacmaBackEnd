import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class AccountType extends Model {
  declare idAccountType: number;
  declare accountType: string;
}

AccountType.init({
  idAccountType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_AccountType",
  timestamps: false
});