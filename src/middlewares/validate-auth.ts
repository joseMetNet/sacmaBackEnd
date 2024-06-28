import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { AuthenticationRepository } from "../repositories";

export async function verifyAuthRequest(req: Request, res: Response, next: NextFunction) {
  const { userName } = req.body;

  if (!userName) {
    res.status(400).json({ message: "User name is required." });
    return;
  }

  const user = await User.findOne({ where: { userName } });
  if(user) {
    res.status(400).json({ message: "User already exists." });
    return;
  }

  const authRepository = new AuthenticationRepository();
  const userExists = await authRepository.findUserByEmail(userName);
  if (userExists) {
    res.status(400).json({ message: "User not found." });
    return;
  }

  next();
}