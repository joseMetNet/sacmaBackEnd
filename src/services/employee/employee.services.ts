import { Op, QueryTypes, Transaction } from "sequelize";
import { dbConnection } from "../../config";
import * as ExcelJS from "exceljs";
import {
  ChagePasswordRequest,
  IUploadDocument,
  StatusCode,
  UpdateEmployeeRequest,
} from "../../interfaces";
import * as models from "../../models";
import {
  EmployeeRepository,
} from "../../repositories";
import { CustomError } from "../../utils";
import { BuildResponse } from "../build-response";
import {
  deleteDocument,
  deleteImageProfile,
  uploadDocument,
  uploadImageProfile,
} from "../../utils/helper";
import { ResponseEntity } from "../interface";
import sequelize from "sequelize";
import { AuthenticationRepository, Role, User } from "../../authentication";

export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthenticationRepository
  ) {
    this.employeeRepository = employeeRepository;
    this.authRepository = authRepository;
  }

  async findEmployeeAndRoles(): Promise<ResponseEntity> {
    try {
      const employees = await this.employeeRepository.findEmployeeAndRoles();
      if (employees instanceof CustomError) {
        return BuildResponse.buildErrorResponse(employees.statusCode, {
          message: employees.message,
        });
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, employees);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  private async findAll(request: IFindEmployeeRequest): Promise<{ rows: models.Employee[]; count: number }> {
    const employees: { rows: models.Employee[]; count: number } =
      await models.Employee.findAndCountAll({
        attributes: {
          exclude: [
            "idUser",
            "idPosition",
            "idContractType",
            "idPaymentType",
            "idArl",
            "idEps",
            "idEmergencyContact",
            "idBankAccount",
            "idPensionFund",
            "idCompensationFund",
          ],
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "idRole",
                "idIdentityCard",
                "idIdentityCardExpeditionCity",
              ],
            },
            order: [["firstName", "ASC"]],
            required: false,
            include: [
              { model: Role, required: true},
              { model: models.IdentityCard, required: false },
              { model: models.City, required: false },
            ],
          },
          { model: models.Position, required: false },
          { model: models.ContractType, required: false },
          { model: models.PaymentType, required: false },
          { model: models.Arl, required: false },
          { model: models.Eps, required: false },
          { model: models.EmergencyContact, required: false },
          { model: models.BankAccount, required: false },
          { model: models.PensionFund, required: false },
          { model: models.EmployeeRequiredDocument, required: false },
        ],
        where: request.idRole? sequelize.where(sequelize.col("User.idRole"), request.idRole) : {},
        distinct: true,
      });
    return employees;
  }

  async findEmployees(request: IFindEmployeeRequest): Promise<ResponseEntity> {
    if (request.pageSize === -1) {
      const employees = await this.findAll(request);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, employees);
    }
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

    try {
      const employees =
        await models.Employee.findAndCountAll({
          include: [
            {
              model: User,
              required: true,
              include: [
                { model: Role, required: false },
                { model: models.IdentityCard, required: false },
                { model: models.City, required: false },
              ],
              where: filter,
            },
            { model: models.Position, required: false },
            { model: models.ContractType, required: false },
            { model: models.PaymentType, required: false },
            { model: models.Arl, required: false },
            { model: models.Eps, required: false },
            { model: models.EmergencyContact, required: false },
            { model: models.BankAccount, required: false },
            { model: models.PensionFund, required: false },
            { model: models.EmployeeRequiredDocument, required: false },
          ],
          limit: limit,
          offset: offset,
          order: [[sequelize.literal("[User.firstName]"), "ASC"]],
          distinct: true,
        });
      const totalItems = employees.count;
      const currentPage = page;
      const totalPages = Math.ceil(totalItems / limit);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: employees,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (err: any) {
      console.error(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async uploadDocument(request: IUploadDocument, filePath: string) {
    const transaction = await dbConnection.transaction();
    try {
      const employeeRequiredDocument = await models.EmployeeRequiredDocument.findOne({
        where: {
          idEmployee: request.idEmployee,
          idRequiredDocument: request.idRequiredDocument,
        },
      });

      if (employeeRequiredDocument && employeeRequiredDocument.documentUrl) {
        const deleteBlobResponse = await deleteDocument(
          employeeRequiredDocument.documentUrl.split("/").pop() as string
        );
        if (deleteBlobResponse instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
            message: deleteBlobResponse.message,
          });
        }
      }

      const identifier = crypto.randomUUID();
      const uploadDocumentResponse = await uploadDocument(filePath, identifier);
      if (uploadDocumentResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          uploadDocumentResponse.statusCode,
          { message: uploadDocumentResponse.message }
        );
      }

      const url = `https://sacmaback.blob.core.windows.net/document/${identifier}.pdf`;

      if (employeeRequiredDocument) {
        await employeeRequiredDocument.update(
          {
            documentUrl: url,
            expirationDate: employeeRequiredDocument.expirationDate,
          },
          { transaction }
        );
      } else {
        await models.EmployeeRequiredDocument.create(
          {
            idEmployee: request.idEmployee,
            idRequiredDocument: request.idRequiredDocument,
            documentUrl: url,
            expirationDate: request.expirationDate ?? null,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Document uploaded successfully",
      });
    } catch (err: any) {
      await transaction.rollback();
      console.log(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  async updateEmployee(
    employee: UpdateEmployeeRequest,
    imageProfile?: string
  ): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const user = await User.findByPk(employee.idUser);
      if (!user) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "User not found",
        });
      }

      const userMicro = await this.authRepository.findUserByEmail(
        user.userName ?? ""
      );
      if (
        userMicro instanceof CustomError &&
        employee.password &&
        employee.userName
      ) {
        const newUser = await this.authRepository.registerRequest(employee);
        if (newUser instanceof CustomError) {
          return BuildResponse.buildErrorResponse(newUser.statusCode, {
            message: newUser.message,
          });
        }
      }

      if (
        typeof userMicro === "number" &&
        employee.password &&
        employee.userName
      ) {
        const changePasswordRequest: ChagePasswordRequest = {
          email: user.userName,
          password: employee.password,
        };
        const passwordUpdated = await this.authRepository.changePassword(
          changePasswordRequest
        );
        if (passwordUpdated instanceof CustomError) {
          return BuildResponse.buildErrorResponse(passwordUpdated.statusCode, {
            message: passwordUpdated.message,
          });
        }
      }

      const updatedUser = this.updateUser(employee, user);
      await user.update(updatedUser, { transaction });

      const dbEmployee = await models.Employee.findOne({
        where: { idUser: employee.idUser },
        transaction,
      });

      if (imageProfile) {
        await this.uploadImage(imageProfile, user, transaction);
      }

      if (dbEmployee) {
        const updatedEmployee = this.updateEmployeeRequest(
          employee,
          dbEmployee
        );
        await dbEmployee.update(updatedEmployee, { transaction });
        const idEmergencyContact = dbEmployee.get(
          "idEmergencyContact"
        ) as number;
        const emergencyContact = await models.EmergencyContact.findByPk(
          idEmergencyContact,
          { transaction }
        );

        if (emergencyContact) {
          const updatedEmergencyContact = this.updateEmergencyContactRequest(
            employee,
            emergencyContact
          );
          await emergencyContact.update(updatedEmergencyContact, {
            transaction,
          });
        }
      }

      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Employee updated successfully",
      });
    } catch (err: any) {
      await transaction.rollback();
      console.error(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async changeEmployeeStatus(idEmployee: number): Promise<ResponseEntity> {
    try {
      const employee = await models.Employee.findByPk(idEmployee);
      if (!employee) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Employee not found",
        });
      }

      const user = await User.findByPk(employee.idUser);
      if (!user) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "User not found",
        });
      }

      // Toggle the user status
      await user.update({ status: !user.status });

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "User status updated successfully",
      });
    } catch (err: any) {
      console.error("Error changing employee status:", err); // Improved logging
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  private async uploadImage(
    imageProfile: string,
    user: User,
    transaction: Transaction
  ) {
    const identifier = crypto.randomUUID();
    if (user.imageProfileUrl != null) {
      const deleteBlobResponse = await deleteImageProfile(
        user.imageProfileUrl.split("/").pop() as string
      );
      if (deleteBlobResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
          message: deleteBlobResponse.message,
        });
      }
      const uploadDocumentResponse = await uploadImageProfile(
        imageProfile,
        identifier
      );
      if (uploadDocumentResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          uploadDocumentResponse.statusCode,
          {
            message: uploadDocumentResponse.message,
          }
        );
      }
      const url = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      await user.update({ imageProfileUrl: url }, { transaction });
    }
    const uploadDocumentResponse = await uploadImageProfile(
      imageProfile,
      identifier
    );
    if (uploadDocumentResponse instanceof CustomError) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(
        uploadDocumentResponse.statusCode,
        {
          message: uploadDocumentResponse.message,
        }
      );
    }
    const url = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
    await user.update({ imageProfileUrl: url }, { transaction });
  }

  async findEmployeeById(id: number): Promise<ResponseEntity> {
    try {
      const employee = await employeeRepository.findEmployeeById(id);

      if (employee instanceof CustomError) {
        return BuildResponse.buildErrorResponse(employee.statusCode, {
          message: employee.message,
        });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, employee);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  deleteNullProperties(obj: any) {
    const ids = [
      "idPosition",
      "idContractType",
      "idPaymentType",
      "idBankAccount",
      "idEps",
      "idArl",
      "idPensionFund",
      "idCompensationFund",
    ];
    for (const propName in ids) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }

  async deleteEmployee(id: number): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const employee = await models.Employee.findByPk(id);
      if (!employee) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Employee not found",
        });
      }
      const user = await User.findByPk(employee.idUser);
      if (!user) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "User not found",
        });
      }
      const emergencyContact = await models.EmergencyContact.findByPk(
        employee.idEmergencyContact
      );
      if (!emergencyContact) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Emergency contact not found",
        });
      }
      await employee.destroy({ transaction });
      await emergencyContact.destroy({ transaction });
      await user.destroy({ transaction });

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Employee deleted successfully",
      });
    } catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  async createExcelFileBuffer() {
    try {
      const employees = await models.Employee.findAll({
        include: [
          { all: true, required: false }
        ],
      });
      if (employees instanceof CustomError) {
        throw new CustomError(employees.statusCode, employees.message);
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      worksheet.columns = [
        { header: "Cedula", key: "identityCardNumber", width: 20 },
        { header: "Nombre", key: "firstName", width: 20 },
        { header: "Apellidos", key: "lastName", width: 20 },
        { header: "Telefono", key: "phoneNumber", width: 20 },
        { header: "Correo", key: "email", width: 20 },
        { header: "Direccion", key: "address", width: 20 },
        { header: "Eps", key: "eps", width: 20 },
        { header: "AFP", key: "pensionFund", width: 20 },
        { header: "Caja", key: "compensationFund", width: 20 },
        { header: "Fondo Pensiones", key: "severancePay", width: 20 },
        { header: "Fecha inicio contrato", key: "entryDate", width: 20 },
        { header: "Tipo contrato", key: "contractType", width: 20 },
        { header: "Cargo", key: "position", width: 20 },
        { header: "Ingreso", key: "ingreso", width: 20 },
        { header: "Novedad", key: "novedad", width: 20 },
        { header: "Vacación", key: "vacacion", width: 20 },
        { header: "Permiso", key: "permiso", width: 20 },
        { header: "Sanción", key: "sancion", width: 20 },
        { header: "Retiro", key: "retiro", width: 20 },
        { header: "Incapacitado", key: "incapacitado", width: 20 },
        { header: "Prestamo", key: "prestamo", width: 20 },
      ];

      const novelties = await dbConnection.query<NoveltySummary>(`
        SELECT
          tu.identityCardNumber,
          tn.novelty,
          COUNT(1) total
        FROM mvp1.TB_EmployeeNovelty ten
        INNER JOIN mvp1.TB_Employee te ON te.idEmployee=ten.idEmployee AND (te.deletedAt IS NULL)
        INNER JOIN mvp1.TB_Novelty tn ON tn.idNovelty=ten.idNovelty
        INNER JOIN mvp1.TB_User tu ON tu.idUser=te.idUser AND (tu.deletedAt IS NULL)
        WHERE ten.deletedAt IS NULL
        GROUP BY tu.identityCardNumber,  tn.novelty;
        `, { type: QueryTypes.SELECT });

      employees.forEach((employee) => {
        const row = employee.toJSON();
        worksheet.addRow({
          identityCardNumber: row.User?.identityCardNumber,
          firstName: row.User?.firstName,
          lastName: row.User?.lastName,
          phoneNumber: row.User?.phoneNumber,
          email: row.User?.email,
          address: row.User?.address,
          eps: row.Ep?.eps,
          pensionFund: row.PensionFund?.pensionFund,
          compensationFund: row.CompensationFund?.compensationFund,
          entryDate: employee.entryDate,
          severancePay: row.SeverancePay?.severancePay,
          contractType: row.ContractType?.contractType,
          position: row.Position?.position,
          ingreso: novelties.filter((item) => item.novelty === "Ingreso" && item.identityCardNumber === row.User?.identityCardNumber).length,
          novedad: novelties.filter((item) => item.novelty === "Novedad" && item.identityCardNumber === row.User?.identityCardNumber).length,
          vacacion: novelties.filter((item) => item.novelty === "Vacación" && item.identityCardNumber === row.User?.identityCardNumber).length,
          permiso: novelties.filter((item) => item.novelty === "Permiso" && item.identityCardNumber === row.User?.identityCardNumber).length,
          sancion: novelties.filter((item) => item.novelty === "Sanción" && item.identityCardNumber === row.User?.identityCardNumber).length,
          retiro: novelties.filter((item) => item.novelty === "Retiro" && item.identityCardNumber === row.User?.identityCardNumber).length,
          incapacitado: novelties.filter((item) => item.novelty === "Incapacitado" && item.identityCardNumber === row.User?.identityCardNumber).length,
          prestamo: novelties.filter((item) => item.novelty === "Prestamo" && item.identityCardNumber === row.User?.identityCardNumber).length,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (err) {
      console.error("Error creating Excel file buffer:", err);
      throw new Error("Internal server error");
    }
  }

  async findCities(): Promise<ResponseEntity> {
    try {
      const cities = await models.City.findAll({
        order: [["city", "ASC"]],
      });
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, cities);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findEps(): Promise<ResponseEntity> {
    try {
      const eps = await models.Eps.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, eps);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findPensionFund(): Promise<ResponseEntity> {
    try {
      const pensionFund = await models.PensionFund.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, pensionFund);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findRoles(): Promise<ResponseEntity> {
    try {
      const roles = await Role.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, roles);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findState(): Promise<ResponseEntity> {
    try {
      const state = await models.State.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, state);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findArls(): Promise<ResponseEntity> {
    try {
      const arls = await models.Arl.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, arls);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findContractTypes(): Promise<ResponseEntity> {
    try {
      const contractTypes = await models.ContractType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, contractTypes);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findSeverancePay(): Promise<ResponseEntity> {
    try {
      const sevenracePay = await models.SeverancePay.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, sevenracePay);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findBanks(): Promise<ResponseEntity> {
    try {
      const banks = await models.BankAccount.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, banks);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findPaymentMethods(): Promise<ResponseEntity> {
    try {
      const paymentMethods = await models.PaymentType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, paymentMethods);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findCompensationFunds(): Promise<ResponseEntity> {
    try {
      const compensationFunds = await models.CompensationFund.findAll();
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        compensationFunds
      );
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findIdentificationTypes(): Promise<ResponseEntity> {
    try {
      const identificationTypes = await models.IdentityCard.findAll();
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        identificationTypes
      );
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findPositions(): Promise<ResponseEntity> {
    try {
      const positions = await models.Position.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, positions);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }

  async findRequiredDocuments(): Promise<ResponseEntity> {
    try {
      const requiredDocuments = await models.RequiredDocument.findAll();
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        requiredDocuments
      );
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal error server",
      });
    }
  }


  async findNoveltiesByEmployee(idEmployee: number): Promise<ResponseEntity> {
    try {
      const novelties = await employeeRepository.findEmployeeNoveltiesByEmployeeId(idEmployee);
      if (novelties instanceof CustomError) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: novelties.message });
      }

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, novelties);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
    }
  }

  private updateEmergencyContactRequest(
    employee: UpdateEmployeeRequest,
    dbEmergencyContact: models.EmergencyContact
  ) {
    return {
      firstName:
        employee.emergencyContactfirstName ?? dbEmergencyContact.firstName,
      lastName:
        employee.emergencyContactlastName ?? dbEmergencyContact.lastName,
      phoneNumber:
        employee.emergencyContactphoneNumber ?? dbEmergencyContact.phoneNumber,
      kinship: employee.emergencyContactkinship ?? dbEmergencyContact.kinship,
    };
  }

  private updateUser(employee: UpdateEmployeeRequest, dbUser: User) {
    return {
      firstName: employee.firstName ?? dbUser.firstName,
      lastName: employee.lastName ?? dbUser.lastName,
      email: employee.email ?? dbUser.email,
      address: employee.address ?? dbUser.address,
      phoneNumber: employee.phoneNumber ?? dbUser.phoneNumber,
      idIdentityCard: employee.idIdentityCard ?? dbUser.idIdentityCard,
      userName: employee.userName ?? dbUser.userName,
      birthDate: employee.birthDate ?? dbUser.birthDate,
      identityCardNumber:
        employee.identityCardNumber ?? dbUser.identityCardNumber,
      identityCardExpeditionDate:
        employee.identityCardExpeditionDate ??
        dbUser.identityCardExpeditionDate,
      idIdentityCardExpeditionCity:
        employee.idIdentityCardExpeditionCity ??
        dbUser.idIdentityCardExpeditionCity,
      idRole: employee.idRole ?? dbUser.idRole,
      status: employee.status ?? dbUser.status,
    };
  }

  private updateEmployeeRequest(
    employee: UpdateEmployeeRequest,
    dbEmployee: models.Employee
  ) {
    return {
      idPosition: employee.idPosition ?? dbEmployee.idPosition,
      idContractType: employee.idContractType ?? dbEmployee.idContractType,
      entryDate: employee.entryDate ?? dbEmployee.entryDate,
      baseSalary: employee.baseSalary ?? dbEmployee.baseSalary,
      compensation: employee.compensation ?? dbEmployee.compensation,
      idPaymentType: employee.idPaymentType ?? dbEmployee.idPaymentType,
      bankAccountNumber:
        employee.bankAccountNumber ?? dbEmployee.bankAccountNumber,
      idBankAccount: employee.idBankAccount ?? dbEmployee.idBankAccount,
      idEps: employee.idEps ?? dbEmployee.idEps,
      idArl: employee.idArl ?? dbEmployee.idArl,
      idSeverancePay: employee.idSeverancePay ?? dbEmployee.idSeverancePay,
      idPensionFund: employee.idPensionFund ?? dbEmployee.idPensionFund,
      idCompensationFund:
        employee.idCompensationFund ?? dbEmployee.idCompensationFund,
    };
  }

  private buildFilter(request: IFindEmployeeRequest) {
    let filter = {};

    if (request.identityCardNumber) {
      filter = {
        ...filter,
        identityCardNumber: {
          [Op.substring]: request.identityCardNumber,
        },
      };
    }

    if (request.firstName) {
      filter = {
        ...filter,
        firstName: {
          [Op.substring]: request.firstName,
        },
      };
    }

    if (request.idRole) {
      filter = {
        ...filter,
        idPosition: sequelize.where(sequelize.col("User.idRole"), request.idRole),
      };
    }

    if (request.status) {
      filter = {
        ...filter,
        status: sequelize.where(sequelize.col("User.status"), request.status),
      };
    }
    return filter;
  }
}

interface IFindEmployeeRequest {
  page?: number;
  pageSize?: number;
  firstName?: string;
  identityCardNumber?: string;
  idRole?: number;
  status?: boolean;
}

interface NoveltySummary {
  identityCardNumber: string;
  novelty: string;
  total: number;
}

const employeeRepository = new EmployeeRepository();
const authRepository = new AuthenticationRepository();
export const employeeService = new EmployeeService(
  employeeRepository,
  authRepository
);