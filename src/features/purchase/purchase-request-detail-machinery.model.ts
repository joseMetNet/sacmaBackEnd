import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { PurchaseRequest } from "./purchase-request.model";
import { Machinery } from "../machinery/machinery.model"
import { MachineryStatus } from "../machinery/machinery-status.model";
import { MachineryType } from "../machinery/machinery-type.model";
import { MachineryModel } from "../machinery/machinery-model.model";

export class PurchaseRequestDetailMachineryUsed extends Model {
  declare idPurchaseRequestDetailMachineryUsed: number;
  declare idPurchaseRequest: number;
  declare createdAt: string;
  declare updatedAt: string;
}

PurchaseRequestDetailMachineryUsed.init({
  idPurchaseRequestDetailMachineryUsed: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idPurchaseRequest: {
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
  tableName: "TB_PurchaseRequestDetailMachineryUsed"
});

PurchaseRequestDetailMachineryUsed.hasOne(PurchaseRequest, {
  foreignKey: "idPurchaseRequest",
  sourceKey: "idPurchaseRequest"
});

PurchaseRequestDetailMachineryUsed.hasOne(Machinery, {
  foreignKey: "idMachinery",
  sourceKey: "idMachinery"
});
PurchaseRequestDetailMachineryUsed.hasOne(MachineryModel, {
  foreignKey: "idMachineryModel",
  sourceKey: "idMachineryModel"
});
PurchaseRequestDetailMachineryUsed.hasOne(MachineryType, {
  foreignKey: "idMachineryType",
  sourceKey: "idMachineryType"
});
PurchaseRequestDetailMachineryUsed.hasOne(MachineryStatus, {
  foreignKey: "idMachineryStatus",
  sourceKey: "idMachineryStatus"
});