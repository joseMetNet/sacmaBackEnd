import { StatusCode } from "./general.interfase";

export class CustomError extends Error {
  constructor(
    public readonly statusCode: StatusCode,
    public readonly message: string
  ) {
    super(message);
    this.name = "CustomError";
  }
  static badRequest(message: string): CustomError {
    return new CustomError(StatusCode.BadRequest, message);
  }
  static unauthorized(message: string): CustomError {
    return new CustomError(StatusCode.Unauthorized, message);
  }
  static forbidden(message: string): CustomError {
    return new CustomError(StatusCode.Forbidden, message);
  }
  static notFound(message: string): CustomError {
    return new CustomError(StatusCode.NotFound, message);
  }
  static conflict(message: string = "request could not be completed due to a conflict"): CustomError {
    return new CustomError(StatusCode.Conflict, message);
  }
  static internalServer(message: string = "Internal error server"): CustomError {
    return new CustomError(StatusCode.InternalErrorServer, message);
  }
}
