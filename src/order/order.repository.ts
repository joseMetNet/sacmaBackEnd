import { Order } from "./order.model";
import * as dtos from "./order.interface";
import { OrderItem } from "./order-item.model";
import { OrderItemDetail } from "./order-item-detail.model";

export class OrderRepository {
  findAll = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return Order.findAndCountAll({
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    },
    );
  };

  findAllOrderItem = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return OrderItem.findAndCountAll({
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
  };

  findAllOrderItemDetail = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return OrderItemDetail.findAndCountAll({
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
  };

  findById = (id: number) => {
    return Order.findByPk(id);
  };

  findByIdOrderItem = (id: number) => {
    return OrderItemDetail.findByPk(id);
  };

  findByIdOrderItemDetail = (id: number) => {
    return OrderItemDetail.findByPk(id);
  };

  create = (order: dtos.CreateOrder) => {
    return Order.create(order as any);
  };

  createOrderItem = (orderItem: dtos.CreateOrderItem) => {
    return OrderItem.create(orderItem as any);
  };

  createOrderItemDetail = (orderItemDetail: dtos.CreateOrderItemDetail) => {
    return OrderItemDetail.create(orderItemDetail as any);
  };

  update = (order: dtos.UpdateOrder) => {
    return Order.update(order, { where: { idOrder: order.idOrder } });
  };

  updateOrderItem = (orderItem: dtos.UpdateOrderItem) => {
    return OrderItem.update(orderItem, { where: { idOrderItem: orderItem.idOrderItem } });
  };

  updateOrderItemDetail = (orderItemDetail: dtos.UpdateOrderItemDetail) => {
    return OrderItemDetail.update(orderItemDetail, { where: { idOrderItemDetail: orderItemDetail.idOrderItemDetail } });
  };

  delete = (id: number) => {
    return Order.destroy({ where: { idOrder: id } });
  };

  deleteOrderItem = (id: number) => {
    return OrderItem.destroy({ where: { idOrderItem: id } });
  };

  deleteOrderItemDetail = (id: number) => {
    return OrderItemDetail.destroy({ where: { idOrderItemDetail: id } });
  };
}
