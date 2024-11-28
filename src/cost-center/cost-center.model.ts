import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { CostCenterContact } from "./cost-center-contact.model";
import { CostCenterProject } from "./cost-center-project.model";

export class CostCenter extends Model {
  [x: string]: any;
  declare idCostCenter: number;
  declare nit: string;
  declare name: string;
  declare imageUrl: string;
  declare phone: string;
}

CostCenter.init({
  idCostCenter: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_CostCenter",
  timestamps: false
});

CostCenter.hasMany(CostCenterContact, {
  foreignKey: "idCostCenter",
  sourceKey: "idCostCenter"
});

CostCenter.hasMany(CostCenterProject, {
  foreignKey: "idCostCenter",
  sourceKey: "idCostCenter"
});