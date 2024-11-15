import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "../models";

export class Quotation extends Model {
  declare idQuotation: number;
  declare name: string;
  declare idResponsable: number;
}

Quotation.init(
  {
    idQuotation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idResponsable: {
      type: DataTypes.INTEGER,
      allowNull: false,
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