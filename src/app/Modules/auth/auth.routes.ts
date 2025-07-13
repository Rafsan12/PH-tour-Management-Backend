import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const routes = Router();

routes.post("/login", AuthControllers.credentialsLogin);

export const AuthRoutes = routes;
