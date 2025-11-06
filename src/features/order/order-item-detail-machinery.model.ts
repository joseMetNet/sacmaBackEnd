import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { OrderItem } from "./order-item.model";
import { Machinery } from "../machinery/machinery.model"
import { MachineryStatus } from "../machinery/machinery-status.model";
import { MachineryType } from "../machinery/machinery-type.model";
import { MachineryModel } from "../machinery/machinery-model.model";

export class OrderItemDetailMachineryUsed extends Model {
  declare idOrderItemDetailMachineryUsed: number;
  declare idOrderItem: number;
  declare createdAt: string;
  declare updatedAt: string;
}

OrderItemDetailMachineryUsed.init({
  idOrderItemDetailMachineryUsed: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idOrderItem: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachinery: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryModel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idCostCenterProject: {
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
  tableName: "TB_OrderItemDetailMachineryUsed"
});

OrderItemDetailMachineryUsed.hasOne(OrderItem, {
  foreignKey: "idOrderItem",
  sourceKey: "idOrderItem"
});

OrderItemDetailMachineryUsed.hasOne(Machinery, {
  foreignKey: "idMachinery",
  sourceKey: "idMachinery"
});
OrderItemDetailMachineryUsed.hasOne(MachineryModel, {
  foreignKey: "idMachineryModel",
  sourceKey: "idMachineryModel"
});
OrderItemDetailMachineryUsed.hasOne(MachineryType, {
  foreignKey: "idMachineryType",
  sourceKey: "idMachineryType"
});
OrderItemDetailMachineryUsed.hasOne(MachineryStatus, {
  foreignKey: "idMachineryStatus",
  sourceKey: "idMachineryStatus"
});
