import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { ProviderDocumentType } from "./provider-document.model";

export class ProviderProviderDocument extends Model {
  declare idProviderProviderDocument: number;
  declare idProvider: string;
  declare idProviderDocumentType: number;
  declare documentUrl: string;
}

ProviderProviderDocument.init({
  idProviderProviderDocumentType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idProvider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idProviderDocumentType: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_ProviderProviderDocumentType",
  timestamps: false
});

ProviderProviderDocument.hasMany(ProviderDocumentType, {
  sourceKey: "idProviderDocumentType",
  foreignKey: "idDocumentType"
});