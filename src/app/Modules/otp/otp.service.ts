import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import AppError from "../../ErrorHelper/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../User/user.model";

const OTP_EXPIRATION = 2 * 60;

const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sentOtp = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(403, "user Not Found");
  }

  if (user.isVerified) {
    throw new AppError(403, "You are  already verified");
  }
  const otp = generateOTP();

  const redisKey = `opt:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  sendEmail({
    to: email,
    subject: "Your OTP code",
    templateName: "otp",
    templateData: {
      name,
      email,
      otp,
    },
  });
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(403, "user Not Found");
  }

  if (user.isVerified) {
    throw new AppError(403, "You are  already verified");
  }
  const redisKey = `opt:${email}`;
  const saveOtp = await redisClient.get(redisKey);

  if (!saveOtp) {
    throw new AppError(401, "Invalid Otp");
  }
  if (saveOtp !== otp) {
    throw new AppError(401, "Invalid Otp");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }),
    { runValidators: true },
  ]);
  redisClient.del([redisKey]);
};
export const otpServices = {
  sentOtp,
  verifyOtp,
};
