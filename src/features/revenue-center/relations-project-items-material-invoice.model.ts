import { Model, DataTypes } from "sequelize";
import { dbConnection } from "../../config/database";

export class RelationsProjectItemsMaterialInvoice extends Model {
  declare idRelationsProjectItemsMaterialInvoice: number;
  declare idCostCenterProject: number | null;
  declare idInput: number;
  declare idRevenueCenter: number;
  declare idProjectItem: number;
  declare invoicedQuantity: number | null;
}

RelationsProjectItemsMaterialInvoice.init(
  {
    idRelationsProjectItemsMaterialInvoice: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idInput: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idRevenueCenter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idProjectItem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoicedQuantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_RelationsProjectItemsMaterialInvoice",
    schema: "mvp1",
    timestamps: false,
  }
);
