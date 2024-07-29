import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../config";
import { Role } from "../authentication/role.model";
import { IdentityCard } from "../models/identity-card.model";
import { City } from "../models/city.model";

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
  declare birthDate: string;
  declare idIdentityCardExpeditionCity: number;
  declare identityCardExpeditionDate: string;
  declare idRole: number;
  declare imageProfileUrl: string;
}

User.init({
  idUser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
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
  },
  imageProfileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: "TB_User",
  timestamps: true,
  paranoid: true
});

User.hasOne(Role, {
  sourceKey: "idRole",
  foreignKey: "idRole",
});

User.hasOne(IdentityCard, {
  sourceKey: "idIdentityCard",
  foreignKey: "idIdentityCard"
});

User.hasOne(City, {
  sourceKey: "idIdentityCardExpeditionCity",
  foreignKey: "idCity"
});
