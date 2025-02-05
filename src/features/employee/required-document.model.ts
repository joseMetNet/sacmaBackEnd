import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class RequiredDocument extends Model {
  declare idRequiredDocument: number;
  declare requiredDocument: number;
}

RequiredDocument.init({
  idRequiredDocument: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  requiredDocument: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_RequiredDocument",
  timestamps: false
});
