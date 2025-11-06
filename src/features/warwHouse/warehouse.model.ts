import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class WareHouse extends Model {
  declare idWarehouse: number;
  declare name: string;
  declare createdAt: string;
  declare updatedAt: string;
  declare isActive: boolean;
}

WareHouse.init({
  idWarehouse: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_WareHouse",
  timestamps: false // Manejamos timestamps manualmente
});