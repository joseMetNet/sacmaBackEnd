import { Request, Response } from "express";
import { ZodError } from "zod";
import { createRefreshTokenSchema, loginSchema, registerSchema, revokeRefreshTokenSchema } from "./authentication-schemas";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../employee/utils";
import { AuthenticationService } from "./authentication.service";


export class AuthenticationController {
  private readonly authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({
      status: StatusValue.Failed,
      data: { error: formatZodError(error) },
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
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
    const response = await this.authService.register(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const request = loginSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.authService.login(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  };

  createRefreshToken = async (req: Request, res: Response): Promise<void> => {
    const request = createRefreshTokenSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) },
      });
      return;
    }
    const response = await this.authService.createRefreshToken(request.data.idUser);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  };

  revokeRefreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = revokeRefreshTokenSchema.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest).json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
        return;
      }
      const response = await this.authService.revokeRefreshToken(
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
  };
}