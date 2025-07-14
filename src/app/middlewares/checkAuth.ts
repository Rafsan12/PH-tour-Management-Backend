import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../ErrorHelper/AppError";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token Received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
      // console.log(verifyToken);
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not Permitted To view this Route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
