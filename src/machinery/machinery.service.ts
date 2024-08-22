import { Op } from "sequelize";
import { StatusCode } from "../interfaces";
import { BuildResponse } from "../services";
import { ResponseEntity } from "../services/interface";
import * as dtos from "./machinery.interfase";
import { machineryRepository } from "./machinery.repository";
import { MachineryType } from "./machinery-type.model";
import { MachineryBrand } from "./machinery-brand.model";
import { MachineryModel } from "./machinery-model.model";

class MachineryService {
  async findAll(request: dtos.FindAllDTO): Promise<ResponseEntity> {
    let page = 1;
    if (request.page) {
      page = request.page;
    }
    let pageSize = 10;
    if (request.pageSize) {
      pageSize = request.pageSize;
    }
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const filter = this.buildFindAllFilter(request);
    try {
      if(request.pageSize === -1) {
        const machinery = await machineryRepository.findAll();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: machinery.rows });
      }
      const machinery = await machineryRepository.findAllAndSearch(filter, limit, offset);
      const response = {
        data: machinery.rows,
        totalItems: machinery.count,
        currentPage: page,
        totalPages: Math.ceil(machinery.count / limit),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findById(id: number): Promise<ResponseEntity> {
    try {
      const machinery = await machineryRepository.findById(id);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machinery);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async delete(id: number): Promise<ResponseEntity> {
    try {
      const machinery = await machineryRepository.findById(id);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }
      await machinery.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Machinery deleted" });
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryType(): Promise<ResponseEntity> {
    try {
      const machineryType = await MachineryType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryType);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryModel(): Promise<ResponseEntity> {
    try {
      const machineryModel = await MachineryModel.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryModel);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryBrand(): Promise<ResponseEntity> {
    try {
      const machineryBrand = await MachineryBrand.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryBrand);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }


  private buildFindAllFilter(request: dtos.FindAllDTO) {
    let supplierFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "socialReason") {
        supplierFilter = {
          ...supplierFilter,
          socialReason: {
            [Op.like]: "test",
          },
        };
      }
    }
    return supplierFilter;
  }
}

const machineryService = new MachineryService();
export { machineryService };