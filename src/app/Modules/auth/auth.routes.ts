import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const routes = Router();

routes.post("/login", AuthControllers.credentialsLogin);
routes.post("/refresh-token", AuthControllers.getNewAccessToken);
routes.post("/logout", AuthControllers.logOut);

export const AuthRoutes = routes;
