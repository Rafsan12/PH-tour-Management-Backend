import { Router } from "express";
import { AuthRoutes } from "../Modules/auth/auth.routes";
import { BookingRoutes } from "../Modules/booking/booking.route";
import { DivisionRoutes } from "../Modules/division/division.route";

import { otpRoutes } from "../Modules/otp/otp.routes";
import { PaymentRoutes } from "../Modules/payment/payment.route";
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
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
