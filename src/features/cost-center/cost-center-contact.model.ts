import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class CostCenterContact extends Model {
  declare idCostCenterContact: number;
  declare idCostCenter: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare role: string;
}

CostCenterContact.init({
  idCostCenterContact: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCostCenter: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_CostCenterContact",
  timestamps: false
});