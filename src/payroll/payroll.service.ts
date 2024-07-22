import { Op } from "sequelize";
import { dbConnection } from "../config";
import { EmployeePayrollRepository } from "./payroll.repository";
import { ResponseEntity } from "../services/interface";
import { IFindEmployeePayrollRequest, IUpdatePayroll, IUploadPayroll } from "./payroll.interface";
import { CustomError, deleteFile, uploadFile } from "../utils";
import { BuildResponse } from "../services";
import { StatusCode } from "../interfaces";
import sequelize from "sequelize";
import * as models from "../models";

export class EmployeePayrollService {
  constructor(
    private readonly employeePayrollRepository: EmployeePayrollRepository
  ) {
    this.employeePayrollRepository = employeePayrollRepository;
  }

  async findAll(request: IFindEmployeePayrollRequest): Promise<ResponseEntity> {
    try {
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
      const filter = this.buildFilter(request);
      const payrolls = await this.employeePayrollRepository.findAll(
        filter,
        limit,
        offset
      );
      if (payrolls instanceof CustomError) {
        return BuildResponse.buildErrorResponse(payrolls.statusCode, {
          message: payrolls.message,
        });
      }
      const totalItems = payrolls.count;
      const currentPage = page;
      const totalPages = Math.ceil(totalItems / limit);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: payrolls.rows,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  private buildFilter(request: IFindEmployeePayrollRequest) {
    let employeePayrollFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "year") {
        employeePayrollFilter = {
          ...employeePayrollFilter,
          paymentDate: sequelize.where(
            sequelize.fn("YEAR", sequelize.col("EmployeePayroll.paymentDate")),
            request.year
          ),
        };
      }
      if (key === "month") {
        employeePayrollFilter = {
          ...employeePayrollFilter,
          paymentDate: sequelize.where(
            sequelize.fn("MONTH", sequelize.col("EmployeePayroll.paymentDate")),
            request.month
          ),
        };
      }
      if (key === "idEmployee") {
        employeePayrollFilter = {
          ...employeePayrollFilter,
          idEmployee: request.idEmployee,
        };
      }
    }
    return employeePayrollFilter;
  }

  async  uploadPayroll(
    request: IUploadPayroll,
    filePath: string
  ): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const identifier = crypto.randomUUID();

      const uploadDocumentResponse = await uploadFile(filePath, identifier, "application/pdf", "payroll");
      if (uploadDocumentResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          uploadDocumentResponse.statusCode,
          {
            message: uploadDocumentResponse.message,
          }
        );
      }
      const url = `https://sacmaback.blob.core.windows.net/payroll/${identifier}.pdf`;
      await models.EmployeePayroll.create(
        {
          idEmployee: request.idEmployee,
          paymentDate: request.paymentDate,
          documentUrl: url,
        },
        { transaction }
      );

      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {
        message: "Payroll uploaded successfully",
      });
    } catch (err: any) {
      console.log(err);
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findById(id: number): Promise<ResponseEntity> {
    try {
      const payroll = await this.employeePayrollRepository.findById(id);
      if (payroll instanceof CustomError) {
        return BuildResponse.buildErrorResponse(payroll.statusCode, {
          message: payroll.message,
        });
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, payroll);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async deleteById(id: number): Promise<ResponseEntity> {
    try {
      const payroll = await models.EmployeePayroll.findByPk(id);
      if (!payroll) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Payroll not found",
        });
      }
      const identifier = payroll.documentUrl.split("/").pop() as string;
      const deleteBlobResponse = await deleteFile(identifier, "payroll");

      if (deleteBlobResponse instanceof CustomError) {
        return BuildResponse.buildErrorResponse(deleteBlobResponse.statusCode, {
          message: deleteBlobResponse.message,
        });
      }

      await payroll.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Payroll deleted successfully",
      });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async updateById(request: IUpdatePayroll, filePath?: string): Promise<ResponseEntity> {
    try {
      const payroll = await models.EmployeePayroll.findByPk(
        request.idEmployeePayroll
      );
      if (!payroll) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Payroll not found",
        });
      }
      await payroll.update({
        paymentDate: request.paymentDate,
      });

      if(filePath) {
        const identifier = crypto.randomUUID();
        const deleteBlobResponse = await deleteFile(
          payroll.documentUrl.split("/").pop() as string,
          "payroll"
        );
        if (deleteBlobResponse instanceof CustomError) {
          return BuildResponse.buildErrorResponse(deleteBlobResponse.statusCode, {
            message: deleteBlobResponse.message,
          });
        }
        const uploadDocumentResponse = await uploadFile(
          filePath,
          identifier,
          "application/pdf",
          "payroll"
        );
        if (uploadDocumentResponse instanceof CustomError) {
          return BuildResponse.buildErrorResponse(uploadDocumentResponse.statusCode, {
            message: uploadDocumentResponse.message,
          });
        }
        const url = `https://sacmaback.blob.core.windows.net/payroll/${identifier}.pdf`;
        await payroll.update({
          documentUrl: url,
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Payroll updated successfully",
      });
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }
}

const employeePayrollRepository = new EmployeePayrollRepository();
export const employeePayrollService = new EmployeePayrollService(
  employeePayrollRepository
);