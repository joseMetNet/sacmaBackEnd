import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";

export class User extends Model {
  declare idUser: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare userName: string;
  declare address: string;
  declare phoneNumber: string;
  declare idIdentityCard: number;
  declare identityCardNumber: string;
  declare idIdentityCardExpeditionCity: number;
  declare identityCardExpeditionDate: string;
  declare idRole: number;
}

User.init({
  idUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idIdentityCard: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  identityCardNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idIdentityCardExpeditionCity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  identityCardExpeditionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  idRole: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_User",
  timestamps: true,
  paranoid: true
});