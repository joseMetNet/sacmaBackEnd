import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class CostCenterProject extends Model {
  declare idCostCenterProject: number;
  declare idCostCenter: number;
  declare name: string;
  declare location: string;
  declare address: string;
  declare phone: string;
}

CostCenterProject.init({
  idCostCenterProject: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCostCenter: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_CostCenterProject",
  timestamps: false
});