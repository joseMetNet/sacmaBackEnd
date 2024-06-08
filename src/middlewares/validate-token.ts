import { Request, Response, NextFunction } from "express";
import { EnvConfig } from "../config";
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.header("Authorization");

  if (authHeader === undefined ) {
    res.status(401).json({ message: "No authorization header found." });
    return;
  }

  const token: string = authHeader.split(" ")[1] || "";
  jwt.verify(token, EnvConfig.AUTH_TOKEN_SECRET, { algorithms: ["HS256"]}, (err, user) => {
    if (err) {
      return res.status(401).json({ message: `Error on validation token process => ${err}`});
    }
    if (tokenIsExpired(token)) {
      console.error(`Token is expired ${err}`);
      return res.status(401).json({ message: "Token is expired." });
    }
    req.body.user = user;
    next();
  });
}

function tokenIsExpired(token: string) {
  const decodedToken = jwt.decode(token, { complete: true }) as JwtPayload;
  if(!decodedToken){
    return true;
  }
  const dateNow: Date = new Date();
  return decodedToken.payload.exp < dateNow.getTime() / 1000;
}