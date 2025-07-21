import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { AuthControllers } from "./auth.controller";

const routes = Router();

routes.post("/login", AuthControllers.credentialsLogin);
routes.post("/refresh-token", AuthControllers.getNewAccessToken);
routes.post("/logout", AuthControllers.logOut);
routes.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

routes.get(
  "/google",

  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
routes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallbackController
);
export const AuthRoutes = routes;
