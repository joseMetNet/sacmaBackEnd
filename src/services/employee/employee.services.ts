import { Op } from "sequelize";
import { dbConnection } from "../../config";
import {
  ChagePasswordRequest,
  StatusCode,
  UpdateEmployeeRequest,
} from "../../interfaces";
import {
  Arl,
  Eps,
  City,
  ContractType,
  EmergencyContact,
  Employee,
  Role,
  User,
  State,
  BankAccount,
  PaymentType,
  CompensationFund,
  IdentityCard,
  Position,
  RequiredDocument,
} from "../../models";
import {
  AuthenticationRepository,
  EmployeeRepository,
} from "../../repositories";
import { CustomError } from "../../utils";
import { BuildResponse } from "../build-response";
import { ResponseEntity } from "../interface";

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
        message: err.message,
      });
    }
  }

  async findEmployees(request: IFindEmployeeRequest): Promise<ResponseEntity> {
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
      const employees = await Employee.findAndCountAll({
        include: [
          {
            model: User,
            required: true,
            where: filter,
          },
        ],
        limit,
        offset,
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
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async updateEmployee(
    employee: UpdateEmployeeRequest
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

      if (employee.password) {
        const changePasswordRequest: ChagePasswordRequest = {
          email: user.email,
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

      const dbEmployee = await Employee.findOne({
        where: { idUser: employee.idUser },
        transaction,
      });
      if (dbEmployee) {
        const updatedEmployee = this.updateEmployeeRequest(
          employee,
          dbEmployee
        );
        await dbEmployee.update(updatedEmployee, { transaction });
        const idEmergencyContact = dbEmployee.get(
          "idEmergencyContact"
        ) as number;
        const emergencyContact = await EmergencyContact.findByPk(
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
        message: err.message,
      });
    }
  }

  async findCities(): Promise<ResponseEntity> {
    try {
      const cities = await City.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, cities);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findEps(): Promise<ResponseEntity> {
    try {
      const eps = await Eps.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, eps);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findRoles(): Promise<ResponseEntity> {
    try {
      const roles = await Role.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, roles);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findState(): Promise<ResponseEntity> {
    try {
      const state = await State.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, state);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findArls(): Promise<ResponseEntity> {
    try {
      const arls = await Arl.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, arls);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findContractTypes(): Promise<ResponseEntity> {
    try {
      const contractTypes = await ContractType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, contractTypes);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findBanks(): Promise<ResponseEntity> {
    try {
      const banks = await BankAccount.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, banks);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findPaymentMethods(): Promise<ResponseEntity> {
    try {
      const paymentMethods = await PaymentType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, paymentMethods);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findCompensationFunds(): Promise<ResponseEntity> {
    try {
      const compensationFunds = await CompensationFund.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, compensationFunds);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findIdentificationTypes(): Promise<ResponseEntity> {
    try {
      const identificationTypes = await IdentityCard.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, identificationTypes);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findPositions(): Promise<ResponseEntity> {
    try {
      const positions = await Position.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, positions);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  async findRequiredDocuments(): Promise<ResponseEntity> {
    try {
      const requiredDocuments = await RequiredDocument.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, requiredDocuments);
    } catch (err: any) {
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err.message,
      });
    }
  }

  private updateEmergencyContactRequest(
    employee: UpdateEmployeeRequest,
    dbEmergencyContact: EmergencyContact
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
      identityCardNumber:
        employee.identityCardNumber ?? dbUser.identityCardNumber,
      identityCardExpeditionDate:
        employee.identityCardExpeditionDate ??
        dbUser.identityCardExpeditionDate,
      idIdentityCardExpeditionCity:
        employee.idIdentityCardExpeditionCity ??
        dbUser.idIdentityCardExpeditionCity,
      idRole: employee.idRole ?? dbUser.idRole,
    };
  }

  private updateEmployeeRequest(
    employee: UpdateEmployeeRequest,
    dbEmployee: Employee
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
      severancePay: employee.severancePay ?? dbEmployee.severancePay,
      idPensionFund: employee.idPensionFund ?? dbEmployee.idPensionFund,
      idCompensationFund:
        employee.idCompensationFund ?? dbEmployee.idCompensationFund,
      idRequiredDocument:
        employee.idRequiredDocument ?? dbEmployee.idRequiredDocument,
    };
  }

  private buildFilter(request: IFindEmployeeRequest) {
    let filter = {};
    if (request.firstName && request.identityCardNumber) {
      filter = {
        [Op.and]: [
          { firstName: { [Op.substring]: request.firstName } },
          { identityCardNumber: request.identityCardNumber },
        ],
      };
    } else if (request.identityCardNumber) {
      filter = { identityCardNumber: request.identityCardNumber };
    } else if (request.firstName) {
      filter = { firstName: { [Op.substring]: request.firstName } };
    }
    return filter;
  }
}
interface IFindEmployeeRequest {
  page?: number;
  pageSize?: number;
  firstName?: string;
  identityCardNumber?: string;
}

const employeeRepository = new EmployeeRepository();
const authRepository = new AuthenticationRepository();
export const employeeService = new EmployeeService(
  employeeRepository,
  authRepository
);
