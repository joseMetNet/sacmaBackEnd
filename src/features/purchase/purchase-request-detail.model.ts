import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Input } from "../input";
import { PurchaseRequest } from "./purchase-request.model";

export class PurchaseRequestDetail extends Model {
  declare idPurchaseRequestDetail: number;
  declare idPurchaseRequest: number;
  declare idInput: number;
  declare quantity: number;
  declare createdAt: string;
  declare updatedAt: string;
}

PurchaseRequestDetail.init({
  idPurchaseRequestDetail: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idPurchaseRequest: {
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
  tableName: "TB_PurchaseRequestDetail"
});

PurchaseRequestDetail.hasOne(Input, {
  foreignKey: "idInput",
  sourceKey: "idInput",
});

PurchaseRequestDetail.hasOne(PurchaseRequest, {
  foreignKey: "idPurchaseRequest",
  sourceKey: "idPurchaseRequest"
});