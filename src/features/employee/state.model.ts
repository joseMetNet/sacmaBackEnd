import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class State extends Model {
  declare idState: number;
  declare state: string;
}

State.init({
  idState: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_State",
  timestamps: false
});