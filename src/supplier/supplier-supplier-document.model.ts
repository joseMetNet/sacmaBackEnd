import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { SupplierDocumentType } from "./supplier-document.model";

export class SupplierSupplierDocument extends Model {
  declare idSupplierSupplierDocument: number;
  declare idSupplier: string;
  declare idSupplierDocumentType: number;
  declare documentUrl: string;
}

SupplierSupplierDocument.init({
  idSupplierSupplierDocumentType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idSupplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idSupplierDocumentType: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_SupplierSupplierDocumentType",
  timestamps: false
});

SupplierSupplierDocument.hasMany(SupplierDocumentType, {
  sourceKey: "idSupplierDocumentType",
  foreignKey: "idDocumentType"
});