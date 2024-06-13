import { CustomError } from "../../utils";
import { BuildResponse } from "../build-response";
import { 
  ResponseEntity
} from "../interface";
import { 
  StatusCode,
  ICreateEmployeeNovelty,
  IUpdateEmployeeNovelty
} from "../../interfaces";
import { EmployeeNovelty } from "../../models";
import { noveltyRepository } from "../../repositories";

export class NoveltyService {
  constructor() {}

  async findNoveltyById(idEmployeeNovelty: number): Promise<ResponseEntity> {
    try {
      const novelty = await noveltyRepository.findNoveltyById(idEmployeeNovelty);
      if(novelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: novelty.message} );
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, novelty);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async findNovelties(): Promise<ResponseEntity> {
    try {
      const novelties = await noveltyRepository.findEmployeeNovelties();
      console.log(novelties);
      if(novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, novelties);
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, novelties);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async createNovelty(novelty: ICreateEmployeeNovelty): Promise<ResponseEntity> {
    try {
      const dbNovelty = await noveltyRepository.findNovelty(novelty.idNovelty, novelty.idEmployee);
      if(!(dbNovelty instanceof CustomError)) {
        return BuildResponse.buildErrorResponse(StatusCode.Conflict, { message: "Novelty already exists" });
      }

      const newNovelty = await noveltyRepository.createNovelty(novelty);
      if(newNovelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, newNovelty);
      }

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newNovelty);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async updateNovelty(novelty: IUpdateEmployeeNovelty): Promise<ResponseEntity> {
    try {
      const dbEmployeeNovelty = await noveltyRepository.findNovelty(novelty.idNovelty, novelty.idEmployee);
      if(dbEmployeeNovelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(dbEmployeeNovelty.statusCode, {message: dbEmployeeNovelty.message} );
      }

      const updateEmployeeNovelty = this.buildUpdateNovelty(novelty, dbEmployeeNovelty);
      const newNovelty = await dbEmployeeNovelty.update(updateEmployeeNovelty);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, newNovelty);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async deleteNovelty(idNovelty: number): Promise<ResponseEntity> {
    try {
      const dbNovelty = await noveltyRepository.findNoveltyById(idNovelty);
      if(dbNovelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, dbNovelty);
      }

      await dbNovelty.destroy();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Novelty deleted" });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  private buildUpdateNovelty(
    novelty: IUpdateEmployeeNovelty, 
    dbEmployee: EmployeeNovelty
  ) {
    return {
      idNovelty: novelty.idNovelty ?? dbEmployee.idNovelty,
      loanValue: novelty.loanValue ?? dbEmployee.loanValue,
      idEmployee: novelty.idEmployee ?? dbEmployee.idEmployee,
      observation: novelty.observation ?? dbEmployee.observation
    };
  }
}

export const noveltyService = new NoveltyService();