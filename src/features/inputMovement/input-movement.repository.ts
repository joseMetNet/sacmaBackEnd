import { InputMovement } from "./input-movement.model";
import * as dtos from "./input-movement.interface";
import { dbConnection } from "../../config";
import { Op, QueryTypes, DataTypes } from "sequelize";
import { PurchaseRequest } from "../purchase/purchase-request.model";
import { Input } from "../input";
import { WareHouse } from "../warwHouse/warehouse.model";

export class InputMovementRepository {

  // Ejecutar el procedimiento almacenado SP_MoveInput
  async executeMoveInput(data: dtos.MoveInputDTO): Promise<any> {
    try {
      // Construir los parámetros de manera explícita
      const params: any = {
        idPurchaseRequest: data.idPurchaseRequest,
        idInput: data.idInput,
        movementType: data.movementType,
        quantity: parseFloat(data.quantity),
        idWarehouse: data.idWarehouse,
        remarks: data.remarks || null,
        createdBy: data.createdBy || null,
        idPurchaseRequestDetail: data.idPurchaseRequestDetail || null
      };

      // Solo agregar price si existe y no es null
      if (data.price !== null && data.price !== undefined) {
        params.price = parseFloat(data.price);
      } else {
        params.price = null;
      }

      const result = await dbConnection.query(
        'EXEC [mvp1].[SP_MoveInput] @idPurchaseRequest = :idPurchaseRequest, @idInput = :idInput, @movementType = :movementType, @quantity = :quantity, @remarks = :remarks, @createdBy = :createdBy, @idWarehouse = :idWarehouse, @price = :price, @idPurchaseRequestDetail = :idPurchaseRequestDetail',
        {
          replacements: params,
          type: QueryTypes.RAW
        }
      );
      return result;
    } catch (error: any) {
      // Extraer el mensaje real del error de SQL Server
      console.error('Raw error from SQL Server:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Error al ejecutar el procedimiento almacenado';
      
      // Intentar extraer errores específicos de SQL Server
      if (error.parent && error.parent.errors) {
        const sqlErrors = error.parent.errors.map((e: any) => e.message).join('; ');
        console.error('SQL Server errors:', sqlErrors);
        errorMessage = sqlErrors || errorMessage;
      } else if (error.original && error.original.errors) {
        const sqlErrors = error.original.errors.map((e: any) => e.message).join('; ');
        console.error('SQL Server original errors:', sqlErrors);
        errorMessage = sqlErrors || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
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
