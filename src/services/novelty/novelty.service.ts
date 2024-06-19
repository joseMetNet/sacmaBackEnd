import { CustomError } from "../../utils";
import { BuildResponse } from "../build-response";
import { 
  ResponseEntity
} from "../interface";
import { 
  StatusCode,
  ICreateEmployeeNovelty,
  IUpdateEmployeeNovelty,
  IFindEmployeeRequest
} from "../../interfaces";
import { EmployeeNovelty } from "../../models";
import { noveltyRepository } from "../../repositories";
import sequelize, { Transaction } from "sequelize";
import { Op } from "sequelize";
import { deleteDocument, deleteImageProfile, uploadDocument } from "../helper";
import { dbConnection } from "../../config";

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

  async findNovelties(request: IFindEmployeeRequest): Promise<ResponseEntity> {
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
    try {
      const filter = this.buildFilter(request);
      const novelties = await noveltyRepository.findEmployeeNovelties(filter, limit, offset);
      if(novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(novelties.statusCode,{ message: novelties.message });
      }

      const totalItems = novelties.count;
      const currentPage = page;
      const totalPages = Math.ceil(totalItems / limit);
      console.log(`rows: ${JSON.stringify(novelties.rows)}`);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        employeeNovelties: novelties.rows,
        currentPage,
        totalPages,
        totalItems
      });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }


  private buildFilter(request: IFindEmployeeRequest) {
    let employeeNoveltyFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "noveltyYear") {
        employeeNoveltyFilter = { ...employeeNoveltyFilter, "noveltyYear": sequelize.where(sequelize.fn("YEAR", sequelize.col("EmployeeNovelty.createdAt")), request.noveltyYear) };
      }
      if (key === "noveltyMonth") {
        employeeNoveltyFilter = { ...employeeNoveltyFilter, "noveltyMonth": sequelize.where(sequelize.fn("MONTH", sequelize.col("EmployeeNovelty.createdAt")), request.noveltyMonth) };
      }
      if(key === "idNovelty") {
        employeeNoveltyFilter = { ...employeeNoveltyFilter, "idNovelty": request.idNovelty };
      }
    }

    let userFilter = {};
    if (request.identityCardNumber) {
      userFilter = { identityCardNumber: {[Op.substring]: request.identityCardNumber }};
    }
    if(request.firstName) {
      userFilter = { ...userFilter, firstName: {[Op.substring]: request.firstName }};
    }
    return [employeeNoveltyFilter, userFilter];
  }

  async createNovelty(novelty: ICreateEmployeeNovelty, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const dbNovelty = await noveltyRepository.findNovelty(novelty.idNovelty, novelty.idEmployee);
      if(!(dbNovelty instanceof CustomError)) {
        return BuildResponse.buildErrorResponse(StatusCode.Conflict, { message: "Novelty already exists" });
      }

      const newNovelty = await noveltyRepository.createNovelty(novelty, transaction);
      if(newNovelty instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, newNovelty);
      }

      if(filePath) {
        await this.uploadDocument(filePath, newNovelty, transaction);
      }

      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newNovelty);
    } catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  private async uploadDocument(document: string, employeeNovelty: EmployeeNovelty, transaction: Transaction) {
    const identifier = crypto.randomUUID();
    if(employeeNovelty.documentUrl != null) {
      const deleteBlobResponse = await deleteDocument(employeeNovelty.documentUrl.split("/").pop() as string);
      if (deleteBlobResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, { message: deleteBlobResponse.message });
      }
      const uploadDocumentResponse = await uploadDocument(document, identifier);
      if (uploadDocumentResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(uploadDocumentResponse.statusCode, {
          message: uploadDocumentResponse.message,
        });
      }
      const url = `https://sacmaback.blob.core.windows.net/document/${identifier}.png`;
      await employeeNovelty.update({ imageProfileUrl: url }, { transaction });
    }
    const uploadDocumentResponse = await uploadDocument(document, identifier);
    if (uploadDocumentResponse instanceof CustomError) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(uploadDocumentResponse.statusCode, {
        message: uploadDocumentResponse.message,
      });
    }
    const url = `https://sacmaback.blob.core.windows.net/document/${identifier}.png`;
    await employeeNovelty.update({ imageProfileUrl: url }, { transaction });
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
