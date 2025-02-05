import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class MachineryModel extends Model {
  declare idMachineryModel: number;
  declare machineryModel: string;
}

MachineryModel.init({
  idMachineryModel: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  machineryModel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryModel",
  timestamps: false,
});