import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RefreshToken, User } from "../models";
import { EnvConfig } from "../config";

function removeBlankAttributes(obj: { [key: string]: any }) {
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    if (
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== "" &&
      obj[key] !== "null" &&
      obj[key] !== "undefined"
    ) {
      result[key] = obj[key];
    }
  }
  return result;
}

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ message: "No authorization header found." });
    return;
  }

  const token: string = authHeader.split(" ")[1] || "";
  jwt.verify(token, EnvConfig.AUTH_TOKEN_SECRET, { algorithms: ["HS256"] }, async (err, payload) => {
    if (err) {
      res.status(401).json({ message: `Error validating token: ${err.message}` });
      return;
    }

    if (
      !payload ||
      typeof payload !== "object" || 
      !("idUser" in payload) || 
      !("idRefreshToken" in payload)
    ) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    if (tokenIsExpired(token)) {
      res.status(401).json({ message: "Token is expired." });
      return;
    }

    const { idUser, idRefreshToken } = payload as JwtPayload & { idUser: number; idRefreshToken: number };

    try {
      const user = await User.findOne({ where: { idUser } });
      if (!user) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const refreshToken = await RefreshToken.findOne({ where: { idRefreshToken, idUser } });
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token not found." });
        return;
      }

      const body = removeBlankAttributes(req.body);
      req.body = body;

      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });
}

function tokenIsExpired(token: string): boolean {
  const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload | null;
  if (!decodedToken || !decodedToken.payload.exp) {
    return true;
  }
  const dateNow: number = Date.now() / 1000;
  return decodedToken.payload.exp < dateNow;
}
