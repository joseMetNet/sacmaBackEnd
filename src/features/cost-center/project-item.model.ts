import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class ProjectItem extends Model {
  declare idProjectItem: number;
  declare idCostCenterProject: number;
  declare item: string;
  declare unitMeasure: string;
  declare quantity: string;
  declare unitPrice: string;
  declare total: string;
}

ProjectItem.init(
  {
    idProjectItem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitMeasure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_ProjectItem",
    timestamps: false,
  }
);