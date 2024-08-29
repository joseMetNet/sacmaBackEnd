import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Machinery } from "./machinery.model";
import { Employee } from "../models";

export class MachineryLocation extends Model {
  declare idMachineryLocationHistory: number;
  declare idMachinery: number;
  declare idProject: number;
  declare idEmployee: number;
  declare modificationDate: Date;
  declare assignmentDate: Date;
}

MachineryLocation.init({
  idMachineryLocationHistory: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idMachinery: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idProject: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  modificationDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assignmentDate: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_MachineryLocationHistory",
  timestamps: false
});

MachineryLocation.hasOne(Employee, {
  sourceKey: "idEmployee",
  foreignKey: "idEmployee"
});
