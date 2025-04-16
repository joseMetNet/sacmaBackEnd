import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Input } from "../input";
import { OrderItem } from "./order-item.model";

export class OrderItemDetail extends Model {
  declare idOrderItemDetail: number;
  declare idOrderItem: number;
  declare idInput: number;
  declare quantity: number;
  declare createdAt: string;
  declare updatedAt: string;
}

OrderItemDetail.init({
  idOrderItemDetail: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idOrderItem: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idInput: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: "TB_OrderItemDetail"
});

OrderItemDetail.hasOne(Input, {
  foreignKey: "idInput",
  sourceKey: "idInput",
});

OrderItemDetail.hasOne(OrderItem, {
  foreignKey: "idOrderItem",
  sourceKey: "idOrderItem"
});
