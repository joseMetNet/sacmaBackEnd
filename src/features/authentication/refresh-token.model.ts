import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class RefreshToken extends Model {
  declare idRefreshToken: number;
  declare idUser: number;
}

RefreshToken.init({
  idRefreshToken: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_RefreshToken",
  timestamps: true,
  paranoid: true
});