import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class InventoryDocument extends Model {
  public idInventoryDocument!: number;
  public idInventoryMovement!: number | null;
  public idProjectAssignment!: number | null;
  public idCostCenterProject!: number | null;
  public documentType!: string;
  public fileName!: string;
  public fileExtension!: string;
  public filePath!: string;
  public fileSize!: number | null;
  public mimeType!: string | null;
  public description!: string | null;
  public uploadedBy!: string | null;
  public uploadedAt!: Date;
  public isActive!: boolean;
}

InventoryDocument.init(
  {
    idInventoryDocument: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idInventoryMovement: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idProjectAssignment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCostCenterProject: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileExtension: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_InventoryDocument",
    schema: "mvp1",
    timestamps: false,
  }
);
