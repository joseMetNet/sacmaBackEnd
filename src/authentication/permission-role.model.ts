import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { PermissionModel } from "./permission.model";

export class PermissionRoleModel extends Model {
  declare idPermissionRole: number;
  declare idPermission: number;
  declare idRole: number;
}

PermissionRoleModel.init({
  idPermissionRole: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
  idPermission: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idRole: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_PermissionRole",
  timestamps: false
});

PermissionRoleModel.hasOne(PermissionModel, {
  sourceKey: "idPermission",
  foreignKey: "idPermission",
});
