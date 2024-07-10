import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { BankAccount, City, State } from "../models";
import { SupplierContact } from "./supplier-contact.model";
import { SupplierSupplierDocument } from "./supplier-supplier-document.model";

export class Supplier extends Model {
  declare idSupplier: number;
  declare socialReason: string;
  declare nit: string;
  declare telephone: string;
  declare phoneNumber: string;
  declare idState: number;
  declare idCity: number;
  declare address: string;
  declare status: boolean;
  declare imageProfileUrl?: string;
  declare idAccountType?: number;
  declare idBankAccount?: number;
  declare accountNumber?: string;
  declare accountHolder?: string;
  declare accountHolderId?: string;
  declare paymentMethod?: string;
  declare observation?: string;
}

Supplier.init({
  idSupplier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  socialReason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idState: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idCity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  imageProfileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idAccountType: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idBankAccount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accountHolder: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accountHolderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize: dbConnection,
  tableName: 'TB_Supplier',
  timestamps: true,
  paranoid: true
});

Supplier.hasOne(State, {
  foreignKey: 'idState',
  sourceKey: 'idState'
});

Supplier.hasOne(BankAccount, {
  foreignKey: 'idBankAccount',
  sourceKey: 'idBankAccount'
});

Supplier.hasOne(City, {
  foreignKey: 'idCity',
  sourceKey: 'idCity'
});

Supplier.hasMany(SupplierContact, {
  foreignKey: 'idSupplier',
  sourceKey: 'idSupplier'
});

Supplier.hasMany(SupplierSupplierDocument, {
  foreignKey: 'idSupplier',
  sourceKey: 'idSupplier'
});