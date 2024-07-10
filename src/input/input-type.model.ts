import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class InputType extends Model {
  declare idInputType: number;
  declare inputType: string;
}

InputType.init({
  idInputType: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  inputType: {
    type: DataTypes.STRING
  }
}, {
  sequelize: dbConnection,
  tableName: 'TB_InputType',
  timestamps: false,
});