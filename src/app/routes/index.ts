import { Router } from "express";
import { AuthRoutes } from "../Modules/auth/auth.routes";
import { DivisionRoutes } from "../Modules/division/division.route";
import { TourRoutes } from "../Modules/Tour/tour.route";
import { userRoutes } from "../Modules/User/user.routes";

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
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
