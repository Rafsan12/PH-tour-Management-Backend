import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../ErrorHelper/AppError";
import { IsActive } from "../Modules/User/user.interface";
import { User } from "../Modules/User/user.model";
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

      const isUserExits = await User.findOne({
        email: verifiedToken.email,
      });
      if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exist");
      }
      if (
        isUserExits.isActive === IsActive.BLOCKED ||
        isUserExits.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExits.isActive}`
        );
      }
      if (isUserExits.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not Permitted To view this Route");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
