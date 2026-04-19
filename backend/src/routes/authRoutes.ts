import { Router } from "express";
import type { Request, Response } from "express";
import { loginService, registerService } from "../services/authService.ts";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import { getMeService } from "../services/authService.ts";
import { freelancersOnlyMiddleware } from "../middleware/roleMiddleware.ts";

const authRouter: Router = Router();

// api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginService({ email: email, password: password });

    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      msg: "Login success",
      user: { id: user.id, name: user.name, email: user.email }, // TODO just for testing in terminal remove later
      token,
    });
  } catch (e) {
    return res.status(400).json({
      msg: "Invalid email or password",
    });
  }
});

// api/auth/register
authRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      err: "Missing required fields",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      err: "Password must be at least 6 characters",
    });
  }

  try {
    const user = await registerService({
      name,
      email,
      password,
      role: role as "client" | "freelancer",
    });

    return res.status(201).json({
      msg: "success",
      user: user, // TODO remove later
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ err: "Internal server error" });
  }
});

// api/auth/me
authRouter.get(
  "/me",
  authMiddleware,
  freelancersOnlyMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await getMeService({ userId });

      return res.status(200).json({
        user,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
);

export default authRouter;
