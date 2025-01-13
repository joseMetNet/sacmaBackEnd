import * as dtos from "./order.interface";
import { OrderItem } from "./order-item.model";
import { OrderItemDetail } from "./order-item-detail.model";

export class OrderRepository {

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

  findByIdOrderItem = (id: number) => {
    return OrderItem.findByPk(id);
  };

  findByIdOrderItemDetail = (id: number) => {
    return OrderItemDetail.findByPk(id);
  };

  createOrderItem = (orderItem: dtos.CreateOrderItem) => {
    return OrderItem.create(orderItem as any);
  };

  createOrderItemDetail = (orderItemDetail: dtos.CreateOrderItemDetail) => {
    return OrderItemDetail.create(orderItemDetail as any);
  };

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
}
