import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class InputDocumentType extends Model {
  declare idInputDocumentType: number;
  declare InputDocumentType: string;
}

InputDocumentType.init({
  idInputDocumentType: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  InputDocumentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_InputDocumentType",
  timestamps: false,
});