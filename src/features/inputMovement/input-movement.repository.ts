import { InputMovement } from "./input-movement.model";
import * as dtos from "./input-movement.interface";
import { dbConnection } from "../../config";
import { Op } from "sequelize";
import { PurchaseRequest } from "../purchase/purchase-request.model";
import { Input } from "../input";
import { WareHouse } from "../warwHouse/warehouse.model";

export class InputMovementRepository {

  // Ejecutar el procedimiento almacenado SP_MoveInput
  async executeMoveInput(data: dtos.MoveInputDTO): Promise<any> {
    const result = await dbConnection.query(
      'EXEC [mvp1].[SP_MoveInput] @idPurchaseRequest = :idPurchaseRequest, @movementType = :movementType, @quantity = :quantity, @remarks = :remarks, @createdBy = :createdBy',
      {
        replacements: {
          idPurchaseRequest: data.idPurchaseRequest,
          movementType: data.movementType,
          quantity: data.quantity,
          remarks: data.remarks || null,
          createdBy: data.createdBy || null
        },
        type: 'RAW'
      }
    );
    return result;
  }

  // Consultar todos los movimientos con paginación
  findAll(
    filter: { [key: string]: any } = {},
    limit?: number,
    offset?: number
  ) {
    const queryOptions: any = {
      include: [
        {
          model: PurchaseRequest,
          as: "PurchaseRequest",
          required: false,
        },
        {
          model: Input,
          as: "Input",
          required: false,
        },
        {
          model: WareHouse,
          as: "WareHouse",
          required: false,
        }
      ],
      where: filter,
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      queryOptions.limit = limit;
    }
    if (offset !== undefined) {
      queryOptions.offset = offset;
    }

    return InputMovement.findAndCountAll(queryOptions);
  }

  // Encontrar por ID
  findById(id: number) {
    return InputMovement.findByPk(id, {
      include: [
        {
          model: PurchaseRequest,
          as: "PurchaseRequest",
          required: false,
        },
        {
          model: Input,
          as: "Input",
          required: false,
        },
        {
          model: WareHouse,
          as: "WareHouse",
          required: false,
        }
      ],
    });
  }

  // Obtener historial de movimientos por producto
  findByInput(idInput: number) {
    return InputMovement.findAll({
      where: { idInput },
      include: [
        {
          model: PurchaseRequest,
          as: "PurchaseRequest",
          required: false,
        },
        {
          model: WareHouse,
          as: "WareHouse",
          required: false,
        }
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Obtener historial de movimientos por bodega
  findByWarehouse(idWarehouse: number) {
    return InputMovement.findAll({
      where: { idWarehouse },
      include: [
        {
          model: PurchaseRequest,
          as: "PurchaseRequest",
          required: false,
        },
        {
          model: Input,
          as: "Input",
          required: false,
        }
      ],
      order: [["createdAt", "DESC"]],
    });
  }
}
