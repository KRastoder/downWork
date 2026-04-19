import { Router } from "express";
import type { Response, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const jobRouter: Router = Router();
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import {
  createJob,
  createJobProposal,
  deleteJobById,
  getJobById,
} from "../services/jobSevice.ts";

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

    return res.status(201).json({ msg: "job created" });
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

jobRouter.delete(
  "/delete-jobs/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      if (!id || !userId) {
        return res.status(400).json({ msg: "Missing id or unothorized" });
      }

      const jobId = Number(id);

      if (isNaN(jobId)) {
        throw new Error("id must be a number");
      }

      await deleteJobById(jobId, userId);

      return res.status(200).json({ msg: "Job deleted" });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);
jobRouter.post(
  "/proposals/:jobId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const jobId = req.params;
      const id = req.user!.id;
      const { bid, estimatedDays, coverLetter } = req.body;

      if (!jobId) {
        return res
          .status(400)
          .json({ msg: "Need job it to accualy send proposal" });
      }

      const jobIdNumber = Number(jobId);

      if (isNaN(jobIdNumber)) {
        return res.status(400).json({ msg: "Job id must be a number" });
      }
      const proposal = await createJobProposal(
        id,
        jobIdNumber,
        bid,
        estimatedDays,
        coverLetter,
      );

      return res.status(200).json({ msg: "Proposal created", proposal }); // Remove proposal later TODO
    } catch (e) {
      return res.status(500).json({ msg: "Iternal server error" });
    }
  },
);

export default jobRouter;
