import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class RevenueCenterStatus extends Model {
  declare idRevenueCenterStatus: number;
  declare status: string;
}

RevenueCenterStatus.init(
  {
    idRevenueCenterStatus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_RevenueCenterStatus",
    timestamps: false,
  }
);