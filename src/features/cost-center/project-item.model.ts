import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class ProjectItem extends Model {
  declare idProjectItem: number;
  declare idCostCenterProject: number;
  declare contract: string;
  declare item: string;
  declare unitMeasure: string;
  declare quantity: string;
  declare unitPrice: string;
  declare total: string;
  declare invoicedQuantity: string;
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
    contract: {
      type: DataTypes.STRING,
      allowNull: true,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoicedQuantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_ProjectItem",
    timestamps: false,
  }
);