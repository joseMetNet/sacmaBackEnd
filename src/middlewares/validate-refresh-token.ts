import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RefreshToken } from "../features/employee";
import { EnvConfig } from "../config";

export async function verifyRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {

  const token: string = req.body.refreshToken;
  if (!token) {
    res.status(401).json({ message: "Refresh token is required." });
    return;
  }

  jwt.verify(token, EnvConfig.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] }, async (err, payload) => {
    if (err) {
      res.status(401).json({ message: `Error validating token: ${err.message}` });
      return;
    }

    if (!payload || typeof payload !== "object" || !("idRefreshToken" in payload)) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    if (tokenIsExpired(token)) {
      res.status(401).json({ message: "Token is expired." });
      return;
    }

    const { idRefreshToken } = payload as JwtPayload & { idRefreshToken: number };

    try {
      const refreshToken = await RefreshToken.findOne({ where: { idRefreshToken, deletedAt: null } });
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token not found or revoked." });
        return;
      }

      req.body.idUser = refreshToken.idUser;
      req.body.idRefreshToken = idRefreshToken;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
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