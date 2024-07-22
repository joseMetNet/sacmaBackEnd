import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class EmployeePayroll extends Model {
  declare idEmployeePayroll: number;
  declare idEmployee: number;
  declare paymentDate: string;
  declare documentUrl: string;
}

EmployeePayroll.init({
  idEmployeePayroll: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_EmployeePayroll",
  timestamps: true,
  paranoid: true
});