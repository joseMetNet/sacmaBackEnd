import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { CostCenterProject } from "../cost-center/cost-center-project.model";
import { InvoiceStatus } from "./invoice-status.model";

export class Invoice extends Model {
  declare idInvoice: number;
  declare invoice: string;
  declare idCostCenterProject: number;
  declare contract: string;
  declare documentUrl: string;
  declare idInvoiceStatus: number;
  declare createdAt: string;
  declare updatedAt: string;
}

Invoice.init({
  idInvoice: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idCostCenterProject: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contract: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idInvoiceStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_Invoice",
  timestamps: false // Disable automatic timestamps
});

// Define relations
Invoice.hasOne(CostCenterProject, {
  foreignKey: "idCostCenterProject",
  sourceKey: "idCostCenterProject"
});

Invoice.hasOne(InvoiceStatus, {
  foreignKey: "idInvoiceStatus",
  sourceKey: "idInvoiceStatus"
}); 