import cors from "cors";
import express, { Request, Response } from "express";

import { globalErrorHandler } from "./app/middlewares/globalError";
import notFound from "./app/middlewares/NotFound";
import { router } from "./app/routes";

// middleware
const app = express();
app.use(express.json());
app.use(cors());

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
