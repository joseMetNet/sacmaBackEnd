import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class DetailPriceInventoryCostCenter extends Model {
  declare idDetailPriceInventoryCostCenter: number;
  declare idRevenueCenter?: number;
  declare idCostCenterProject?: number;
  declare price?: number;
}

DetailPriceInventoryCostCenter.init(
  {
    idDetailPriceInventoryCostCenter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idRevenueCenter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_DetailPriceInventoryCostCenter",
    schema: "dbo",
    timestamps: false,
  }
);
