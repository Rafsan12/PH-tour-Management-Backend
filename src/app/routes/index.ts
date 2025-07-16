import { Router } from "express";
import { userRoutes } from "../Modules/User/user.routes";
import { AuthRoutes } from "../Modules/auth/auth.routes";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
