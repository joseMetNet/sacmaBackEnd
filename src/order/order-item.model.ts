import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class OrderItem extends Model {
  declare idOrderItem: number;
  declare idOrder: number;
  declare idOrderItemStatus: number;
  declare consecutive: string;
  declare documentUrl: string;
  declare createdAt: string;
  declare updatedAt: string;
}

OrderItem.init({
  idOrderItem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idOrderItemStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  consecutive: {
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
