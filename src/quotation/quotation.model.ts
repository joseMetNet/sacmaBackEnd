import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Employee } from "../models";
import { QuotationPercentage } from "./quotation-percentage.model";
import { QuotationStatus } from "./quotation-status.model";
import { QuotationComment } from "./quotation-comment.model";
import { QuotationAdditionalCost } from "./quotation-additional-costs.model";

export class Quotation extends Model {
  declare idQuotation: number;
  declare consecutive: string;
  declare name: string;
  declare idQuotationStatus: number;
  declare idResponsable: number;
  declare builder: string;
  declare client: string;
  declare executionTime: string;
  declare policy: string;
  declare technicalCondition: string;
  declare builderAddress: string;
  declare projectName: string;
  declare itemSummary: string;
  declare totalCost: string;
  declare perDiem: string;
  declare sisoNumber: string;
  declare createdAt: string;
  declare updatedAt: string;
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
    perDiem: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sisoNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    executionTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    policy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    technicalCondition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Quotation",
    timestamps: true,
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

Quotation.hasOne(QuotationAdditionalCost, {
  sourceKey: "idQuotation",
  foreignKey: "idQuotation",
});