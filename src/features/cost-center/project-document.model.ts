import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { CostCenterProject } from "./cost-center-project.model";

export class ProjectDocument extends Model {
  declare idProjectDocument: number;
  declare idCostCenterProject: number;
  declare documentUrl: string;
  declare description: string;
  declare consecutive: string;
  declare value: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare fromDate: string;
  declare toDate: string;
}

ProjectDocument.init({
  idProjectDocument: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCostCenterProject: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  consecutive: {
    type: DataTypes.STRING,
    allowNull: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fromDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  toDate: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_ProjectDocument",
  timestamps: true
});

ProjectDocument.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject"
});