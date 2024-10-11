import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class WorkHour extends Model {
  declare idWorkHour: number;
  declare workHour: number;
}

WorkHour.init({
  idWorkHour: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  workHour: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_WorkHour",
  timestamps: false
});