import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class MachineryType extends Model {
  declare idMachineryType: number;
  declare machineryType: string;
}

MachineryType.init({
  idMachineryType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  machineryType: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryType",
  timestamps: false
});
