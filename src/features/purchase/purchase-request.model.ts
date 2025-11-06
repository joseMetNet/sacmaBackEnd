import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { WareHouse } from "../warwHouse/warehouse.model";
import { Input } from "../input";
import { Supplier } from "../supplier/supplier.model";

export class PurchaseRequest extends Model {
  declare idPurchaseRequest: number;
  declare consecutive?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare documentUrl?: string;
  declare idInput?: number;
  declare idWarehouse?: number;
  declare idSupplier?: number;
  declare purchaseRequest?: string;
  declare quantity?: string;
  declare price?: string;
  declare requestDocumentUrl?: string;
  declare isActive?: boolean;
}

PurchaseRequest.init({
  idPurchaseRequest: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  consecutive: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  idInput: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idWarehouse: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idSupplier: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  purchaseRequest: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  quantity: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  price: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  requestDocumentUrl: {
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
  tableName: "TB_PurchaseRequest",
  schema: "mvp1"
});

// PurchaseRequest.belongsTo(WareHouse, {
//   foreignKey: "idWarehouse",
//   targetKey: "idWarehouse",
//   as: "WareHouse"
// });

// PurchaseRequest.belongsTo(Input, {
//   foreignKey: "idInput",
//   targetKey: "idInput",
//   as: "Input"
// });

// PurchaseRequest.belongsTo(Supplier, {
//   foreignKey: "idSupplier",
//   targetKey: "idSupplier",
//   as: "Supplier"
// });