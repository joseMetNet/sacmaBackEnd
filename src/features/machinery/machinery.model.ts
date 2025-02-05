import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { MachineryModel } from "./machinery-model.model";
import { MachineryType } from "./machinery-type.model";
import { MachineryStatus } from "./machinery-status.model";
import { MachineryMaintenance } from "./machinery-maintenance.model";
import { MachineryLocation } from "./machinery-location.model";
import { MachineryDocument } from "./machinery-document.model";
import { MachineryBrand } from "./machinery-brand.model";

export class Machinery extends Model {
  declare idMachinery: number;
  declare serial: string;
  declare description: string;
  declare price: string;
  declare imageUrl: string;
  declare idMachineryModel: number;
  declare idMachineryType: number;
  declare machineryBrand: string;
  declare idMachineryStatus: number;
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
  machineryBrand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idMachineryStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
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


Machinery.hasMany(MachineryMaintenance, {
  sourceKey: "idMachinery",
  foreignKey: "idMachinery"
});

Machinery.hasMany(MachineryLocation, {
  sourceKey: "idMachinery",
  foreignKey: "idMachinery"
});

Machinery.hasOne(MachineryStatus, {
  sourceKey: "idMachineryStatus",
  foreignKey: "idMachineryStatus"
});


Machinery.hasMany(MachineryDocument, {
  sourceKey: "idMachinery",
  foreignKey: "idMachinery"
});