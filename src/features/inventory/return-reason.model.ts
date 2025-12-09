import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class ReturnReason extends Model {
  public idReturnReason!: number;
  public reasonCode!: string;
  public reasonName!: string;
  public requiresDocument!: boolean;
  public isActive!: boolean;
  public createdAt!: Date;
}

ReturnReason.init(
  {
    idReturnReason: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reasonCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    reasonName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    requiresDocument: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: dbConnection,
    tableName: "TB_ReturnReason",
    schema: "mvp1",
    timestamps: false,
  }
);
