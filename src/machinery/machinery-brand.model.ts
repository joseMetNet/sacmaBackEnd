import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class MachineryBrand extends Model{
  declare idMachineryBrand: number;
  declare machineryBrand: string;
}

MachineryBrand.init({
  idMachineryBrand: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  machineryBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryBrand",
  timestamps: false,
});
