import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { InputType } from "./input-type.model";
import { Supplier } from "../supplier";
import { InputUnitOfMeasure } from "./input-unit-of-measure.model";
import { InputDocument } from "./input-document.model";

export class Input extends Model {
  declare idInput: number;
  declare name: string;
  declare idInputType: number;
  declare code: string;
  declare idInputUnitOfMeasure: number;
  declare cost: string;
  declare idSupplier: number;
  declare performance: string;
  declare price: string;
}

Input.init({
  idInput: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  idInputType: {
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING
  },
  idInputUnitOfMeasure: {
    type: DataTypes.NUMBER
  },
  cost: {
    type: DataTypes.STRING
  },
  idSupplier: {
    type: DataTypes.INTEGER
  },
  performance: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.STRING
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Input",
  timestamps: false,
});

Input.hasOne(InputType, {
  foreignKey: "idInputType",
  sourceKey: "idInputType"
});

Input.hasOne(Supplier, {
  foreignKey: "idSupplier",
  sourceKey: "idSupplier"
});

Input.hasOne(InputUnitOfMeasure, {
  foreignKey: "idInputUnitOfMeasure",
  sourceKey: "idInputUnitOfMeasure"
});

Input.hasMany(InputDocument, {
  foreignKey: "idInput",
  sourceKey: "idInput"
});