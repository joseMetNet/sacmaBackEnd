import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class Role extends Model {
  declare idRole: number;
  declare role: string;
}

Role.init({
  idRole: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Role",
  timestamps: false
});

