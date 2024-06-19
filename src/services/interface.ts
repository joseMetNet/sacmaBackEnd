import { StatusValue } from "../interfaces/general.interfase";

export interface ResponseEntity {
  code: number;
  status: StatusValue;
  data?: object;
}

export interface AuthTokenPayload {
  idUser: number;
  idRole?: number;
  idRefreshToken: number;
}

export interface AuthRefreshTokenPayload {
  idUser: number;
  idRefreshToken: number;
}