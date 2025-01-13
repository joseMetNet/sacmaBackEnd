import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class OrderItem extends Model {
  declare idOrderItem: number;
  declare idOrderItemStatus: number;
  declare consecutive: string;
  declare documentUrl: string;
  declare idEmployee: number;
  declare idCostCenterProject: number;
  declare address: string;
  declare phone: string;
  declare createdAt: string;
  declare updatedAt: string;
}

OrderItem.init({
  idOrderItem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idCostCenterProject: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idOrderItemStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  consecutive: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_OrderItem"
});
