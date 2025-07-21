import { AuthServices } from "./auth.service";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userTokens";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, logInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In",
      data: logInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    // const refreshToken = req.headers.authorization;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Refresh token receive ");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Retrieve successfully",
      data: tokenInfo,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      decodedToken as JwtPayload,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let state = req.query.state ? (req.query.state as string) : "";
    if (state.startsWith("/")) {
      state = state.slice();
    }
    const user = req.user;
    console.log("User :", user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User no found");
    }
    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);
    res.redirect(`%{envVars.FRONTEND_URL}/${state}`);

    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password Changed Successfully",
    //   data: null,
    // });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logOut,
  resetPassword,
  googleCallbackController,
};
