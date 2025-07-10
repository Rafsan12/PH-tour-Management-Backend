import cors from "cors";
import express, { Request, Response } from "express";
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

export default app;
