import {
  AuthenticationRequest,
  RegisterRequest,
  StatusCode,
} from "../interfaces";
import { AuthenticationRepository } from "../repositories";
import { CustomError } from "../utils";
import { BuildResponse } from "./build-response";
import { AuthTokenPayload, ResponseEntity } from "./interface";
import * as helper from "./helper";
import { EmergencyContact, Employee, User } from "../models";
import { dbConnection } from "../config";
import { Transaction } from "sequelize";

export class AuthenticationService {
  constructor(private readonly authRepository: AuthenticationRepository) {
    this.authRepository = authRepository;
  }

  async register(request: RegisterRequest): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const userExists = await this.authRepository.findUserByEmail(request.userName);
      if (typeof userExists === "number") {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.Conflict, {message: "User already exists"});
      }

      if(request.password) {
        const newUserId = await this.authRepository.registerRequest(request);
        if (newUserId instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(newUserId.statusCode, {message: newUserId.message});
        }
      }

      await this.uploadImageProfile(request);

      const user = await this.createUser(request, transaction);
      const emergencyContact = await this.createEmergencyContact(request, transaction);
      await this.createEmployee(request, emergencyContact, user, transaction);

      const idRefreshToken = await this.insertRefreshToken(user.get("idUser"), transaction);
      if (idRefreshToken instanceof CustomError) {
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {message: idRefreshToken.message});
      }

      const payload: AuthTokenPayload = {
        idUser: user.get("idUser"),
        idRole: user.get("idRole"),
        idRefreshToken
      };

      const refreshToken = helper.signAuthRefreshToken({ 
        idUser: user.get("idUser"), 
        idRefreshToken 
      });
      const token = helper.signAuthToken(payload);
      transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken, 
        userName: user.get("firstName") + " " + user.get("lastName")
      });
    } catch (err: any) {
      transaction.rollback();
      console.log(JSON.stringify(err));
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {message: err});
    }
  }

  async login(request: AuthenticationRequest): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const userExists = await this.authRepository.findUserByEmail(request.email);
      if (userExists instanceof CustomError) {
        return BuildResponse.buildErrorResponse(userExists.statusCode, {message: userExists.message});
      }
      const authStatus = await this.authRepository.authenticationRequest(request);
      if (authStatus instanceof CustomError) {
        return BuildResponse.buildErrorResponse(authStatus.statusCode, { error: authStatus.message });
      }
      const user = await User.findOne({ where: { userName: request.email } });
      if (!user) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {message: "User not found"});
      }

      const idRefreshToken = await this.insertRefreshToken(user.get("idUser"), transaction);
      if (idRefreshToken instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {message: idRefreshToken.message});
      }

      const payload: AuthTokenPayload = {
        idUser: user.get("idUser"),
        idRole: user.get("idRole"),
        idRefreshToken
      };

      const refreshToken = helper.signAuthRefreshToken({ 
        idUser: user.get("idUser"), 
        idRefreshToken 
      });
      const token = helper.signAuthToken(payload);

      await transaction.commit();
      
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken,
        userName: user.get("firstName") + " " + user.get("lastName"),
      });

    }catch(err: any) {
      await transaction.rollback();
      console.log(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {message: err});
    }
  }

  async createRefreshToken(idUser: number) {
    const transaction = await dbConnection.transaction();
    try {
      const idRefreshToken = await this.insertRefreshToken(idUser, transaction);
      if (idRefreshToken instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(idRefreshToken.statusCode, {message: idRefreshToken.message});
      }

      const user = await User.findOne({ where: { idUser } }) as User;

      const payload: AuthTokenPayload = {
        idUser,
        idRole: user.get("idRole"),
        idRefreshToken
      };

      const refreshToken = helper.signAuthRefreshToken({ 
        idUser: user.get("idUser"), 
        idRefreshToken 
      });
      const token = helper.signAuthToken(payload);
      
      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        token,
        refreshToken,
      });

    }catch(err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {message: err});
    }
  }

  private async insertRefreshToken(idUser: number, transaction: Transaction): Promise<number | CustomError> {
    try {
      const refreshToken = await this.authRepository.createRefreshToken(idUser, transaction);
      if(refreshToken instanceof CustomError) {
        await transaction.rollback();
        return refreshToken;
      }
      return refreshToken.idRefreshToken;
    }
    catch(err: any) {
      await transaction.rollback();
      return CustomError.internalServer(err.message);
    }
  }

  async revokeRefreshToken(idRefreshToken: number, idUser: number): Promise<ResponseEntity> {
    try {
      const response = await authRepository.deleteRefreshToken(idRefreshToken, idUser);
      if (response instanceof CustomError) {
        return BuildResponse.buildErrorResponse(response.statusCode, {message: response.message});
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {message: "Refresh token revoked"});
    } catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {message: err});
    }
  }

  private async uploadImageProfile(request: RegisterRequest): Promise<RegisterRequest | CustomError> {
    if(request.imageProfile != null) {
      const identifier = crypto.randomUUID();
      const uploadImage = await helper.uploadImageProfile(request.imageProfile, identifier);
      if (uploadImage instanceof CustomError) {
        return uploadImage;
      }
      request.imageProfile = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      return request;
    }
    return request;
  }

  private async createUser(request: RegisterRequest, transaction: Transaction) {
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
        idRole: request.idRole,
        userName: request.userName,
        imageProfileUrl: request.imageProfile,
      },
      { transaction }
    );
  }

  private createEmergencyContact(request: RegisterRequest, transaction: Transaction) {
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

  private createEmployee(request: RegisterRequest, emergencyContact: EmergencyContact, user: User, transaction: Transaction) {
    return Employee.create(
      {
        idEmergencyContact: emergencyContact.get("idEmergencyContact"),
        idUser: user.get("idUser"),
        idPosition: request.idPosition,
        idContractType: request.idContractType,
        entryDate: request.entryDate? request.entryDate: null,
        baseSalary: request.baseSalary,
        compensation: request.compensation,
        idPaymentType: request.idPaymentType,
        bankAccountNumber: request.bankAccountNumber,
        idBankAccount: request.idBankAccount,
        idEps: request.idEps,
        idArl: request.idArl,
        severancePay: request.severancePay,
        idPensionFund: request.idPensionFund,
        idCompensationFund: request.idCompensationFund,
      },
      { transaction }
    );
  }
}


const authRepository = new AuthenticationRepository();
export const authService = new AuthenticationService(authRepository);
