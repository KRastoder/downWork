import { Router } from "express";
import type { Request, Response } from "express";
import { loginService, registerService } from "../services/authService.ts";

const authRouter: Router = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginService({ email: email, password: password });

    return res.status(200).json({
      msg: "Login success",
      user: { id: user.id, name: user.name, email: user.email }, // TODO just for testing in terminal remove later
    });
  } catch (e) {}
});

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
      user: user, // TODO remove later
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ err: "Internal server error" });
  }
});

export default authRouter;
