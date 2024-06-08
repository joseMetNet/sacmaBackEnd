import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Eps extends Model {
  declare idEps: number;
  declare eps: string;
}

Eps.init({
  idEps: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eps: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Eps",
  timestamps: false,
});