import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../ErrorHelper/AppError";
import { createUserToken } from "../../utils/userTokens";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { createAccessTokenAndRefreshToken } from "./../../utils/userTokens";

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

  const userToken = createUserToken(isUserExits);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExits.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenAndRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
};
