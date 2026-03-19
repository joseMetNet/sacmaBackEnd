import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { WareHouse } from "../warwHouse/warehouse.model";

export class InventoryPriceTotal extends Model {
  declare idInventoryPriceTotal: number;
  declare idWarehouse: number;
  declare averageCost: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

InventoryPriceTotal.init(
  {
    idInventoryPriceTotal: {
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
    tableName: "TB_InventoryPriceTotal",
    schema: "mvp1",
    timestamps: true,
  }
);
InventoryPriceTotal.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse"
});