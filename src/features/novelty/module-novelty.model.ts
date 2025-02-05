import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { Novelty } from "./novelty.model";

export class ModuleNovelty extends Model {
  declare idModuleNovelty: number;
  declare module: string;
  declare idNovelty: number;
}

ModuleNovelty.init({
  idModuleNovelty: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idNovelty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_ModuleNovelty",
  timestamps: false,
});