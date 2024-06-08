import { StatusValue } from "../interfaces";
import { ResponseEntity } from "./interface";

export class BuildResponse {
  constructor(
    public readonly status: StatusValue,
    public readonly data: object
  ) {
    this.status = status;
    this.data = data;
  }
  static buildSuccessResponse(code: number, data: object): ResponseEntity {
    return {
      code: code,
      status: StatusValue.Success,
      data: data,
    };
  }
  static buildErrorResponse(code: number, data: object): ResponseEntity {
    return {
      code: code,
      status: StatusValue.Failed,
      data: data,
    };
  }
}
