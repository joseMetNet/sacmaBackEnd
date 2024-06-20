import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "./employee.model";
import { Novelty } from "./novelty.model";

export class EmployeeNovelty extends Model {
  declare idEmployeeNovelty: number;
  declare idNovelty: number;
  declare idEmployee: number;
  declare installment: number;
  declare loanValue: string;
  declare observation: string;
  declare documentUrl: string;
  declare endAt: string;
  declare createdAt: string;
}

EmployeeNovelty.init({
  idEmployeeNovelty: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idNovelty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  installment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  loanValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
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