import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { ProjectInventoryAssignment } from "./project-inventory-assignment.model";

export class InventoryBalance extends Model {
  declare idBalance: number;
  declare idProjectAssignment: number;
  declare balance: number;
  declare createdAt: Date;
  declare createdBy?: string;
  declare remarks?: string;
}

InventoryBalance.init(
  {
    idBalance: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idProjectAssignment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_InventoryBalance",
    schema: "mvp1",
    timestamps: false,
  }
);

// Relación: InventoryBalance pertenece a ProjectInventoryAssignment
InventoryBalance.belongsTo(ProjectInventoryAssignment, {
  foreignKey: "idProjectAssignment",
  targetKey: "idProjectAssignment",
  as: "ProjectAssignment",
});

// Relación inversa: ProjectInventoryAssignment tiene muchos InventoryBalance
ProjectInventoryAssignment.hasMany(InventoryBalance, {
  foreignKey: "idProjectAssignment",
  sourceKey: "idProjectAssignment",
  as: "BalanceHistory",
});
