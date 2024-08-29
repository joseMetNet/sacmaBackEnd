import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { MachineryModel } from "./machinery-model.model";
import { MachineryType } from "./machinery-type.model";
import { MachineryStatus } from "./machinery-status.model";
import { MachineryBrand } from "./machinery-brand.model";
import { MachineryMaintenance } from "./machinery-maintenance.model";
import { MachineryLocation } from "./machinery-location.model";

export class Machinery extends Model {
  declare idMachinery: number;
  declare serial: string;
  declare description: string;
  declare price: string;
  declare imageUrl: string;
  declare idMachineryModel: number;
  declare idMachineryType: number;
  declare idMachineryBrand: number;
  declare idMachineryStatus: number;
  declare status: boolean;
}

Machinery.init({
  idMachinery: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idMachineryModel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryBrand: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMachineryStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Machinery",
  timestamps: false
});


Machinery.hasOne(MachineryModel, {
  sourceKey: "idMachineryModel",
  foreignKey: "idMachineryModel"
});

Machinery.hasOne(MachineryType, {
  sourceKey: "idMachineryType",
  foreignKey: "idMachineryType"
});

Machinery.hasOne(MachineryStatus, {
  sourceKey: "idMachineryStatus",
  foreignKey: "idMachineryStatus"
});

Machinery.hasOne(MachineryBrand, {
  sourceKey: "idMachineryBrand",
  foreignKey: "idMachineryBrand"
});

Machinery.hasMany(MachineryMaintenance, {
  sourceKey: "idMachinery",
  foreignKey: "idMachinery"
});

Machinery.hasMany(MachineryLocation, {
  sourceKey: "idMachinery",
  foreignKey: "idMachinery"
});