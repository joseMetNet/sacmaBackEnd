import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "../models";

export class Quotation extends Model {
  declare idQuotation: number;
  declare consecutive: string;
  declare name: string;
  declare idResponsable: number;
  declare builder: string;
  declare builderAddress: string;
  declare projectName: string;
  declare itemSummary: string;
}

Quotation.init(
  {
    idQuotation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consecutive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idResponsable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    builder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    builderAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemSummary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Quotation",
    timestamps: false,
  }
);

Quotation.hasOne(Employee, {
  sourceKey: "idResponsable",
  foreignKey: "idEmployee",
});