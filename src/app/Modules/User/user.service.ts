import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../ErrorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExit = await User.findOne({ email });

  if (isUserExit) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  // console.log(hashedPassword);
  // const isPasswordMatch = await bcrypt.compare(
  //   password as string,
  //   hashedPassword
  // );
  // console.log(isPasswordMatch);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const IfUserExist = await User.findById(userId);
  if (!IfUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User didn't found");
  }

  if (payload.role) {
    if (decodedToken.Role === Role.USER || decodedToken.Role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "Your Are not Authorized");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.Role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Your Are not Authorized");
    }
  }

  if (payload.isActive || payload.isVerified || payload.isDeleted) {
    if (decodedToken.Role === Role.USER || decodedToken.Role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "Your Are not Authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const userServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  getSingleUser,
};
