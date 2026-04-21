import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes.ts";
import userRouter from "./routes/userRoutes.ts";
import jobRouter from "./routes/jobRoutes.ts";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/jobs", jobRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "WORKING" });
});

app.listen("3000", () => {
  console.log("SERVER RUNNING ON http://localhost:3000");
});
