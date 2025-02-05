import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class InputUnitOfMeasure extends Model {
  declare idInputUnitOfMeasure: number;
  declare unitOfMeasure: string;
}

InputUnitOfMeasure.init({
  idInputUnitOfMeasure: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  unitOfMeasure: {
    type: DataTypes.STRING
  }
}, {
  sequelize: dbConnection,
  tableName: 'TB_InputUnitOfMeasure',
  timestamps: false,
});