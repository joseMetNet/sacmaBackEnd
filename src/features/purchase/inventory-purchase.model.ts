import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { WareHouse } from "../warwHouse/warehouse.model";

export class InventoryPurchase extends Model {
  declare idInventoryPurchase: number;
  declare idWarehouse: number;
  declare averageCost: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

InventoryPurchase.init(
  {
    idInventoryPurchase: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idWarehouse: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    averageCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_InventoryPurchase",
    schema: "mvp1",
    timestamps: true,
  }
);
InventoryPurchase.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse"
});