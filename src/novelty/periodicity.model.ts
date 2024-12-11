import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Periodicity extends Model {
  declare idPeriodicity: number;
  declare periodicity: string;
}

Periodicity.init({
  idPeriodicity: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  periodicity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Periodicity",
  timestamps: false,
});