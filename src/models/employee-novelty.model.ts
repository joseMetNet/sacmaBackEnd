import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Novelty } from "./novelty.mode";

export class EmployeeNovelty extends Model {
  declare idEmployeeNovelty: number;
  declare idNovelty: number;
  declare idEmployee: number;
}

EmployeeNovelty.init({
  idEmployeeNovelty: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idNovelty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_EmployeeNovelty",
  timestamps: false
});

EmployeeNovelty.hasOne(Novelty, {
  sourceKey: "idNovelty",
  foreignKey: "idNovelty"
});
