/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      console.log(error), next(error);
    });
  };

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // throw new AppError(httpStatus.BAD_REQUEST);
  const user = await userServices.createUser(req.body);
  res.status(httpStatus.CREATED).json({
    message: "User created successfully",
    user,
  });
};

export const UserController = {
  createUser,
};
