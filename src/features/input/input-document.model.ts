import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { InputDocumentType } from "./input-docyment-type.model";

export class InputDocument extends Model {
  declare idInputDocument: number;
  declare idInput: number;
  declare documentUrl: string;
  declare idInputDocumentType: number;
}

InputDocument.init({
  idInputDocument: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idInput: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idInputDocumentType: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_InputDocument",
  timestamps: false,
});

InputDocument.hasOne(InputDocumentType, {
  sourceKey: "idInputDocumentType",
  foreignKey: "idInputDocumentType"
});