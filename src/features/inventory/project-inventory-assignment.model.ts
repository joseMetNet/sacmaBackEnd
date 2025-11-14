import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Input } from "../input/input.model";
import { WareHouse } from "../warwHouse/warehouse.model";

export class ProjectInventoryAssignment extends Model {
  declare idProjectAssignment: number;
  declare idCostCenterProject: number;
  declare idInput: number;
  declare idWarehouse: number;
  declare quantityAssigned: number;
  declare quantityUsed: number;
  declare quantityReturned: number;
  declare quantityPending?: number;
  declare unitPrice?: number;
  declare totalCost?: number;
  declare assignmentDate?: Date;
  declare createdAt?: Date;
  declare createdBy?: string;
  declare status: string;
  declare isActive?: boolean;
}

ProjectInventoryAssignment.init(
  {
    idProjectAssignment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idInput: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idWarehouse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityAssigned: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    quantityUsed: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    quantityReturned: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    quantityPending: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    totalCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    assignmentDate: {
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
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Asignado",
      validate: {
        isIn: [["Asignado", "EnUso", "Completado", "Devuelto", "Cancelado"]],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_ProjectInventoryAssignment",
    schema: "mvp1",
    timestamps: false,
  }
);

ProjectInventoryAssignment.belongsTo(Input, {
  foreignKey: "idInput",
  targetKey: "idInput",
  as: "Input",
});

ProjectInventoryAssignment.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse",
});
