import { ZodError } from "zod";
import { StatusCode, StatusValue } from "../../interfaces";
import { Request, Response } from "express";
import { formatZodError } from "../utils";
import { loginSchema, registerSchema } from "./authentication-schemas";
import { authService } from "../../services";

class AuthenticationController {

  private handleError = (res: Response, error: ZodError): void => {
    res.status(StatusCode.BadRequest).json({ 
      status: StatusValue.Failed, 
      data: { error: formatZodError(error) } 
    });
  };

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const request = registerSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: formatZodError(request.error) } });
      return;
    }
    const response = await authService.register(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const request = loginSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: formatZodError(request.error) } });
      return;
    }
    const response = await authService.login(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }
}

export const authController = new AuthenticationController();