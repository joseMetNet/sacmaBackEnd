import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class EmergencyContact extends Model {
  declare idEmergencyContact: number;
  declare firstName: string;
  declare lastName: string;
  declare phoneNumber: string;
  declare kinship: string;
}

EmergencyContact.init({
  idEmergencyContact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kinship: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_EmergencyContact",
  timestamps: true,
  paranoid: true
});
