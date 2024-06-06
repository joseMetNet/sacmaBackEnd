import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Position extends Model {
  declare idPosition: number;
  declare position: string;
}

Position.init({
  idPosition: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Position",
  timestamps: false
});

