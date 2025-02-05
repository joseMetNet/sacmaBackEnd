import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class PermissionModel extends Model {
  declare idPermission: number;
  declare permission: string;
}

PermissionModel.init({
  idPermission: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_Permission",
  timestamps: false
});
