import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class ContractType extends Model {
  declare idContractType: number;
  declare contractType: string;
}

ContractType.init({
  idContractType: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  contractType: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_ContractType",
  timestamps: false
});
