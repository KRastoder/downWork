import { Router } from "express";
import type { Request, Response } from "express";
import registerService from "../services/authService.ts";

const authRouter: Router = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      err: "Missing required fields",
    });
  }

  if (role !== "client" && role !== "freelancer") {
    return res.status(400).json({
      err: "Role is not valid",
    });
  }
  try {
    const user = await registerService({
      name,
      email,
      password,
      role: role as "client" | "freelancer",
    });

    return res.status(200).json({
      msg: "success",
      user: user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ err: "Internal server error" });
  }
});
export default authRouter;
