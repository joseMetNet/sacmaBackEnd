import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class Arl extends Model {
  declare idArl: number;
  declare arl: string;
}

Arl.init({
  idArl: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Arl",
  timestamps: false,
});