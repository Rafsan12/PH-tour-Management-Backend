import cors from "cors";
import express, { Request, Response } from "express";

import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./app/config/env";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalError";
import notFound from "./app/middlewares/NotFound";
import { router } from "./app/routes";

// middleware

const app = express();
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// Router
app.use("/api/v1", router);

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to PH Tour management app" });
});

// Error handle
app.use(globalErrorHandler);
app.use(notFound);

export default app;
