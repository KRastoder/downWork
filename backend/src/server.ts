import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes.ts";
import userRouter from "./routes/userRoutes.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/user", authMiddleware, userRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "HOME PAGE" });
});

app.listen("3000", () => {
  console.log("SERVER RUNNING ON http://localhost:3000");
});
