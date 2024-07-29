import { Op } from "sequelize";
import { ResponseEntity } from "../services/interface";
import * as dtos from "./input.interface";
import { inputRepository } from "./input.repository";
import { BuildResponse } from "../services";
import { StatusCode } from "../interfaces";
import { InputType } from "./input-type.model";
import { InputUnitOfMeasure } from "./input-unit-of-measure.model";
import { Input } from "./input.model";

class InputService {
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
    const filter = this.buildFindAllInputFilter(request);

    try {
      if(pageSize === -1) {
        const suppliers = await inputRepository.findAll();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {data: suppliers.rows });
      }
      const suppliers = await inputRepository.findAllAndSearch(filter, limit, offset);
      const response = {
        data: suppliers.rows,
        totalItems: suppliers.count,
        currentPage: page,
        totalPages: Math.ceil(suppliers.count / limit),
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
      const input = await inputRepository.findById(id);
      if (!input) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Input not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, input);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findInputTypes(): Promise<ResponseEntity> {
    try {
      const inputTypes = await InputType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, inputTypes);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findUnitOfMeasures(): Promise<ResponseEntity> {
    try {
      const response = await InputUnitOfMeasure.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async delete(id: number): Promise<ResponseEntity> {
    try {
      const input = await inputRepository.findById(id);
      if (!input) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Input not found" }
        );
      }
      await input.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Input deleted" });
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async create(request: dtos.CreateInputDTO): Promise<ResponseEntity> {
    try {
      const input = await Input.create({
        name: request.name,
        idInputType: request.idInputType,
        code: request.code,
        idInputUnitOfMeasure: request.idInputUnitOfMeasure,
        cost: request.cost,
        idSupplier: request.idSupplier,
        vat: request.vat,
        price: request.price,
      });
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, input);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async update(request: dtos.UpdateInputDTO): Promise<ResponseEntity> {
    try {
      const input = await inputRepository.findById(request.idInput);
      if (!input) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Input not found" }
        );
      }
      input.name = request.name ?? input.name;
      input.idInputType = request.idInputType ?? input.idInputType;
      input.code = request.code ?? input.code;
      input.idInputUnitOfMeasure = request.idInputUnitOfMeasure ?? input.idInputUnitOfMeasure;
      input.cost = request.cost ?? input.cost;
      input.idSupplier = request.idSupplier ?? input.idSupplier;
      input.vat = request.vat ?? input.vat;
      input.price = request.price ?? input.price;
      await input.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, input);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  private buildFindAllInputFilter(request: dtos.FindAllDTO) {
    let inputFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "name") {
        inputFilter = {
          ...inputFilter,
          name: {
            [Op.like]: `%${request.name}%`,
          },
        };
      }
    }
    return inputFilter;
  }
}

const inputService = new InputService();
export { inputService };