import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class ProviderContact extends Model {
  declare idProviderContact: number;
  declare idProvider: number;
  declare name: string;
  declare phoneNumber: string;
  declare email: string;
  declare position: string;
}

ProviderContact.init({
  idProviderContact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_ProviderContact",
  timestamps: false
});