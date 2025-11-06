import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export interface IIncomeDiscountInvoice {
  idIncomeDiscountInvoice?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  value: number; // Obligatorio
  idExpenditureType: number; // Obligatorio
  idCostCenterProject: number; // Obligatorio
  idInvoice: number; // Obligatorio
  refundRequestDate?: Date; // Opcional con valor por defecto
  advance?: number;
  reteguarantee?: number;
  retesource?: number;
  reteica?: number;
  fic?: number;
  other?: number;
  totalDiscounts?: number;
  idIncome?: number;
}

export class IncomeDiscountInvoice extends Model<IIncomeDiscountInvoice> implements IIncomeDiscountInvoice {
  public idIncomeDiscountInvoice!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public isActive!: boolean;
  public value!: number; // Obligatorio
  public idExpenditureType!: number; // Obligatorio
  public idCostCenterProject!: number; // Obligatorio
  public idInvoice!: number; // Obligatorio
  public refundRequestDate?: Date; // Opcional con valor por defecto
  public advance?: number;
  public reteguarantee?: number;
  public retesource?: number;
  public reteica?: number;
  public fic?: number;
  public other?: number;
  public totalDiscounts?: number;
  public idIncome?: number;
}

IncomeDiscountInvoice.init(
  {
    idIncomeDiscountInvoice: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "idIncomeDiscountInvoice",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "updatedAt",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: "isActive",
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "value",
    },
    idExpenditureType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "idExpenditureType",
      references: {
        model: "TB_ExpenditureType",
        key: "idExpenditureType",
      },
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "idCostCenterProject",
      references: {
        model: "TB_CostCenterProject",
        key: "idCostCenterProject",
      },
    },
    idInvoice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "idInvoice",
      references: {
        model: "TB_Invoice",
        key: "idInvoice",
      },
    },
    refundRequestDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "refundRequestDate",
    },
    advance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "advance",
    },
    reteguarantee: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "reteguarantee",
    },
    retesource: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "retesource",
    },
    reteica: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "reteica",
    },
    fic: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "fic",
    },
    other: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: "other",
    },
    totalDiscounts:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0.00,
      field: "totalDiscounts",
    },
    idIncome: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "idIncome",
    }
  },
  {
    sequelize: dbConnection,
    tableName: "TB_IncomeDiscountsInvoice",
    schema: "mvp1",
    timestamps: false,
  }
);

// Las asociaciones se configuran en model-relations.ts para evitar dependencias circulares