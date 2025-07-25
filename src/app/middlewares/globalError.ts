/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../ErrorHelper/AppError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong ${error.message}`;
  if (error.code === 1100) {
    statusCode = 400;

    const duplicate = error.message.match(/"([^"]*)"/);
    message = `${duplicate[1]} already exits`;
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoID.Please provide a valid Id";
  }
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
