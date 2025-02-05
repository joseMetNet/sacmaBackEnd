import { Request, Response } from "express";
import { ZodError } from "zod";
import { createRefreshTokenSchema, loginSchema, registerSchema, revokeRefreshTokenSchema } from "./authentication-schemas";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { UploadedFile } from "express-fileupload";
import { authService } from "./authentication.service";
import { formatZodError } from "../employee/utils";


class AuthenticationController {
  private handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({
      status: StatusValue.Failed,
      data: { error: formatZodError(error) },
    });
  };

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const request = registerSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const filePath = req.files
      ? (req.files.imageProfile as UploadedFile).tempFilePath
      : undefined;
    request.data.imageProfile = filePath;
    const response = await authService.register(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const request = loginSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await authService.login(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  public async createRefreshToken(req: Request, res: Response): Promise<void> {
    const request = createRefreshTokenSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await authService.createRefreshToken(request.data.idUser);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  public async revokeRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const request = revokeRefreshTokenSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest).json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
        return;
      }
      const response = await authService.revokeRefreshToken(
        request.data.idRefreshToken,
        request.data.idUser
      );
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      console.log(err);
      res
        .status(StatusCode.InternalErrorServer)
        .json({ status: StatusValue.Failed, data: { message: err } });
    }
  }
}

export const authController = new AuthenticationController();
