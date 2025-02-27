import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class ExpenditureType extends Model {
  declare idExpenditureType: number;
  declare expenditureType: string;
}

ExpenditureType.init(
  {
    idExpenditureType: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expenditureType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_ExpenditureType",
    timestamps: false,
  }
);