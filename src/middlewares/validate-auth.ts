import { NextFunction, Request, Response } from "express";
import { AuthenticationRepository, User } from "../features/authentication";
import { StatusValue } from "../utils/general.interfase";

export async function verifyAuthRequest(req: Request, res: Response, next: NextFunction) {
  const { userName, email } = req.body;

  if (!userName) {
    res.status(400).json({ message: "User name is required." });
    return;
  }

  const authRepository = new AuthenticationRepository();
  const userExists = await authRepository.findUserByEmail(userName);
  if (typeof userExists === "number") {
    res.status(400).json({ status: StatusValue.Failed, data: { message: "userName already exists." } });
    return;
  }

  const user = await User.findOne({ where: { userName } });
  if (user) {
    res.status(400).json({ status: StatusValue.Failed, data: { message: "User already exists." } });
    return;
  }

  const userDb = await User.findOne({ where: { email } });
  if (userDb) {
    res.status(400).json({ status: StatusValue.Failed, data: { message: "Email already exists." } });
    return;
  }

  next();
}