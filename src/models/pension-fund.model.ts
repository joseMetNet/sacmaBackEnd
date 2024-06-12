import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class PensionFund extends Model {
  declare idCompensationFund: number;
  declare pensionFund: string;
}

PensionFund.init(
  {
    idPensionFund: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pensionFund: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_PensionFund",
    timestamps: false,
  }
);