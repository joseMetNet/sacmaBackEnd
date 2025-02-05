import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class IdentityCard extends Model {
  declare idIdentityCard: number;
  declare identityCard: number;
}

IdentityCard.init({
  idIdentityCard: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  identityCard: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_IdentityCard",
  timestamps: false
});