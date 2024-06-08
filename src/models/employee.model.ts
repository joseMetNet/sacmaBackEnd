import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { User } from "./user.model";
import { Position } from "./position.model";

export class Employee extends Model {
  declare idEmployee: number;
  declare idUser: number;
  declare idEmergencyContact: number;
  declare idPosition: number;
  declare idContractType: number;
  declare entryDate: string;
  declare baseSalary: string;
  declare compensation: string;
  declare idPaymentType: number;
  declare idBankAccount: number;
  declare bankAccountNumber: string;
  declare idEps: number;
  declare idArl: number;
  declare severancePay: string;
  declare idPensionFund: number;
  declare idCompensationFund: string;
  declare idRequiredDocument: number;
}

Employee.init(
  {
    idEmployee: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idEmergencyContact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idContractType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    baseSalary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    compensation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idPaymentType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idBankAccount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idEps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idArl: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    severancePay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idPensionFund: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCompensationFund: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idRequiredDocument: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Employee",
    timestamps: true,
    paranoid: true,
  }
);

Employee.removeAttribute("id");

Employee.hasOne(User, {
  sourceKey: "idUser",
  foreignKey: "idUser",
});

Employee.hasOne(Position, {
  sourceKey: "idPosition",
  foreignKey: "idPosition",
});
