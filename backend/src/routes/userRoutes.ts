import { Router } from "express";
import type { Request, Response } from "express";
import { getUserById } from "../services/userService.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";

const userRouter: Router = Router();

userRouter.get("/getUser/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    const user = await getUserById(idNumber);

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ msg: "failed to get user " });
  }
});

userRouter.get("/me", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await getUserById(userId);

    return res.status(200).json({
      user,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

export default userRouter;
