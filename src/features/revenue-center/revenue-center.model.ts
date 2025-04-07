import { Model, DataTypes } from "sequelize";
import { dbConnection } from "../../config/database";

export class RevenueCenter extends Model {
  public idRevenueCenter!: number;
  public name!: string;
  public idCostCenterProject!: number;
  public fromDate!: string;
  public toDate!: string;
  public createdAt!: string;
  public updatedAt!: string;
}

RevenueCenter.init(
  {
    idRevenueCenter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_RevenueCenter",
    timestamps: true
  }
); 