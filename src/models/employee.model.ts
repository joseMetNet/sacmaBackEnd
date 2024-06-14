import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { User } from "./user.model";
import { Position } from "./position.model";
import { ContractType } from "./contract-type.model";
import { PaymentType } from "./payment-type.model";
import { Arl } from "./arl.model";
import { Eps } from "./eps.model";
import { BankAccount } from "./bank-account.model";
import { CompensationFund } from "./compensation-fund.model";
import { EmployeeRequiredDocument } from "./employee-requiredDocument.model";
import { EmergencyContact } from "./emergency-contact.model";
import { PensionFund } from "./pension-fund.model";

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


Employee.hasOne(ContractType, {
  sourceKey: "idContractType",
  foreignKey: "idContractType",
});

Employee.hasOne(PaymentType, {
  sourceKey: "idPaymentType",
  foreignKey: "idPaymentType",
});

Employee.hasOne(Arl, {
  sourceKey: "idArl",
  foreignKey: "idArl",
});

Employee.hasOne(Eps, {
  sourceKey: "idEps",
  foreignKey: "idEps",
});

Employee.hasOne(EmergencyContact, {
  sourceKey: "idEmergencyContact",
  foreignKey: "idEmergencyContact"
});

Employee.hasOne(BankAccount, {
  sourceKey: "idBankAccount",
  foreignKey: "idBankAccount"
});

Employee.hasOne(CompensationFund, {
  sourceKey: "idCompensationFund",
  foreignKey: "idCompensationFund"
});

Employee.hasOne(PensionFund, {
  sourceKey: "idPensionFund",
  foreignKey: "idPensionFund"
});

Employee.hasMany(EmployeeRequiredDocument, {
  sourceKey: "idEmployee",
  foreignKey: "idEmployee"
});
