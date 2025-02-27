import { CustomError } from "../../utils";
import * as ExcelJS from "exceljs";
import {
  ResponseEntity
} from "../employee/interface";
import {
  StatusCode,
} from "../../utils/general.interfase";
import sequelize, { Transaction } from "sequelize";
import { Op } from "sequelize";
import { dbConnection } from "../../config";
import { noveltyRepository } from "./novelty.repository";
import { EmployeeNovelty } from "./employee-novelty.model";
import { Periodicity } from "./periodicity.model";
import { Novelty } from "./novelty.model";
import { Employee, Position } from "../employee";
import { User } from "../authentication";
import { deleteDocument, uploadDocument } from "../../utils/helper";
import { ICreateEmployeeNovelty, IFindEmployeeRequest, IUpdateEmployeeNovelty } from "./novelty.interface";
import { BuildResponse } from "../../utils/build-response";

export class NoveltyService {
  constructor() { }

  async findNoveltyById(idEmployeeNovelty: number): Promise<ResponseEntity> {
    try {
      const novelty = await noveltyRepository.findNoveltyById(idEmployeeNovelty);
      if (novelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: novelty.message });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, novelty);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async createExcelFileBuffer() {
    try {
      const employeeNovelties = await EmployeeNovelty.findAll({
        include: [
          {
            model: Novelty,
            required: true
          },
          {
            model: Periodicity,
            required: false
          },
          {
            model: Employee,
            required: true,
            attributes: ["idPosition", "idUser", "idEmployee"],
            include: [
              {
                model: Position,
                attributes: ["position"],
                required: false,
              },
              {
                model: User,
                attributes: ["firstName", "lastName", "identityCardNumber"],
                required: true,
              }
            ]
          }
        ],
      });

      if (employeeNovelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(
          StatusCode.InternalErrorServer,
          { message: employeeNovelties.message }
        );
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      worksheet.columns = [
        { header: "Cédula", key: "identityCardNumber", width: 20 },
        { header: "Nombre", key: "firstName", width: 20 },
        { header: "Apellido", key: "lastName", width: 20 },
        { header: "Cargo", key: "position", width: 20 },
        { header: "Novedad", key: "novelty", width: 20 },
        { header: "Fecha de inicio", key: "createdAt", width: 20 },
        { header: "Fecha de fin", key: "endAt", width: 20 },
        { header: "Valor del prestamo", key: "loanValue", width: 20 },
        { header: "Periodicidad", key: "periodicity", width: 20 },
        { header: "Cuotas", key: "installment", width: 20 },
        { header: "Observación", key: "observation", width: 20 },
      ];

      employeeNovelties.forEach((item) => {
        const row = item.toJSON();
        worksheet.addRow({
          identityCardNumber: row.Employee.User.identityCardNumber,
          firstName: row.Employee.User.firstName,
          lastName: row.Employee.User.lastName,
          position: row.Employee.Position.position,
          novelty: row.Novelty.novelty,
          createdAt: row.createdAt,
          endAt: row.endAt,
          loanValue: row.loanValue,
          periodicity: row.Periodicity?.periodicity,
          installment: row.installment,
          observation: row.observation,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (err: any) {
      console.error(`error: ${JSON.stringify(err)}`);
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
      if (novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(novelties.statusCode, { message: novelties.message });
      }

      const totalItems = novelties.count;
      const currentPage = page;
      const totalPages = Math.ceil(totalItems / limit);

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

  async findNoveltiesByModule(module: string): Promise<ResponseEntity> {
    try {
      const novelties = await noveltyRepository.findNoveltiesByModule(module);
      if (novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: novelties.message });
      }

      const response = novelties.map((novelty) => {
        const item = novelty.toJSON();
        return {
          idNovelty: item.idNovelty,
          novelty: item.novelty,
        };
      });

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async findNoveltyTypes(): Promise<ResponseEntity> {
    try {
      const novelties = await Novelty.findAll();
      if (novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: novelties.message });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, novelties);
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
      if (key === "idNovelty") {
        employeeNoveltyFilter = { ...employeeNoveltyFilter, "idNovelty": request.idNovelty };
      }
    }

    let userFilter = {};
    if (request.identityCardNumber) {
      userFilter = { identityCardNumber: { [Op.substring]: request.identityCardNumber } };
    }
    if (request.firstName) {
      userFilter = { ...userFilter, firstName: { [Op.substring]: request.firstName } };
    }
    return [employeeNoveltyFilter, userFilter];
  }

  async createNovelty(novelty: ICreateEmployeeNovelty, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {

      const newNovelty = await noveltyRepository.createNovelty(novelty, transaction);
      if (newNovelty instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, newNovelty);
      }


      if (filePath) {
        await this.uploadDocument(filePath, newNovelty, transaction);
      }

      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newNovelty);
    } catch (err: any) {
      console.error(err);
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: err.message });
    }
  }

  private async uploadDocument(document: string, employeeNovelty: EmployeeNovelty, transaction: Transaction) {
    const identifier = crypto.randomUUID();
    if (employeeNovelty.documentUrl != null) {
      const deleteBlobResponse = await deleteDocument(employeeNovelty.documentUrl.split("/").pop() as string);
      if (deleteBlobResponse instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, { message: deleteBlobResponse.message });
      }
      const uploadDocumentResponse = await uploadDocument(document, identifier);
      if (uploadDocumentResponse instanceof CustomError) {
        return BuildResponse.buildErrorResponse(uploadDocumentResponse.statusCode, {
          message: uploadDocumentResponse.message,
        });
      }
      const url = `https://sacmaback.blob.core.windows.net/document/${identifier}.pdf`;
      await employeeNovelty.update({ documentUrl: url }, { transaction });
    }
    const uploadDocumentResponse = await uploadDocument(document, identifier);
    if (uploadDocumentResponse instanceof CustomError) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(uploadDocumentResponse.statusCode, {
        message: uploadDocumentResponse.message,
      });
    }
    const url = `https://sacmaback.blob.core.windows.net/document/${identifier}.pdf`;
    await employeeNovelty.update({ documentUrl: url }, { transaction });
  }

