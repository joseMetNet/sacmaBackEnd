import { RevenueCenterRepository } from "./revenue-center.repository";
import { ResponseEntity } from "../employee/interface";
import { BuildResponse } from "../../utils/build-response";
import { findPagination, StatusCode } from "../../utils/general.interfase";
import { IRevenueCenterCreate, IRevenueCenterUpdate } from "./revenue-center.interface";
import * as schemas from "./revenue-center.schema";
import { OrderRepository } from "../order/order.repository";
import { ExpenditureRepository } from "../expenditure";

export class RevenueCenterService {
  private readonly revenueCenterRepository: RevenueCenterRepository;
  private readonly orderRepository: OrderRepository;
  private readonly expenditureRepository: ExpenditureRepository;

  constructor(
    revenueCenterRepository: RevenueCenterRepository,
    orderRepository: OrderRepository,
    expenditureRepository: ExpenditureRepository
  ) {
    this.revenueCenterRepository = revenueCenterRepository;
    this.orderRepository = orderRepository;
    this.expenditureRepository = expenditureRepository;
  }

  findAll = async (request: schemas.FindAllSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);

      // Fetch data concurrently
      const [revenueCenters, inputs, expenditures] = await Promise.all([
        this.revenueCenterRepository.findAll(limit, offset, filter),
        this.revenueCenterRepository.findInputValues(),
        this.expenditureRepository.findAllValues(),
      ]);

      // Combine inputs and expenditures and group them in one pass
      const groupedSpend = [...inputs, ...expenditures].reduce<Record<number, number>>((acc, curr) => {
        const key = curr.idCostCenterProject;
        acc[key] = (acc[key] || 0) + curr.totalValue;
        return acc;
      }, {});

      const rows = revenueCenters.rows.map((revenueCenter) => {
        const spend = groupedSpend[revenueCenter.idCostCenterProject] || 0;
        return {
          idRevenueCenter: revenueCenter.idRevenueCenter,
          name: revenueCenter.name,
          idCostCenterProject: revenueCenter.idCostCenterProject,
          idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
          idQuotation: revenueCenter.idQuotation,
          fromDate: revenueCenter.fromDate,
          toDate: revenueCenter.toDate,
          createdAt: revenueCenter.createdAt,
          updatedAt: revenueCenter.updatedAt,
          invoice: "0.0", // Consider if this needs calculation
          spend: spend.toString(), // Ensure spend is a string if needed, or keep as number
          utility: "0.0", // Consider if this needs calculation
          CostCenterProject: revenueCenter.toJSON().CostCenterProject,
        };
      });

      const response = {
        data: rows,
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
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
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
        idRevenueCenterStatus: request.idRevenueCenterStatus,
        idQuotation: request.idQuotation,
        fromDate: request.fromDate,
        toDate: request.toDate,
      };
      const revenueCenter = await this.revenueCenterRepository.create(createData);
      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
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
        idRevenueCenterStatus: updateData.idRevenueCenterStatus,
        idQuotation: updateData.idQuotation,
        fromDate: updateData.fromDate,
        toDate: updateData.toDate,
      };
      await this.revenueCenterRepository.update(idRevenueCenter, updatePayload);

      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
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
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 1
      };
      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all materials", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all materials" });
    }
  };

  findAllMaterialSummary = async (request: schemas.FindAllMaterialSummarySchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 1
      };
      const inputs = await this.revenueCenterRepository.findAllInputSummary(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all materials summary", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all materials summary" });
    }
  };

  findAllInputs = async (request: schemas.FindAllInputsSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 3,
      };
      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all inputs", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all inputs" });
    }
  };

  findAllEpp = async (request: schemas.FindAllEppSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 2
      };

      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all EPP", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all EPP" });
    }
  };

  findAllPerDiem = async (request: schemas.FindAllPerDiemSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);

      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);

      if (!revenueCenter) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
          data: [],
          totalItems: 0,
          currentPage: page,
          totalPage: 0,
        });
      }

      let filter = this.buildFilter(request);
      filter = {
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idExpenditureType: 2
      };

      const orderItemDetails = await this.expenditureRepository.findAll(limit, offset, filter);

      const rows = orderItemDetails.rows.map((item) => ({
        idCostCenterProject: item.idCostCenterProject,
        description: item.description,
        unitValue: item.value,
        totalValue: item.value,
        quantity: 1,
        orderNumber: item.orderNumber,
        refundRequestDate: item.refundRequestDate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        projectName: item.toJSON().CostCenterProject.name,
      }));

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: rows,
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

      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);

      if (!revenueCenter) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
          data: [],
          totalItems: 0,
          currentPage: page,
          totalPage: 0,
        });
      }

      let filter = this.buildFilter(request);
      filter = {
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idExpenditureType: 26
      };

      const orderItemDetails = await this.expenditureRepository.findAll(limit, offset, filter);

      const rows = orderItemDetails.rows.map((item) => ({
        idCostCenterProject: item.idCostCenterProject,
        description: item.description,
        unitValue: item.value,
        totalValue: item.value,
        quantity: 1,
        orderNumber: item.orderNumber,
        refundRequestDate: item.refundRequestDate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        projectName: item.toJSON().CostCenterProject.name,
      }));
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: rows,
        totalItems: orderItemDetails.count,
        currentPage: page,
        totalPage: Math.ceil(orderItemDetails.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all policies", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all policies" });
    }
  };

  findAllWorkTracking = async (request: schemas.FindAllWorkTrackingSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        ...(request.idCostCenterProject && { idCostCenterProject: request.idCostCenterProject }),
      };

      const workTrackingData = await this.revenueCenterRepository.findAllWorkTracking(limit, offset, filter);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: workTrackingData.rows,
        totalItems: workTrackingData.count,
        currentPage: page,
        totalPage: Math.ceil(workTrackingData.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all work tracking data", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all work tracking data" });
    }
  };

  findAllQuotation = async (request: schemas.FindAllQuotationSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter
      };

      const quotations = await this.revenueCenterRepository.findAllQuotation(limit, offset, filter);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: quotations.rows,
        totalItems: quotations.count,
        currentPage: page,
        totalPage: Math.ceil(quotations.count / pageSize),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all quotations", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all quotations" });
    }
  };

  findAllRevenueCenterStatus = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.revenueCenterRepository.findAllRevenueCenterStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (error) {
      console.error("An error occurred while trying to find all revenue center statuses", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all revenue center statuses" });
    }
  };

  private buildFilter = (
    request: schemas.FindAllSchema
  ): { [key: string]: any } => {
    const filter: { [key: string]: any } = {};

    if (request.name) {
      filter.name = request.name;
    }

    if (request.idRevenueCenter) {
      filter.idRevenueCenter = request.idRevenueCenter;
    }

    if (request.idCostCenterProject) {
      filter.idCostCenterProject = request.idCostCenterProject;
    }

    if (request.idRevenueCenterStatus) {
      filter.idRevenueCenterStatus = request.idRevenueCenterStatus;
    }

    return filter;
  };
}