import { Router } from "express";
import type { Response, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const jobRouter: Router = Router();
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import { createJob, getJobById } from "../services/jobSevice.ts";

//TODO ADD ROLE MIDDLEWARE IF NOT RECRUITER THEN SEND UNOTHORIZED
jobRouter.post(
  "/create-job",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const recruiterId = req.user!.id;

    if (!recruiterId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ msg: "Missing inputs" });
    }

    const budgetNumber = Number(budget);
    if (isNaN(budgetNumber)) {
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
jobRouter.get("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = Number(id);

    const job = await getJobById(numberId);

    res.status(200).json({
      job: job,
    });
  } catch (e) {
    console.error("get jobs by id route error: ", e);
    return res.status(500).json({ err: "could not find a job by id" });
  }
});

export default jobRouter;
