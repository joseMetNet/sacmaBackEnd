import * as dtos from "./order.interface";
import { OrderItem } from "./order-item.model";
import { OrderItemDetail } from "./order-item-detail.model";
import { OrderItemDetailMachineryUsed } from "./order-item-detail-machinery.model"
import { OrderItemStatus } from "./order-item-status.model";
import { CostCenterProject } from "../cost-center";
import { Input, InputUnitOfMeasure } from "../input";
import { Machinery } from "../machinery/machinery.model";
import { MachineryType } from "../machinery/machinery-type.model";
import { MachineryModel } from "../machinery/machinery-model.model";
import { MachineryStatus } from "../machinery/machinery-status.model";
import { PurchaseRequest } from "../purchase/purchase-request.model";
import { PurchaseRequestDetail } from "../purchase/purchase-request-detail.model";
import { Inventory } from "../inventory/inventory.model";
import { InventoryMovement } from "../inventory/inventory-movement.model";
import { WareHouse } from "../warwHouse/warehouse.model";
import { ProjectInventoryAssignment } from "../inventory/project-inventory-assignment.model";
import { Transaction, QueryTypes } from "sequelize";
import { dbConnection } from "../../config";

export class OrderRepository {

  findAllOrderItem = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return OrderItem.findAndCountAll({
      include: [
        {
          model: CostCenterProject,
          attributes: ["name", "address", "phone"],
          required: true,
        },
        {
          model: OrderItemStatus,
          required: true,
        }
      ],
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
  };

  findAllOrderItemDetail = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return OrderItemDetail.findAndCountAll({
      include: [
        {
          model: Input,
          required: true,
          include: [
            {
              model: InputUnitOfMeasure,
              required: true,
            },
            {
              model: Inventory,
              as: "Inventories",
              required: false,
              include: [
                {
                  model: WareHouse,
                  as: "WareHouse",
                  required: false,
                }
              ]
            }
          ]
        }

      ],
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
  };
  findAllOrderItemDetailMachineryUsed = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return OrderItemDetailMachineryUsed.findAndCountAll({
      include: [
        {
          model: Machinery,
          required: true,
        },
        {
          model: MachineryType,
          required: true,
        },
        {
          model: MachineryModel,
          required: true,
        },
        {
          model: MachineryStatus,
          required: true,
        }
      ],
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
  };

  findAllOrderItemDetailMachineryWhitoutPaginator = (filter: { [key: string]: any } = {},) => {

    return OrderItemDetailMachineryUsed.findAndCountAll({
      include: [
        {
          model: Machinery,
          required: true,
        },
        {
          model: MachineryType,
          required: true,
        },
        {
          model: MachineryModel,
          required: true,
        },
        {
          model: MachineryStatus,
          required: true,
        }
      ],
      where: filter,
      order: [["createdAt", "DESC"]],
    });

  }

  findOrderItemStatus = () => {
    return OrderItemStatus.findAll();
  };

  findByIdOrderItem = (id: number) => {
    return OrderItem.findByPk(id,
      {
        include: [
          {
            model: CostCenterProject,
            attributes: ["name", "address", "phone"],
            required: true,
          },
          {
            model: OrderItemStatus,
            required: true,
          }
        ],
      }
    );
  };

  findByIdOrderItemDetail = (id: number) => {
    return OrderItemDetail.findByPk(id,
      {
        include: [
          {
            model: Input,
            required: true,
            include: [
              {
                model: InputUnitOfMeasure,
                required: true,
              }
            ]
          }
        ],
      }
    );
  };
  findByIdOrderItemDetailMachineryUsed = (id: number) => {
    return OrderItemDetailMachineryUsed.findByPk(id,
      {
        // include: [
        //   {
        //     model: Input,
        //     required: true,
        //     include: [
        //       {
        //         model: InputUnitOfMeasure,
        //         required: true,
        //       }
        //     ]
        //   }
        // ],
        include: [
          {
            model: Machinery,
            required: true,
          },
          {
            model: MachineryType,
            required: true,
          },
          {
            model: MachineryModel,
            required: true,
          },
          {
            model: MachineryStatus,
            required: true,
          }
        ],
      }
    );
  };

  createOrderItem = (orderItem: dtos.CreateOrderItem) => {
    return OrderItem.create(orderItem as any);
  };

  createOrderItemDetail = (orderItemDetail: dtos.CreateOrderItemDetail) => {
    return OrderItemDetail.create(orderItemDetail as any);
  };

  createOrderItemDetailMachineryUsed = (orderItemDetailMachineryUsed: dtos.CreateOrderItemDetailMachineryUsed) => {
    return OrderItemDetailMachineryUsed.create(orderItemDetailMachineryUsed as any);
  };
  // createOrderItemDetailMachineryUsed = (orderItemDetailMachineryUsed: dtos.CreateOrderItemDetailMachineryUsed, transaction?: any) => {
  //   const options: any = {};
  //   if (transaction) {
  //     options.transaction = transaction;
  //   }
  //   return OrderItemDetailMachineryUsed.create(orderItemDetailMachineryUsed as any, options);
  // };

  updateOrderItem = (orderItem: dtos.UpdateOrderItem) => {
    return OrderItem.update(orderItem, { where: { idOrderItem: orderItem.idOrderItem } });
  };

  updateOrderItemDetail = (orderItemDetail: dtos.UpdateOrderItemDetail) => {
    return OrderItemDetail.update(orderItemDetail, { where: { idOrderItemDetail: orderItemDetail.idOrderItemDetail } });
  };

  deleteOrderItem = (id: number) => {
    return OrderItem.destroy({ where: { idOrderItem: id } });
  };

  deleteOrderItemDetail = (id: number) => {
    return OrderItemDetail.destroy({ where: { idOrderItemDetail: id } });
  };
  
  deleteOrderItemDetailMachineryUsed = (id: number) => {
    return OrderItemDetailMachineryUsed.destroy({ where: { idOrderItemDetailMachineryUsed: id } });
  };

  // Devolver stock a PurchaseRequest
  returnStockToPurchaseRequest = async (idPurchaseRequestDetail: number, quantityToReturn: number) => {
    const purchaseRequestDetail = await PurchaseRequestDetail.findByPk(idPurchaseRequestDetail);
    if (!purchaseRequestDetail) {
      throw new Error("Purchase request not found");
    }

    const currentQuantity = parseFloat(purchaseRequestDetail.quantity?.toString() || "0");
    const newQuantity = (currentQuantity + quantityToReturn).toString();

    await PurchaseRequestDetail.update(
      { quantity: newQuantity },
      { where: { idPurchaseRequestDetail } }
    );

    return newQuantity;
  };

  // Buscar inventario por Input y Warehouse
  findInventoryByInputAndWarehouse = (idInput: number, idWarehouse: number) => {
    return Inventory.findOne({
      where: {
        idInput,
        idWarehouse
      }
    });
  };

  // Actualizar inventario
  updateInventory = (data: {
    idInventory: number;
    quantityAvailable: string;
    averageCost: string;
    lastMovementDate: Date;
  }, transaction?: Transaction) => {
    const { Sequelize } = require('sequelize');
    
    return Inventory.update(
      {
        quantityAvailable: data.quantityAvailable,
        averageCost: data.averageCost,
        lastMovementDate: Sequelize.literal('GETDATE()')
      },
      { 
        where: { idInventory: data.idInventory },
        transaction,
        silent: true
      }
    );
  };

  // Crear movimiento de inventario
  createInventoryMovement = (movement: {
    idInventory: number;
    idOrderItem?: number;
    idOrderItemDetail?: number;
    idInput: number;
    idWarehouse: number;
    movementType: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    stockBefore: string;
    stockAfter: string;
    remarks?: string;
    documentReference?: string;
    dateMovement: Date;
    createdBy?: string;
  }, transaction?: Transaction) => {
    const { Sequelize } = require('sequelize');
    
    // NO incluir idOrderItem ni idOrderItemDetail porque no existen en la tabla real
    return InventoryMovement.create({
      idInventory: movement.idInventory,
      idInput: movement.idInput,
      idWarehouse: movement.idWarehouse,
      movementType: movement.movementType,
      quantity: movement.quantity,
      unitPrice: movement.unitPrice,
      totalPrice: movement.totalPrice,
      stockBefore: movement.stockBefore,
      stockAfter: movement.stockAfter,
      remarks: movement.remarks,
      documentReference: movement.documentReference,
      dateMovement: Sequelize.literal('GETDATE()'),
      createdAt: Sequelize.literal('GETDATE()'),
      createdBy: movement.createdBy,
      isActive: true
    } as any, { 
      transaction,
      silent: true
    });
  };

  // Buscar ProjectInventoryAssignment por idOrderItemDetail
  findProjectAssignmentByOrderItemDetail = async (idOrderItemDetail: number) => {
    const result = await dbConnection.query(      
       `SELECT DISTINCT 
            COALESCE(pa.idProjectAssignment, 0) AS idProjectAssignment
        FROM mvp1.TB_OrderItemDetail AS oid
        LEFT JOIN (
            SELECT idInput, MAX(idProjectAssignment) AS idProjectAssignment
            FROM [mvp1].[TB_ProjectInventoryAssignment]
            GROUP BY idInput
        ) AS pa ON pa.idInput = oid.idInput
        WHERE oid.idOrderItemDetail = :idOrderItemDetail`,
      {
        replacements: { idOrderItemDetail },
        type: QueryTypes.SELECT
      }
    );
    return result && result.length > 0 ? (result[0] as any).idProjectAssignment : null;
  };

  // Eliminar ProjectInventoryAssignment
  deleteProjectInventoryAssignment = (idProjectAssignment: number, transaction?: Transaction) => {
    return ProjectInventoryAssignment.destroy({ 
      where: { idProjectAssignment },
      transaction 
    });
  };
}
