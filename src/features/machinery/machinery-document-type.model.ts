import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class MachineryDocumentType extends Model {
  declare idMachineryDocumentType: number;
  declare machineryDocumentType: number;
}

MachineryDocumentType.init({
  idMachineryDocumentType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  machineryDocumentType: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryDocumentType",
  timestamps: false
});