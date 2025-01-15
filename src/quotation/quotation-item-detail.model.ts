import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { QuotationItem } from "./quotation-item.model";
import { Input } from "../input/input.model";

export class QuotationItemDetail extends Model {
  declare idQuotationItemDetail: number;
  declare idQuotationItem: number;
  declare idInput: number;
  declare quantity: string;
  declare performance: string;
  declare price: string;
  declare totalCost: string;
}

QuotationItemDetail.init(
  {
    idQuotationItemDetail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idQuotationItem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idInput: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    performance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_QuotationItemDetail",
    timestamps: false,
  }
);

QuotationItemDetail.hasOne(QuotationItem, {
  sourceKey: "idQuotationItem",
  foreignKey: "idQuotationItem",
});

QuotationItemDetail.hasOne(Input, {
  sourceKey: "idInput",
  foreignKey: "idInput",
});