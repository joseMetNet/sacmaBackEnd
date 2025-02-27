import { ExpenditureRepository } from "./expenditure.repository";
import * as dtos from "./expenditure.interface";
import { ResponseEntity } from "../employee/interface";
import { BuildResponse } from "../../utils/build-response";
import { findPagination, StatusCode } from "../../utils/general.interfase";
import { deleteFile, uploadFile } from "../../utils";

export class ExpenditureService {

  private readonly expenditureRepository: ExpenditureRepository;

  constructor(expenditureRepository: ExpenditureRepository) {
    this.expenditureRepository = expenditureRepository;
  }

  findAll = async (request: dtos.FindAllDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);
      const expenditures = await this.expenditureRepository.findAll(limit, offset, filter);

      const response = {
        data: expenditures.rows,
        totalItems: expenditures.count,
        currentPage: page,
        totalPage: Math.ceil(expenditures.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all expenditures", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all expenditures" });
    }
  };

  findAllExpenditureItem = async (request: dtos.FindAllExpenditureItemDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildExpenditureItemFilter(request);
      const expenditureItems = await this.expenditureRepository.findAllExpenditureItem(limit, offset, filter);

      const response = {
        data: expenditureItems.rows,
        totalItems: expenditureItems.count,
        currentPage: page,
        totalPage: Math.ceil(expenditureItems.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all expenditure items", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all expenditure items" });
    }
  };

  findAllExpenditureType = async (): Promise<ResponseEntity> => {
    try {
      const expenditureTypes = await this.expenditureRepository.findAllExpenditureType();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, expenditureTypes );
    } catch (error) {
      console.error("An error occurred while trying to find all expenditure types", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all expenditure types" });
    }
  };

  findById = async (idExpenditure: number): Promise<ResponseEntity> => {
    try {
      const expenditure = await this.expenditureRepository.findById(idExpenditure);
      if (!expenditure) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure not found" });
      }

      const filter = { idExpenditure: expenditure.idExpenditure };
      const expenditureItems = await this.expenditureRepository.findAllExpenditureItem(-1, 0, filter);

      const totalValues = {
        valueFund: 1500000,
        spendFund: expenditureItems.rows.reduce((acc, item) => acc + parseFloat(item.value), 0),
        availableFund: 1500000 - expenditureItems.rows.reduce((acc, item) => acc + parseFloat(item.value), 0),
      };

      const response = {
        ...expenditure.toJSON(),
        totalValues
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find expenditure by id", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find expenditure by id" });
    }
  };

  create = async (request: dtos.CreateDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      let expenditure = await this.expenditureRepository.create(request);
      
      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        await uploadFile(filePath, identifier, contentType, "expenditure");
        expenditure.documentUrl = `https://sacmaback.blob.core.windows.net/expenditure/${identifier}.pdf`;
        expenditure = await expenditure.save();
      }
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, expenditure);
    } catch (error) {
      console.error("An error occurred while trying to create expenditure", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to create expenditure" });
    }
  };

  createExpenditureItem = async (request: dtos.CreateExpenditureItemDTO): Promise<ResponseEntity> => {
    try {
      const expenditure = await this.expenditureRepository.findById(request.idExpenditure);
      if (!expenditure) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure not found" });
      }
      const expenditureItem = await this.expenditureRepository.createExpenditureItem(request);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, expenditureItem);
    } catch (error) {
      console.error("An error occurred while trying to create expenditure item", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to create expenditure item" });
    }
  };

  createExpenditureType = async (request: dtos.CreateExpenditureTypeDTO): Promise<ResponseEntity> => {
    try {
      const expenditureType = await this.expenditureRepository.createExpenditureType(request);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, expenditureType);
    }
    catch (error) {
      console.error("An error occurred while trying to create expenditure type", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to create expenditure type" });
    }
  };

  update = async (request: dtos.UpdateDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      const expenditure = await this.expenditureRepository.findById(request.idExpenditure);
      if (!expenditure) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure not found" });
      }
      expenditure.idExpenditureType = request.idExpenditureType || expenditure.idExpenditureType;
      expenditure.idCostCenterProject = request.idCostCenterProject || expenditure.idCostCenterProject;
      expenditure.description = request.description || expenditure.description;
      expenditure.value = request.value || expenditure.value;
      expenditure.documentUrl = request.documentUrl || expenditure.documentUrl;
      expenditure.refundRequestDate = request.refundRequestDate || expenditure.refundRequestDate;

      if (expenditure.documentUrl && filePath) {
        const identifier = new URL(expenditure.documentUrl).pathname.split("/").pop();
        const deleteRequest = await deleteFile(identifier!, "expenditure");
        if (!deleteRequest) {
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete the file" });
        }
      }

      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        await uploadFile(filePath, identifier, contentType, "expenditure");
        expenditure.documentUrl = `https://sacmaback.blob.core.windows.net/expenditure/${identifier}.pdf`;
      }

      const response = await expenditure.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to update expenditure", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to update expenditure" });
    }
  };

  updateExpenditureItem = async (request: dtos.UpdateExpenditureItemDTO): Promise<ResponseEntity> => {
    try {
      const expenditureItem = await this.expenditureRepository.findByIdExpenditureItem(request.idExpenditureItem);
      if (!expenditureItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure item not found" });
      }

      expenditureItem.idCostCenterProject = request.idCostCenterProject || expenditureItem.idCostCenterProject;
      expenditureItem.value = request.value || expenditureItem.value;
      expenditureItem.description = request.description || expenditureItem.description;
      expenditureItem.createdAt = request.createdAt || expenditureItem.createdAt;
      expenditureItem.updatedAt = request.updatedAt || expenditureItem.updatedAt;

      const response = await expenditureItem.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to update expenditure item", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to update expenditure item" });
    }
  };

  updateExpenditureType = async (request: dtos.UpdateExpenditureTypeDTO): Promise<ResponseEntity> => {
    try {
      const expenditureType = await this.expenditureRepository.findExpenditureTypeById(request.idExpenditureType);
      if (!expenditureType) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure type not found" });
      }

      expenditureType.expenditureType = request.expenditureType || expenditureType.expenditureType;
      const response = await expenditureType.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to update expenditure type", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to update expenditure type" });
    }
  };

  delete = async (idExpenditure: number): Promise<ResponseEntity> => {
    try {
      const expenditure = await this.expenditureRepository.findById(idExpenditure);
      if (!expenditure) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure not found" });
      }

      const expenditureItems = await this.expenditureRepository.findAllExpenditureItem(-1, 0, { idExpenditure });
      await Promise.all(expenditureItems.rows.map(async (item) => await item.destroy()));
      
      await expenditure.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Expenditure deleted successfully" });
    } catch (error) {
      console.error("An error occurred while trying to delete expenditure", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete expenditure" });
    }
  };

  deleteExpenditureItem = async (idExpenditureItem: number): Promise<ResponseEntity> => {
    try {
      const expenditureItem = await this.expenditureRepository.findByIdExpenditureItem(idExpenditureItem);
      if (!expenditureItem) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure item not found" });
      }
      await expenditureItem.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Expenditure item deleted successfully" });
    } catch (error) {
      console.error("An error occurred while trying to delete expenditure item", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete expenditure item" });
    }
  };

  deleteExpenditureType = async (idExpenditureType: number): Promise<ResponseEntity> => {
    try {
      const expenditureType = await this.expenditureRepository.findExpenditureTypeById(idExpenditureType);
      if (!expenditureType) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Expenditure type not found" });
      }
      await expenditureType.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Expenditure type deleted successfully" });
    } catch (error) {
      console.error("An error occurred while trying to delete expenditure type", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete expenditure type" });
    }
  };

  private buildFilter = (request: dtos.FindAllDTO): { [key: string]: any } => {
    let filter = {};
    if (request.idExpenditureType) {
      filter = {
        ...filter,
        idExpenditureType: request.idExpenditureType,
      };
    }
    if (request.idCostCenterProject) {
      filter = {
        ...filter,
        idCostCenterProject: request.idCostCenterProject,
      };
    }
    if (request.consecutive) {
      filter = {
        ...filter,
        consecutive: request.consecutive,
      };
    }
    return filter;
  };

  private buildExpenditureItemFilter = (request: dtos.FindAllExpenditureItemDTO): { [key: string]: any } => {
    let filter = {};
    if (request.idExpenditure) {
      filter = {
        ...filter,
        idExpenditure: request.idExpenditure,
      };
    }
    if (request.idCostCenterProject) {
      filter = {
        ...filter,
        idCostCenterProject: request.idCostCenterProject,
      };
    }
    if (request.consecutive) {
      filter = {
        ...filter,
        consecutive: request.consecutive,
      };
    }
    return filter;
  };
}