import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class RoleUserModel extends Model {
  declare idRoleUserModel: number;
  declare idRole: number;
  declare idUser: number;
}

RoleUserModel.init({
  idRoleUserModel: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idRole: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_RoleUser",
  timestamps: false
});