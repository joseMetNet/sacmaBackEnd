import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ZodError } from "zod";
import { StatusCode, StatusValue } from "../../utils/general.interfase";

export const validateEndpoint = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const data = error.mapped();
    return res
      .status(StatusCode.BadRequest)
      .json({ status: StatusValue.Failed, data: { error: data } });
  }
  next();
};

export function formatZodError(error: ZodError): string[] {
  return error.errors.map(e => `${e.path.join(".")} - ${e.message}`);
}