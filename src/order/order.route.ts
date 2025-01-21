import {Application, Router} from "express";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";

export function orderRoute(app: Application) {
  const router = Router();
  const orderRepository = new OrderRepository();
  const orderService = new OrderService(orderRepository);
  const orderController = new OrderController(orderService);

  router.get("/v1/order/item", orderController.findAllOrderItem);
  router.get("/v1/order/item/status", orderController.findOrderItemStatus);
  router.get("/v1/order/item/detail", orderController.findAllOrderItemDetail);
  router.get("/v1/order/item/:idOrderItem", orderController.findByIdOrderItem);
  router.get("/v1/order/item/detail/:idOrderItemDetail", orderController.findByIdOrderItemDetail);

  router.post("/v1/order/item", orderController.createOrderItem);
  router.post("/v1/order/item/detail", orderController.createOrderItemDetail);
  
  router.patch("/v1/order/item", orderController.updateOrderItem);
  router.patch("/v1/order/item/detail", orderController.updateOrderItemDetail);

  router.delete("/v1/order/item/:idOrderItem", orderController.deleteOrderItem);
  router.delete("/v1/order/item/detail/:idOrderItemDetail", orderController.deleteOrderItemDetail);

  app.use("/api/", router);
}

/**
 * @openapi
 * /v1/order/item:
 *   get:
 *     tags: [Order]
 *     summary: Find all order items
 *     description: Retrieve a list of order items
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: consecutive
 *         schema:
 *           type: string
 *         description: Consecutive of the order item
 *       - in: query
 *         name: idOrderItemStatus
 *         schema:
 *           type: integer
 *         description: Number of the order item status
 *       - in: query
 *         name: idCostCenterProject
 *         schema:
 *           type: integer
 *         description: Number of the cost center project
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/detail:
 *   get:
 *     tags: [Order]
 *     summary: Find all order item details
 *     description: Retrieve a list of order item details
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: idOrderItem
 *         schema:
 *           type: integer
 *         description: ID of the order item
 *     responses:
 *       200:
 *         description: A list of orders item details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItemDetail'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/


/**
 * @openapi
 * /v1/order/item/status:
 *   get:
 *     tags: [Order]
 *     summary: Find all order item status
 *     description: Retrieve a list of order item status
 *     responses:
 *       200:
 *         description: A list of order item status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItemStatus'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/


/**
 * @openapi
 * /v1/order/item/{idOrderItem}:
 *   get:
 *     tags: [Order]
 *     summary: Retrieve a single order item
 *     description: Retrieve a single order item by its ID
 *     parameters:
 *       - in: path
 *         name: idOrderItem
 *         schema:
 *           type: integer
 *         description: ID of the order item to retrieve
 *     responses:
 *       200:
 *         description: A single order item
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/detail/{idOrderItemDetail}:
 *   get:
 *     tags: [Order]
 *     summary: Retrieve a single order item detail
 *     description: Retrieve a single order item detail by its ID
 *     parameters:
 *       - in: path
 *         name: idOrderItemDetail
 *         schema:
 *           type: integer
 *         description: ID of the order item detail to retrieve
 *     responses:
 *       200:
 *         description: A single order item detail
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItemDetail'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order item
 *     description: Create a new order item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderItem'
 *     responses:
 *       201:
 *         description: Order Item Detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order item
 *     description: Create a new order item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderItem'
 *     responses:
 *       201:
 *         description: Order Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/detail:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order item detail
 *     description: Create a new order item detail
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderItemDetail'
 *     responses:
 *       201:
 *         description: Order Item Detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item:
 *   patch:
 *     tags: [Order]
 *     summary: Update an existing order item
 *     description: Update an existing order item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderItem'
 *     responses:
 *       200:
 *         description: Quotation Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/detail:
 *   patch:
 *     tags: [Order]
 *     summary: Update an existing order item detail
 *     description: Update an existing order item detail
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderItemDetail'
 *     responses:
 *       200:
 *         description: Quotation Item Detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/{idOrderItem}:
 *   delete:
 *     tags: [Order]
 *     summary: Delete an existing order item
 *     description: Delete an existing order item
 *     parameters:
 *       - in: path
 *         name: idOrderItem
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order item to delete
 *     responses:
 *       204:
 *         description: Order item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @openapi
 * /v1/order/item/detail/{idOrderItemDetail}:
 *   delete:
 *     tags: [Order]
 *     summary: Delete an existing order item detail
 *     description: Delete an existing order item detail
 *     parameters:
 *       - in: path
 *         name: idOrderItemDetail
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order item detail to delete
 *     responses:
 *       204:
 *         description: Order item detail deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/failedResponse'
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         idOrderItem:
 *           type: integer
 *           example: 1
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         idOrderItemStatus:
 *           type: integer
 *           example: 1
 *         consecutive:
 *           type: string
 *           example: "123"
 *         createdAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     OrderItemDetail:
 *       type: object
 *       properties:
 *         idOrderItemDetail:
 *           type: integer
 *           example: 1
 *         idOrderItem:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Item description"
 *         unitMeasure:
 *           type: string
 *           example: "unit"
 *         quantity:
 *           type: number
 *           example: 1
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     OrderItemStatus:
 *       type: object
 *       properties:
 *         idOrderItemStatus:
 *           type: integer
 *           example: 1
 *         orderItemStatus:
 *           type: string
 *           example: "Order item status"
 *     CreateOrderItem:
 *       type: object
 *       required:
 *         - idEmployee
 *         - idCostCenterProject
 *       properties:
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         address:
 *           type: string
 *           example: "Address"
 *         phone:
 *           type: string
 *           example: "1234567890"
 *         idOrderItemStatus:
 *           type: integer
 *           example: 1
 *         consecutive:
 *           type: string
 *           example: "123"
 *         createdAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     CreateOrderItemDetail:
 *       type: object
 *       required:
 *         - idOrderItem
 *         - idInput
 *         - quantity
 *       properties:
 *         idOrderItem:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 1
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     UpdateOrderItem:
 *       type: object
 *       required:
 *         - idOrderItem
 *       properties:
 *         idOrderItem:
 *           type: integer
 *           example: 1
 *         idEmployee:
 *           type: integer
 *           example: 1
 *         idCostCenterProject:
 *           type: integer
 *           example: 1
 *         address:
 *           type: string
 *           example: "Address"
 *         phone:
 *           type: string
 *           example: "1234567890"
 *         document:
 *           type: string
 *           format: binary
 *         idOrderItemStatus:
 *           type: integer
 *           example: 1
 *         consecutive:
 *           type: string
 *           example: "123"
 *         createdAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *     UpdateOrderItemDetail:
 *       type: object
 *       required:
 *         - idOrderItemDetail
 *       properties:
 *         idOrderItemDetail:
 *           type: integer
 *           example: 1
 *         idOrderItem:
 *           type: integer
 *           example: 1
 *         idInput:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 1
 *         createdAt:           
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2021-09-01T00:00:00.000Z"
 */
