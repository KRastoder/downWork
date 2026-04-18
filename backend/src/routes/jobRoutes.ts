import { Router } from "express";
import type { Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const jobRouter: Router = Router();
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import { createJob } from "../services/jobSevice.ts";

jobRouter.post(
  "/create-job",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const recruiterId = req.user!.id;

    if (!recruiterId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { title, description, budget } = req.body;

    if (!title && !description && !budget) {
      return res.status(400).json({ msg: "Missing inputs" });
    }
    const budgetNumber = Number(budget);

    if (!budgetNumber && !isNaN(budgetNumber)) {
      return res.status(400).json({ msg: "Budget must be a number" });
    }
    const jobId = await createJob({
      title,
      description,
      budget: budgetNumber,
      recruiterId,
    });
    return res.status(201).json(jobId);
  },
);

export default jobRouter;
