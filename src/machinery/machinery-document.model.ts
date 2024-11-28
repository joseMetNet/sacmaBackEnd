import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { MachineryDocumentType } from "./machinery-document-type.model";

export class MachineryDocument extends Model {
  declare idMachineryDocument: number;
  declare idMachinery: number;
  declare idMachineryDocumentType: number;
  declare documentUrl: string;
}

MachineryDocument.init({
  idMachineryDocument: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idMachinery: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryDocumentType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryDocument",
  timestamps: false
});

MachineryDocument.hasOne(MachineryDocumentType, {
  foreignKey: "idMachineryDocumentType",
  sourceKey: "idMachineryDocumentType"
});