import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { otpServices } from "./otp.service";

const sentOpt = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;
  await otpServices.sentOtp(email, name);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Sent Successfully",
    data: null,
  });
});
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await otpServices.verifyOtp(email, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Verified Successfully",
    data: null,
  });
});

export const OTPController = {
  sentOpt,
  verifyOtp,
};
