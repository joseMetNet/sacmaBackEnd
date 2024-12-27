import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class OrderItemDetail extends Model {
  declare idOrderItemDetail: number;
  declare idOrderItem: number;
  declare description: string;
  declare unitMeasure: string;
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
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unitMeasure: {
    type: DataTypes.STRING,
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
