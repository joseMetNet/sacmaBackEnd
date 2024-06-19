import { EnvConfig } from "../../config";
import { CustomError } from "../../utils";
import { 
  ChagePasswordRequest, 
  AuthenticationRequest, 
  RegisterRequest,
  UpdateEmployeeRequest, 
} from "../../interfaces";
import { RefreshToken } from "../../models";
import { Transaction } from "sequelize";

export class AuthenticationRepository {
  private readonly headers = new Headers();
  private readonly baseUrl = `${EnvConfig.AUTH_URL}/UserManagement`;

  constructor() {
    this.headers.append("Content-Type", "application/json");
  }

  async createRefreshToken(idUser: number, transaction: Transaction): Promise<CustomError | RefreshToken> {
    try {
      const refreshToken = await RefreshToken.create({
        idUser,
      }, { transaction });
      return refreshToken;
    }catch( err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  async updateRefreshToken(idRefreshToken: number, idUser: number): Promise<CustomError | number> {
    try {
      const refreshToken = await RefreshToken.update({
        idUser,
      }, {
        where: {
          idRefreshToken,
        }
      });
      if (refreshToken[0] === 0) {
        return CustomError.notFound("Refresh token not found");
      }
      return refreshToken[0];
    }catch( err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  async findRefreshToken(idRefreshToken: number, idUser: number): Promise<CustomError | RefreshToken> {
    try {
      const refreshToken = await RefreshToken.findOne({
        where: {
          idRefreshToken,
          idUser,
        }
      });
      if (!refreshToken) {
        return CustomError.notFound("Refresh token not found");
      }
      return refreshToken;
    }catch( err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  async deleteRefreshToken(idRefreshToken: number, idUser: number): Promise<CustomError | number> {
    try {
      const refreshToken = await RefreshToken.destroy({
        where: {
          idRefreshToken,
          idUser,
        }
      });
      if (refreshToken === 0) {
        return CustomError.notFound("Refresh token not found");
      }
      return refreshToken;
    }catch( err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  /**
    * @description Method to find a user by email
    * @param email
    * @returns Promise<CustomError | number> - Returns a CustomError if the user is not found or the user id
    * @example
    * const user = await findUserByEmail("mail@mail.com");
    * if (user instanceof CustomError) {
    *   console.log(user.message);
    *   return;
    * }
    * user.id;
  */
  async findUserByEmail(email: string): Promise<CustomError | number> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const requestOptions: RequestInit = {
      method: "GET",
      headers: headers,
      redirect: "follow"
    };
    const url = `${this.baseUrl}?userGroup=${EnvConfig.USER_GROUP}&userName=${email}`;
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (response.ok) {
      return data.data[0].id as number;
    }
    return CustomError.notFound("User not found");
  }



  /**
    * @description Method to change the password of a user
    * @param request
    * @returns Promise<CustomError | string> - Returns a CustomError if the password could not be changed or a success message
    * @example
    * const response = await changePassword({ email: "", password: "" });
    * if (response instanceof CustomError) {
    *   console.log(response.message);
    *   return;
    * }
  */
  async changePassword(request: ChagePasswordRequest): Promise<CustomError | string> {
    const payload = JSON.stringify({
      "userGroup": EnvConfig.USER_GROUP,
      "password": request.password,
      "userName": request.email
    });
    console.log(payload);
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: this.headers,
      body: payload,
      redirect: "follow"
    };
    const response = await fetch(`${this.baseUrl}/recoverPassword`, requestOptions);
    const data = await response.json();
    if (response.status !== 200) {
      return CustomError.internalServer("Password could not be changed");
    }
    return data.message;
  }

  /**
    * @description Method to authenticate a user
    * @param request
    * @returns Promise<CustomError | number> - Returns a CustomError if the authentication failed or the user id
    * @example
    * const response = await authenticationRequest({ email: "", password: "" });
    * if (response instanceof CustomError) {
    *   console.log(response.message);
    *   return;
    * }
    * response;
  */

  async authenticationRequest(request: AuthenticationRequest): Promise<CustomError | number> {
    const payload = JSON.stringify({
      "userGroup": EnvConfig.USER_GROUP,
      "password": request.password,
      "userName": request.email
    });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: this.headers,
      body: payload,
      redirect: "follow"
    };
    const response = await fetch(`${this.baseUrl}/authenticationUser`, requestOptions);
    const data = await response.json();
    if (response.status !== 200) {
      return CustomError.internalServer("Login failed");
    }
    return data.data.id;
  }

  /**
    * @description Method to register a user
    * @param request
    * @returns Promise<CustomError | number> - Returns a CustomError if the registration failed or the user id
    * @example
    * const response = await registerRequest({ email: "", password: "" });
    * if (response instanceof CustomError) {
    *   console.log(response.message);
    *   return;
    * }
    * response;
  */
  async registerRequest(request: UpdateEmployeeRequest | RegisterRequest): Promise<CustomError | number> {
    const payload = JSON.stringify({
      "userGroup": EnvConfig.USER_GROUP,
      "email": request.email,
      "userName": request.userName,
      "password": request.password
    });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: this.headers,
      body: payload,
      redirect: "follow"
    };
    const response = await fetch(`${this.baseUrl}`, requestOptions);
    const data = await response.json();
    console.log(data);
    if (response.status !== 200) {
      return CustomError.internalServer("Registration failed");
    }
    return data.data[0].id;
  }
}
