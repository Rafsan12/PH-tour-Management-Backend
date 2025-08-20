/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const booing = await BookingService.createBooking(
      req.body,
      decodedToken.userId
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking Create Successfully",
      data: booing,
    });
  }
);

export const BookingController = { createBooking };
