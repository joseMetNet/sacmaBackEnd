import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "../models";
import { QuotationPercentage } from "./quotation-percentage.model";
import { QuotationStatus } from "./quotation-status.model";
import { QuotationComment } from "./quotation-comment.model";

export class Quotation extends Model {
  declare idQuotation: number;
  declare consecutive: string;
  declare name: string;
  declare idQuotationStatus: number;
  declare idResponsable: number;
  declare builder: string;
  declare builderAddress: string;
  declare projectName: string;
  declare itemSummary: string;
  declare totalCost: string;
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
    idQuotationStatus: {
      type: DataTypes.INTEGER,
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
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
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

Quotation.hasOne(QuotationPercentage, {
  sourceKey: "idQuotation",
  foreignKey: "idQuotation",
});

Quotation.hasOne(QuotationStatus, {
  sourceKey: "idQuotationStatus",
  foreignKey: "idQuotationStatus",
});

Quotation.hasMany(QuotationComment, {
  sourceKey: "idQuotation",
  foreignKey: "idQuotation",
});