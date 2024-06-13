import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "./employee.model";
import { Novelty } from "./novelty.model";

export class EmployeeNovelty extends Model {
  declare idEmployeeNovelty: number;
  declare idNovelty: number;
  declare idEmployee: number;
  declare loanValue: string;
  declare observation: string;
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
  },
  loanValue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_EmployeeNovelty",
  timestamps: true,
  paranoid: true
});

EmployeeNovelty.hasOne(Employee, {
  sourceKey: "idEmployee",
  foreignKey: "idEmployee"
});

EmployeeNovelty.hasOne(Novelty, {
  sourceKey: "idNovelty",
  foreignKey: "idNovelty"
});