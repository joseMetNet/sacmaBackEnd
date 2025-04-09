import { RevenueCenterRepository } from "./revenue-center.repository";
import { ResponseEntity } from "../employee/interface";
import { BuildResponse } from "../../utils/build-response";
import { findPagination, StatusCode } from "../../utils/general.interfase";
import { IRevenueCenterCreate, IRevenueCenterUpdate } from "./revenue-center.interface";
import * as schemas from "./revenue-center.schema";
import { OrderRepository } from "../order/order.repository";
import sequelize from "sequelize";
import { idInput } from "../input/input.schema";

export class RevenueCenterService {
  private readonly revenueCenterRepository: RevenueCenterRepository;
  private readonly orderRepository: OrderRepository;

  constructor(
    revenueCenterRepository: RevenueCenterRepository,
    orderRepository: OrderRepository
  ) {
    this.revenueCenterRepository = revenueCenterRepository;
    this.orderRepository = orderRepository;
  }

  findAll = async (request: schemas.FindAllSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);
      const revenueCenters = await this.revenueCenterRepository.findAll(limit, offset, filter);

      const response = {
        data: revenueCenters.rows.map(rc => ({
          ...rc,
          invoice: "0.0",
          spend: "0.0",
          utility: "0.0"
        })),
        totalItems: revenueCenters.count,
        currentPage: page,
        totalPage: Math.ceil(revenueCenters.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all revenue centers", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all revenue centers" });
    }
  };

  findById = async (idRevenueCenter: number): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      const response = {
        ...revenueCenter,
        invoice: "0.0",
        spend: "0.0",
        utility: "0.0"
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find revenue center by id", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find revenue center by id" });
    }
  };

  create = async (request: schemas.CreateRevenueCenterSchema): Promise<ResponseEntity> => {
    try {
      const createData: IRevenueCenterCreate = {
        name: request.name,
        idCostCenterProject: request.idCostCenterProject,
        fromDate: request.fromDate,
        toDate: request.toDate,
      };
      const revenueCenter = await this.revenueCenterRepository.create(createData);
      const response = {
        ...revenueCenter,
        invoice: "0.0",
        spend: "0.0",
        utility: "0.0"
      };
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (error) {
      console.error("An error occurred while trying to create revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to create revenue center" });
    }
  };

  update = async (request: schemas.UpdateRevenueCenterSchema): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      const { idRevenueCenter, ...updateData } = request;
      const updatePayload: IRevenueCenterUpdate = {
        name: updateData.name,
        idCostCenterProject: updateData.idCostCenterProject,
        fromDate: updateData.fromDate,
        toDate: updateData.toDate,
      };
      await this.revenueCenterRepository.update(idRevenueCenter, updatePayload);

      const response = {
        ...revenueCenter,
        invoice: "0.0",
        spend: "0.0",
        utility: "0.0"
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to update revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to update revenue center" });
    }
  };

  delete = async (idRevenueCenter: number): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      await this.revenueCenterRepository.delete(idRevenueCenter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Revenue center deleted successfully" });
    } catch (error) {
      console.error("An error occurred while trying to delete revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete revenue center" });
    }
  };

  findAllMaterial = async (request: schemas.FindAllMaterialSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      let filter = this.buildFilter(request);
      filter = {
        ...filter,
        idInputType: sequelize.where(sequelize.col("Input.idInputType"), 1),
      };
      const inputs = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all materials", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all materials" });
    }
  };

  findAllInputs = async (request: schemas.FindAllInputsSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      let filter = this.buildFilter(request);
      filter = {
        ...filter,
        idInputType: sequelize.where(sequelize.col("Input.idInputType"), 3),
      };
      const orderItemDetails = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: orderItemDetails.rows,
        totalItems: orderItemDetails.count,
        currentPage: page,
        totalPage: Math.ceil(orderItemDetails.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all inputs", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all inputs" });
    }
  };

  findAllEpp = async (request: schemas.FindAllEppSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      let filter = this.buildFilter(request);
      filter = {
        ...filter,
        idInputType: sequelize.where(sequelize.col("Input.idInputType"), 2),
      };

      const orderItemDetails = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: orderItemDetails.rows,
        totalItems: orderItemDetails.count,
        currentPage: page,
        totalPage: Math.ceil(orderItemDetails.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all EPP", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all EPP" });
    }
  };

  findAllPerDiem = async (request: schemas.FindAllPerDiemSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      let filter = this.buildFilter(request);
      filter = {
        ...filter,
        idInputType: sequelize.where(sequelize.col("Input.idInputType"), 2),
      };
      const orderItemDetails = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: orderItemDetails.rows,
        totalItems: orderItemDetails.count,
        currentPage: page,
        totalPage: Math.ceil(orderItemDetails.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all per diem", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all per diem" });
    }
  };

  findAllPolicy = async (request: schemas.FindAllPolicySchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);
      const orderItemDetails = await this.orderRepository.findAllOrderItemDetail(filter, limit, offset);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: orderItemDetails.rows,
        totalItems: orderItemDetails.count,
        currentPage: page,
        totalPage: Math.ceil(orderItemDetails.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all policies", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all policies" });
    }
  };

  private buildFilter = (
    request: schemas.FindAllSchema
  ): { [key: string]: any } => {
    const filter: { [key: string]: any } = {};
  
    if (request.name) {
      filter.name = request.name;
    }
    if (request.idCostCenterProject) {
      filter.idCostCenterProject = request.idCostCenterProject;
    }
  
    return filter;
  };
} 