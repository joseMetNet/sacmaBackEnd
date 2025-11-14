import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Input } from "../input/input.model";
import { WareHouse } from "../warwHouse/warehouse.model";

export class Inventory extends Model {
  declare idInventory: number;
  declare idInput: number;
  declare idWarehouse: number;
  declare quantityAvailable: number;
  declare quantityReserved: number;
  declare quantityTotal?: number;
  declare averageCost?: number;
  declare lastMovementDate?: Date;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Inventory.init(
  {
    idInventory: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idInput: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idWarehouse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityAvailable: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    quantityReserved: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    quantityTotal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    averageCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    lastMovementDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Inventory",
    schema: "mvp1",
    timestamps: true,
  }
);

Inventory.belongsTo(Input, {
  foreignKey: "idInput",
  targetKey: "idInput",
  as: "Input",
});

Inventory.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse",
});
