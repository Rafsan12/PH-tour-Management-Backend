import { Router } from "express";
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

export const AuthRoutes = routes;
