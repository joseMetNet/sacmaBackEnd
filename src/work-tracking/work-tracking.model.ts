import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { CostCenterProject } from "../cost-center/cost-center-project.model";
import { Employee } from "../models";

export class WorkTracking extends Model {
  declare idWorkTracking: number;
  declare idEmployee: number;
  declare idCostCenterProject: number;
  declare hoursWorked?: number;
  declare overtimeHour?: number;
  declare idNovelty: number;
}

WorkTracking.init(
  {
    idWorkTracking: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idEmployee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoursWorked: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    overtimeHour: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    idNovelty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_WorkTracking",
    timestamps: true,
    paranoid: false
  }
);

WorkTracking.hasOne(CostCenterProject, {
  sourceKey: "idCostCenterProject",
  foreignKey: "idCostCenterProject"
});

WorkTracking.hasOne(Employee, {
  sourceKey: "idEmployee",
  foreignKey: "idEmployee"
});