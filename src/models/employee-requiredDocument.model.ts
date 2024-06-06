import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { RequiredDocument } from "./required-document.model";

export class EmployeeRequiredDocument extends Model {
  declare idEmployeeRequiredDocument: number;
  declare idEmployee: number;
  declare idRequiredDocument: number;
}

EmployeeRequiredDocument.init({
  idEmployeeRequiredDocument: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idRequiredDocument: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_EmployeeRequiredDocument",
  timestamps: false
});

EmployeeRequiredDocument.hasMany(RequiredDocument, {
  sourceKey: "idRequiredDocument",
  foreignKey: "idRequiredDocument"
});
