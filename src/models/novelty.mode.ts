import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { NoveltyKind } from "./novelty-kind.model";

export class Novelty extends Model {
  declare idNovelty: number;
  declare idNoveltyKind: number;
  declare loanValue: string;
  declare idEmployee: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Novelty.init({
  idNovelty: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idNoveltyKind: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  loanValue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idEmployee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Novelty",
  timestamps: true,
  paranoid: true
});

Novelty.hasOne(NoveltyKind, {
  sourceKey: "idNoveltyKind",
  foreignKey: "idNoveltyKind"
});
