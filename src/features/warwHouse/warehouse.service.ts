import { WareHouseRepository } from "./warehouse.repository";
import * as dtos from "./warehouse.interface";
import { ResponseEntity } from "../employee/interface";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { Op } from "sequelize";

export class WareHouseService {
  private wareHouseRepository: WareHouseRepository;
  
  constructor(wareHouseRepository: WareHouseRepository) {
    this.wareHouseRepository = wareHouseRepository;
  }

  findAll = async (request: any): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset, returnAll } = this.getPagination(request);
      const filter = this.buildFilter(request);
      
      if (returnAll) {
        // Si pageSize es -1, retornar todos los registros sin paginación
        const wareHouses = await this.wareHouseRepository.findAll(filter);
        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          wareHouses.rows
        );
      } else {
        // Paginación normal
        const wareHouses = await this.wareHouseRepository.findAll(filter, limit, offset);
        const response = {
          data: wareHouses.rows,
          totalItems: wareHouses.count,
          currentPage: page,
          totalPages: Math.ceil(wareHouses.count / pageSize)
        };

        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          response
        );
      }
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching warehouses" }
      );
    }
  };

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const wareHouse = await this.wareHouseRepository.findById(id);
      if (!wareHouse) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Warehouse not found" }
        };
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, wareHouse);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while fetching warehouse" }
      );
    }
  };

  create = async (request: dtos.CreateWareHouse): Promise<ResponseEntity> => {
    try {
      const newWareHouse = await this.wareHouseRepository.create(request);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newWareHouse);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while creating warehouse" }
      );
    }
  };

  update = async (request: dtos.UpdateWareHouse): Promise<ResponseEntity> => {
    try {
      const existingWareHouse = await this.wareHouseRepository.findById(request.idWarehouse);
      if (!existingWareHouse) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Warehouse not found" }
        };
      }

      await this.wareHouseRepository.update(request);
      const updatedWareHouse = await this.wareHouseRepository.findById(request.idWarehouse);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedWareHouse!);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while updating warehouse" }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const existingWareHouse = await this.wareHouseRepository.findById(id);
      if (!existingWareHouse) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Warehouse not found" }
        };
      }

      await this.wareHouseRepository.delete(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Warehouse deleted successfully"
      });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while deleting warehouse" }
      );
    }
  };

  softDelete = async (id: number): Promise<ResponseEntity> => {
    try {
      const existingWareHouse = await this.wareHouseRepository.findById(id);
      if (!existingWareHouse) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Warehouse not found" }
        };
      }

      await this.wareHouseRepository.softDelete(id);
      const updatedWareHouse = await this.wareHouseRepository.findById(id);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, updatedWareHouse!);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while soft deleting warehouse" }
      );
    }
  };

  restore = async (id: number): Promise<ResponseEntity> => {
    try {
      const existingWareHouse = await this.wareHouseRepository.findById(id);
      if (!existingWareHouse) {
        return {
          status: StatusValue.Failed,
          code: StatusCode.NotFound,
          data: { message: "Warehouse not found" }
        };
      }

      await this.wareHouseRepository.restore(id);
      const restoredWareHouse = await this.wareHouseRepository.findById(id);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, restoredWareHouse!);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error while restoring warehouse" }
      );
    }
  };

  private getPagination = (request: any) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    
    // Si pageSize es -1, significa que quiere todos los registros
    const returnAll = pageSize === -1;
    
    const limit = returnAll ? undefined : pageSize;
    const offset = returnAll ? undefined : (page - 1) * pageSize;
    
    return { page, pageSize, limit, offset, returnAll };
  };

  private buildFilter = (request: any) => {
    const filter: { [key: string]: any } = {};

    if (request.name) {
      filter.name = { [Op.like]: `%${request.name}%` };
    }

    if (request.isActive !== undefined) {
      filter.isActive = request.isActive === "true";
    }

    return filter;
  };
}