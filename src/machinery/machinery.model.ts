import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Machinery extends Model {
  declare idMachinery: number;
  declare serial: string;
  declare description: string;
  declare price: string;
  declare imageUrl: string;
  declare idMachineryModel: number;
  declare idMachineryType: number;
  declare idMachineryBrand: number;
  declare idMachineryStatus: number;
  declare status: boolean;
}

Machinery.init({
  idMachinery: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idMachineryModel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryBrand: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Machinery",
  timestamps: false
});