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
              model: PurchaseRequest,
              as: "PurchaseRequests",
              required: false,
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
  returnStockToPurchaseRequest = async (idPurchaseRequest: number, quantityToReturn: number) => {
    const purchaseRequest = await PurchaseRequest.findByPk(idPurchaseRequest);
    if (!purchaseRequest) {
      throw new Error("Purchase request not found");
    }

    const currentQuantity = parseFloat(purchaseRequest.quantity || "0");
    const newQuantity = (currentQuantity + quantityToReturn).toString();

    await PurchaseRequest.update(
      { quantity: newQuantity },
      { where: { idPurchaseRequest } }
    );

    return newQuantity;
  };
}
