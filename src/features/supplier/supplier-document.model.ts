import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class SupplierDocumentType extends Model {
  declare idDocumentType: number;
  declare documentType: string;
}

SupplierDocumentType.init({
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
  tableName: "TB_SupplierDocumentType",
  timestamps: false
});