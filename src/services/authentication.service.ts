import { AuthenticationRequest, RegisterRequest, StatusCode } from "../interfaces";
import { AuthenticationRepository } from "../repositories";
import { CustomError } from "../utils";
import { BuildResponse } from "./build-response";
import { AuthTokenPayload, ResponseEntity } from "./utils";
import * as helper from "./helper";
import { EmergencyContact, Employee, User } from "../models";
import { dbConnection } from "../config";

export class AuthenticationService {
  constructor(private readonly authRepository: AuthenticationRepository) {
    this.authRepository = authRepository;
  }

  async register(request: RegisterRequest): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const userExists = await this.authRepository.findUserByEmail(request.email);
      if (typeof userExists === "number") {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(StatusCode.Conflict, {message: "User already exists"});
      }
      const newUserId = await this.authRepository.registerRequest(request);
      if (newUserId instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(newUserId.statusCode, {message: newUserId.message});
      }

      const user = await User.create({
        idUser: newUserId,
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
        userName: request.userName
      }, { transaction });

      const emergencyContact = await EmergencyContact.create({
        firstName: request.emergencyContactfirstName,
        lastName: request.emergencyContactlastName,
        phoneNumber: request.emergencyContactphoneNumber,
        kinship: request.emergencyContactkinship
      }, { transaction });

      const employee = await Employee.create({
        idEmergencyContact: emergencyContact.get("idEmergencyContact"),
        idUser: user.get("idUser"),
        idPosition: request.idPosition,
        idContractType: request.idContractType,
        entryDate: request.entryDate,
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
        compensationFund: request.compensationFund,
        idRequiredDocument: request.idRequiredDocument
      }, { transaction });

      const payload: AuthTokenPayload = { idUser: user.get("idUser"), idRole: user.get("idRole") };
      const token = helper.createAuthToken(payload);
      
      transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {token, userName: user.get("firstName") + " " + user.get("lastName")});
    }catch (err: any) {
      transaction.rollback();
      console.log(JSON.stringify(err));
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {message: err});
    }
  }

  async login(request: AuthenticationRequest): Promise<ResponseEntity> {
    const userExists = await this.authRepository.findUserByEmail(request.email);
    if (userExists instanceof CustomError) {
      return BuildResponse.buildErrorResponse(userExists.statusCode, {message: userExists.message});
    }
    const user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      return BuildResponse.buildErrorResponse(StatusCode.NotFound, {message: "User not found"});
    }
    const payload: AuthTokenPayload = { idUser: user.get("idUser"), idRole: user.get("idRole") };
    const token = helper.createAuthToken(payload);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, {token, userName: user.get("firstName") + " " + user.get("lastName")});
  }
}

const authRepository = new AuthenticationRepository();
export const authService = new AuthenticationService(authRepository);