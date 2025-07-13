import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../ErrorHelper/AppError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExits = await User.findOne({ email });
  if (!isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email Does Not Exist");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExits.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }
  return {
    email: isUserExits.email,
  };
};

export const AuthService = {
  credentialsLogin,
};
