import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Quotation } from "./quotation.model";

export class QuotationItem extends Model {
  declare idQuotationItem: number;
  declare idQuotation: number;
  declare item: string;
  declare technicalSpecification: string;
  declare unitMeasure: string;
  declare quantity: string;
  declare unitPrice: string;
  declare total: string;
}

QuotationItem.init(
  {
    idQuotationItem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idQuotation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    technicalSpecification: {
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
    tableName: "TB_QuotationItem",
    timestamps: false,
  }
);

QuotationItem.hasOne(Quotation, {
  sourceKey: "idQuotation",
  foreignKey: "idQuotation",
});