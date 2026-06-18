import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Employee } from "../employee";
import { User } from "../authentication";

export class QuotationComment extends Model {
  declare idQuotationComment: number;
  declare idQuotation: number;
  declare idEmployee: number;
  declare idUser: number;
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
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_QuotationComment",
  timestamps: true,
  paranoid: true
});

QuotationComment.belongsTo(Employee, {
  foreignKey: "idEmployee",
  targetKey: "idEmployee",
  as: "employee",
});

QuotationComment.belongsTo(User, {
  foreignKey: "idUser",
  targetKey: "idUser",
  as: "commentUser",
});
