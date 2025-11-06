import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class PurchaseRequestStatus extends Model {
  declare idPurchaseRequestStatus: number;
  declare purchaseRequestStatus: string;
}

PurchaseRequestStatus.init(
  {
    idPurchaseRequestStatus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchaseRequestStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_PurchaseRequestStatus",
    timestamps: false,
  },
);