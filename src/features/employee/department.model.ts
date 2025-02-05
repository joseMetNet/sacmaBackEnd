import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class state extends Model {
  declare idDepartment: number;
  declare state: string;
}

state.init(
  {
    idDepartment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_Department",
    timestamps: false,
  }
);
