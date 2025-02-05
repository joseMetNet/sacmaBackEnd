import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class SupplierContact extends Model {
  declare idSupplierContact: number;
  declare idSupplier: number;
  declare name: string;
  declare phoneNumber: string;
  declare email: string;
  declare position: string;
}

SupplierContact.init({
  idSupplierContact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idSupplier: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_SupplierContact",
  timestamps: false
});