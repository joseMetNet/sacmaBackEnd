import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";

export class NoveltyKind extends Model {
  declare idNoveltyKind: number;
  declare noveltyKind: string;
}

NoveltyKind.init({
  idNoveltyKind: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  noveltyKind: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_NoveltyKind",
  timestamps: false
});
