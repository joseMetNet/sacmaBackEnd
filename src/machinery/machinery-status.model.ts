import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class MachineryStatus extends Model {
  declare idMachineryStatus: number;
  declare machineryStatus: string;
}

MachineryStatus.init({
  idMachineryStatus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  machineryStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryStatus",
  timestamps: false
});