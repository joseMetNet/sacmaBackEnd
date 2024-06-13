import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Novelty extends Model {
  declare idNovelty: number;
  declare novelty: string;
}

Novelty.init({
  idNovelty: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  novelty: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Novelty",
  timestamps: false
});