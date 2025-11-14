import { DataTypes, Model } from "sequelize";
import { dbConnection } from "../../config";
import { PurchaseRequest } from "../purchase/purchase-request.model";
import { Input } from "../input";
import { WareHouse } from "../warwHouse/warehouse.model";
import { PurchaseRequestDetail } from "../purchase/purchase-request-detail.model";

export class InputMovement extends Model {
  declare idInputMovement: number;
  declare idPurchaseRequest?: number;
  declare idInput?: number;
  declare idWarehouse?: number;
  declare movementType: string;
  declare quantity: string;
  declare price?: string;
  declare remarks?: string;
  declare createdBy?: string;
  declare createdAt?: Date;
  declare idPurchaseRequestDetail?: number;
}

InputMovement.init({
  idInputMovement: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idPurchaseRequest: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idInput: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idWarehouse: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  movementType: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['Entrada', 'Salida', 'Retorno']]
    }
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  remarks: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  idPurchaseRequestDetail: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  sequelize: dbConnection,
  tableName: "TB_InputMovement",
  schema: "mvp1",
  timestamps: false
});

// Relaciones
InputMovement.belongsTo(PurchaseRequest, {
  foreignKey: "idPurchaseRequest",
  targetKey: "idPurchaseRequest",
  as: "PurchaseRequest"
});

InputMovement.belongsTo(Input, {
  foreignKey: "idInput",
  targetKey: "idInput",
  as: "Input"
});

InputMovement.belongsTo(WareHouse, {
  foreignKey: "idWarehouse",
  targetKey: "idWarehouse",
  as: "WareHouse"
});

// InputMovement.belongsTo(PurchaseRequestDetail, {
//   foreignKey: "idPurchaseRequestDetail",
//   targetKey: "idPurchaseRequestDetail",
//   as: "PurchaseRequestDetail"
// });
