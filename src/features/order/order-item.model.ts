import { DataTypes, Model } from "sequelize";
import { OrderItemStatus } from "./order-item-status.model";
import { CostCenterProject } from "../cost-center";
import { dbConnection } from "../../config";

export class OrderItem extends Model {
  declare idOrderItem: number;
  declare idOrderItemStatus: number;
  declare consecutive: string;
  declare documentUrl: string;
  declare orderDocumentUrl: string;
  declare idEmployee: number;
  declare idCostCenterProject: number;
  declare address: string;
  declare orderRequest: string;
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
  orderRequest: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  orderDocumentUrl: {
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

OrderItem.hasOne(OrderItemStatus, {
  foreignKey: "idOrderItemStatus",
  sourceKey: "idOrderItemStatus"
});

OrderItem.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject"
});