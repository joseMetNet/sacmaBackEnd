import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Input } from "../input";
import { PurchaseRequest } from "./purchase-request.model";

export class PurchaseRequestDetail extends Model {
  declare idPurchaseRequestDetail: number;
  declare idPurchaseRequest: number;
  declare idInput: number;
  declare idWarehouse?: number;
  declare idSupplier?: number;
  declare purchaseRequest?: string;
  declare quantity: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare price?: string;
  declare requestDocumentUrl?: string;
  declare documentUrl?: string;
  declare isActive?: boolean;
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
  idWarehouse: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idSupplier: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  purchaseRequest: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  quantity: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  requestDocumentUrl: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
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