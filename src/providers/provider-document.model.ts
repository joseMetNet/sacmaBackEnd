import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class ProviderDocumentType extends Model {
  declare idDocumentType: number;
  declare documentType: string;
}

ProviderDocumentType.init({
  idDocumentType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_ProviderDocumentType",
  timestamps: false
});