import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class MachineryMaintenance extends Model {
  declare idMachineryMaintenance: number;
  declare idMachinery: number;
  declare documentName: string;
  declare documentUrl: string;
  declare maintenanceDate: string;
  declare maintenanceEffectiveDate: string;
}

MachineryMaintenance.init({
  idMachineryMaintenance: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idMachinery: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  maintenanceEffectiveDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryMaintenance",
  timestamps: false
});