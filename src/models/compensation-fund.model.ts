import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class CompensationFund extends Model {
  declare idCompensationFund: number;
  declare compensationFund: string;
}

CompensationFund.init(
  {
    idCompensationFund: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    compensationFund: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_CompensationFund",
    timestamps: false,
  }
);
