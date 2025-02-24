import { Transaction } from "sequelize";
import { dbConnection } from "../../config";
import { AuthTokenPayload, ResponseEntity } from "../employee/interface";
import { CustomError } from "../../utils";
import { AuthenticationRepository } from "./authentication.repository";
import { User } from "./user.model";
import { EmergencyContact, Employee } from "../employee";
import { Role } from "./role.model";
import { PermissionRoleModel } from "./permission-role.model";
import { PermissionModel } from "./permission.model";
import * as helper from "../../utils/helper";
import { AuthenticationRequest, RegisterRequest } from "./authentication.interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { NoveltyRepository } from "../novelty";

export class AuthenticationService {
  private readonly authRepository: AuthenticationRepository;
  private readonly noveltyRepository: NoveltyRepository;

  constructor(
    authRepository: AuthenticationRepository,
    noveltyRepository: NoveltyRepository
  ) {
    this.authRepository = authRepository;
    this.noveltyRepository = noveltyRepository;
  }

  async register(request: RegisterRequest): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      if (request.password) {
        const newUserId = await this.authRepository.registerRequest(request);
        if (newUserId instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(newUserId.statusCode, {
            message: newUserId.message,
          });
        }
      }

      await this.uploadImageProfile(request);

      const user = await this.createUser(request, transaction);
      const emergencyContact = await this.createEmergencyContact(request, transaction);
      const employee = await this.createEmployee(request, emergencyContact, user, transaction);

