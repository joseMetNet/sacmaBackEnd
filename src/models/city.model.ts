import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { State } from "./state.model";

export class City extends Model {
  declare idCity: number;
  declare idState: number;
  declare city: string;
}

City.init({
  idCity: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  idState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_City",
  timestamps: false
});

State.hasOne(City, {
  foreignKey: "idState",
  sourceKey: "idState"
});
