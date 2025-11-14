import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Inventory } from "./inventory.model";
import { Input } from "../input/input.model";
import { WareHouse } from "../warwHouse/warehouse.model";

export class InventoryMovement extends Model {
  declare idInventoryMovement: number;
  declare idInventory: number;
  declare idPurchaseRequest?: number;
  declare idPurchaseRequestDetail?: number;
  declare idCostCenterProject?: number;
  declare idInput: number;
  declare idWarehouse: number;
  declare movementType: string;
  declare quantity: number;
  declare unitPrice?: number;
  declare totalPrice?: number;
  declare stockBefore?: number;
  declare stockAfter?: number;
  declare remarks?: string;
  declare documentReference?: string;
  declare dateMovement?: Date;
  declare createdAt?: Date;
  declare createdBy?: string;
  declare isActive?: boolean;
}

InventoryMovement.init(
  {
    idInventoryMovement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idInventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPurchaseRequest: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idPurchaseRequestDetail: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idInput: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idWarehouse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movementType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["Entrada", "Salida", "AsignacionProyecto", "DevolucionProyecto", "Ajuste", "Transferencia"]],
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    stockBefore: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    stockAfter: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    documentReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateMovement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_InventoryMovement",
    schema: "mvp1",
    timestamps: false,
  }
);

InventoryMovement.belongsTo(Inventory, {
  foreignKey: "idInventory",
  targetKey: "idInventory",
  as: "Inventory",
});

InventoryMovement.belongsTo(Input, {
  foreignKey: "idInput",
  targetKey: "idInput",
  as: "Input",
});

InventoryMovement.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse",
});