      const idRefreshToken = await this.insertRefreshToken(user.get("idUser"), transaction);
      if (idRefreshToken instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {
          message: idRefreshToken.message,
        });
      }

      const role = await Role.findByPk(user.idRole);

      const payload: AuthTokenPayload = {
        idUser: user.get("idUser"),
        idRole: user.get("idRole"),
        idRefreshToken,
      };

      const refreshToken = helper.signAuthRefreshToken({ idUser: user.get("idUser"), idRefreshToken });
      const token = helper.signAuthToken(payload);

      const novelty = await this.noveltyRepository.createNovelty({
        idNovelty: 1,
        idEmployee: employee.idEmployee,
        createdAt: new Date().toISOString(),
        endAt: new Date().toISOString(),
      }, transaction);

      await transaction.commit();
      

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken,
        userName: `${user.get("firstName")} ${user.get("lastName")}`,
        user: {
          idUser: user.idUser,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: {
            idRole: role!.idRole,
            roleName: role!.role
          }
        }
      });
    } catch (err: any) {
      console.log(err);
      await transaction.rollback();

      if (err instanceof CustomError) {
        return BuildResponse.buildErrorResponse(err.statusCode, {
          message: err.message,
        });
      }
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  async login(request: AuthenticationRequest): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const userExists = await this.authRepository.findUserByEmail(request.email);

      if (userExists instanceof CustomError) {
        return BuildResponse.buildErrorResponse(userExists.statusCode, {
          message: userExists.message,
        });
      }

      const authStatus = await this.authRepository.authenticationRequest(request);

      if (authStatus instanceof CustomError) {
        return BuildResponse.buildErrorResponse(authStatus.statusCode, {
          error: authStatus.message,
        });
      }

      const user = await User.findOne({ where: { userName: request.email } });

      if (!user) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "User not found",
        });
      }

      if (!user.get("status")) { // simplified check
        return BuildResponse.buildErrorResponse(StatusCode.Unauthorized, {
          message: "User is inactive",
        });
      }

      const idRefreshToken = await this.insertRefreshToken(user.get("idUser"), transaction);

      if (idRefreshToken instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {
          message: idRefreshToken.message,
        });
      }

      const role = await Role.findByPk(user.idRole);
      const permissions = await PermissionRoleModel.findAll({
        where: {
          idRole: user.idRole,
        },
        include: [
          {
            model: PermissionModel,
            attributes: ["permission"],
            required: true
          }
        ]
      });

      const payload: AuthTokenPayload = {
        idUser: user.get("idUser"),
        idRole: user.get("idRole"),
        idRefreshToken,
      };

      const refreshToken = helper.signAuthRefreshToken({
        idUser: user.get("idUser"),
        idRefreshToken,
      });

      const token = helper.signAuthToken(payload);

      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken,
        userName: user.get("firstName") + " " + user.get("lastName"),
        user: {
          idUser: user.idUser,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: {
            idRole: role!.idRole,
            roleName: role!.role
          },
          permissions: permissions.map((item) => (item.get("PermissionModel") as PermissionModel).permission),
        }
      });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Login error:", err); // improved logging

      if (err instanceof CustomError) {
        return BuildResponse.buildErrorResponse(err.statusCode, {
          message: err.message,
        });
      }

      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }


  async createRefreshToken(idUser: number) {
    const transaction = await dbConnection.transaction();
    try {
      const idRefreshToken = await this.insertRefreshToken(idUser, transaction);
      if (idRefreshToken instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {
          message: idRefreshToken.message,
        });
      }

      const user = (await User.findOne({ where: { idUser } })) as User;

      const payload: AuthTokenPayload = {
        idUser,
        idRole: user.get("idRole"),
        idRefreshToken,
      };

      const refreshToken = helper.signAuthRefreshToken({
        idUser: user.get("idUser"),
        idRefreshToken,
      });
      const token = helper.signAuthToken(payload);

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken,
      });
    } catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err,
      });
    }
  }

  private async insertRefreshToken(
    idUser: number,
    transaction: Transaction
  ): Promise<number | CustomError> {
    try {
      const refreshToken = await this.authRepository.createRefreshToken(
        idUser,
        transaction
      );
      if (refreshToken instanceof CustomError) {
        await transaction.rollback();
        return refreshToken;
      }
      return refreshToken.idRefreshToken;
    } catch (err: any) {
      await transaction.rollback();
      return CustomError.internalServer(err.message);
    }
  }

  async revokeRefreshToken(
    idRefreshToken: number,
    idUser: number
  ): Promise<ResponseEntity> {
    try {
      const response = await this.authRepository.deleteRefreshToken(
        idRefreshToken,
        idUser
      );
      if (response instanceof CustomError) {
        return BuildResponse.buildErrorResponse(response.statusCode, {
          message: response.message,
        });
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        message: "Refresh token revoked",
      });
    } catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: err,
      });
    }
  }

  private async uploadImageProfile(
    request: RegisterRequest
  ): Promise<RegisterRequest | CustomError> {
    if (request.imageProfile != null) {
      const identifier = crypto.randomUUID();
      const uploadImage = await helper.uploadImageProfile(
        request.imageProfile,
        identifier
      );
      if (uploadImage instanceof CustomError) {
        return uploadImage;
      }
      request.imageProfile = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      return request;
    }
    return request;
  }

  private async createUser(request: RegisterRequest, transaction: Transaction) {
    let birthDate = null;
    if (request.birthDate != "" && request.birthDate != null) {
      birthDate = request.birthDate;
    }
    return User.create(
      {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        address: request.address,
        phoneNumber: request.phoneNumber,
        identityCardNumber: request.identityCardNumber,
        identityCardExpeditionDate: request.identityCardExpeditionDate,
        idIdentityCardExpeditionCity: request.idIdentityCardExpeditionCity,
        idIdentityCard: request.idIdentityCard,
        birthDate: birthDate,
        idRole: request.idRole,
        userName: request.userName,
        imageProfileUrl: request.imageProfile,
      },
      { transaction }
    );
  }

  private createEmergencyContact(
    request: RegisterRequest,
    transaction: Transaction
  ) {
    return EmergencyContact.create(
      {
        firstName: request.emergencyContactfirstName,
        lastName: request.emergencyContactlastName,
        phoneNumber: request.emergencyContactphoneNumber,
        kinship: request.emergencyContactkinship,
      },
      { transaction }
    );
  }

  private createEmployee(
    request: RegisterRequest,
    emergencyContact: EmergencyContact,
    user: User,
    transaction: Transaction
  ) {
    return Employee.create(
      {
        idEmergencyContact: emergencyContact.get("idEmergencyContact"),
        idUser: user.get("idUser"),
        idPosition: request.idPosition,
        idContractType: request.idContractType,
        entryDate: request.entryDate ? request.entryDate : null,
        baseSalary: request.baseSalary,
        compensation: request.compensation,
        idPaymentType: request.idPaymentType,
        bankAccountNumber: request.bankAccountNumber,
        idBankAccount: request.idBankAccount,
        idEps: request.idEps,
        idArl: request.idArl,
        idSeverancePay: request.idSeverancePay,
        idPensionFund: request.idPensionFund,
        idCompensationFund: request.idCompensationFund,
      },
      { transaction }
    );
  }
}