  async updateNovelty(employeeNovelty: IUpdateEmployeeNovelty, document?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const dbEmployeeNovelty = await noveltyRepository.findEmployeeNovelty(employeeNovelty.idEmployeeNovelty);
      if (dbEmployeeNovelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(dbEmployeeNovelty.statusCode, { message: dbEmployeeNovelty.message });
      }

      const updateEmployeeNovelty = this.buildUpdateEmployeeNovelty(employeeNovelty, dbEmployeeNovelty);
      const newNovelty = await dbEmployeeNovelty.update(updateEmployeeNovelty, { transaction });

      if (document) {
        await this.uploadDocument(document, newNovelty, transaction);
      }

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, newNovelty);
    } catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async findPeriodicities(): Promise<ResponseEntity> {
    try {
      const periodicities = await Periodicity.findAll();
      if (periodicities instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: periodicities.message });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, periodicities);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  async deleteEmployeeNovelty(idEmployeeNovelty: number): Promise<ResponseEntity> {
    try {
      const dbEmployeeNovelty = await noveltyRepository.findNoveltyById(idEmployeeNovelty);
      if (dbEmployeeNovelty instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, dbEmployeeNovelty);
      }

      await dbEmployeeNovelty.destroy();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Novelty deleted" });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  private buildUpdateEmployeeNovelty(
    employeeNovelty: IUpdateEmployeeNovelty,
    dbEmployee: EmployeeNovelty
  ) {
    return {
      idNovelty: employeeNovelty.idNovelty ?? dbEmployee.idNovelty,
      createdAt: employeeNovelty.createdAt ?? dbEmployee.createdAt,
      endAt: employeeNovelty.endAt ?? dbEmployee.endAt,
      loanValue: employeeNovelty.loanValue ?? dbEmployee.loanValue,
      idPeriodicity: employeeNovelty.idPeriodicity ?? dbEmployee.idPeriodicity,
      installment: employeeNovelty.installment ?? dbEmployee.installment,
      observation: employeeNovelty.observation ?? dbEmployee.observation
    };
  }
}

export const noveltyService = new NoveltyService();
