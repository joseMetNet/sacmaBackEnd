import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Order extends Model {
  declare idOrder: number;
  declare address: string;
  declare phone: string;
  declare idEmployee: number;
  declare createdAt: string;
  declare updatedAt: string;
}

Order.init({
  idOrder: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idEmployee: {
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
  tableName: "TB_Order"
});
