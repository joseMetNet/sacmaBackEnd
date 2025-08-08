import { Model } from "sequelize";
import { dbConnection } from "../../config";

export class InvoiceProjectItem extends Model {
  declare idInvoiceProjectItem: number;
  declare idInvoice: number;
  declare idProjectItem: number;
  declare invoicedQuantity: string;
  declare contract: string;
}

InvoiceProjectItem.init(
  {
    idInvoiceProjectItem: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    idInvoice: {
      type: "INTEGER",
      allowNull: false,
    },
    idProjectItem: {
      type: "INTEGER",
      allowNull: false,
    },
    invoicedQuantity: {
      type: "FLOAT",
      allowNull: false,
    },
    contract: {
      type: "STRING",
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_InvoiceProjectItem",
    timestamps: false,
  }
);