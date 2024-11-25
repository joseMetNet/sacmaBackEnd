import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class QuotationComment extends Model {
  declare idQuotationComment: number;
  declare idQuotation: number;
  declare idEmployee: number;
  declare comment: string;
  declare createdAt: string;
  declare updatedAt: string;
  declare deletedAt: string;
}

QuotationComment.init({
  idQuotationComment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idQuotation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_QuotationComment",
  timestamps: true,
  paranoid: true
});