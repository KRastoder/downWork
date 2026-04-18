import { Router } from "express";
import type { Request, Response } from "express";
import { getUserById } from "../services/userService.ts";

const userRouter: Router = Router();

userRouter.get("/getUser/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    const user = await getUserById(idNumber);

    return user;
  } catch (e) {
    return res.status(500).json({ msg: "failed to get user " });
  }
});
export default userRouter;
