import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class OrderItemStatus extends Model {
  declare idOrderItemStatus: number;
  declare orderItemStatus: string;
}

OrderItemStatus.init(
  {
    idOrderItemStatus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderItemStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_OrderItemStatus",
    timestamps: false,
  },
);