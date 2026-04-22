import { Router } from "express";
import type { Response, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const jobRouter: Router = Router();
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import {
  createContract,
  createJob,
  createJobProposal,
  deleteJobById,
  getAllJobs,
  getAllProposalsByJobId,
  getContractById,
  getJobById,
  showMyContracts,
} from "../services/jobSevice.ts";
import {
  clientOnlyMiddleware,
  freelancersOnlyMiddleware,
} from "../middleware/roleMiddleware.ts";

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

jobRouter.get("/all-jobs", async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ msg: "No jobs posted" });
    }
    return res.status(200).json({ jobs });
  } catch (e) {
    return res.status(500).json({ err: "Iternal server error" });
  }
});

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
  freelancersOnlyMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const jobId = Number(req.params.jobId);
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

      return res.status(200).json({ msg: "Proposal created" }); // Remove proposal later TODO
    } catch (e) {
      console.error("createJobProposal error:", e);

      if (e instanceof Error) {
        if (e.message === "You already applied to this job") {
          return res
            .status(500)
            .json({ msg: "You already applied to this job" });
        }
        if (e.message === "Bid must be greater than 0") {
          return res.status(500).json({ msg: "Bid must be greater than 0" });
        }
      }
      return res.status(500).json({ msg: "Iternal server error" });
    }
  },
);

jobRouter.get(
  "/my-proposals/:jobId",
  authMiddleware,
  clientOnlyMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const jobId = Number(req.params);
      const id = req.user!.id;

      if (!jobId) {
        return res.status(400).json({ msg: "missing jobId" });
      }

      if (isNaN(jobId)) {
        return res.status(400).json({ msg: "Job id must be a number" });
      }

      const proposals = await getAllProposalsByJobId(jobId, id);

      return res.status(400).json({
        proposals,
      });
    } catch (e) {
      return res.status(500).json({ msg: "Iternal server error" });
    }
  },
);

jobRouter.post(
  "/contracts",
  authMiddleware,
  clientOnlyMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const clientId = req.user!.id;
      const proposalId = Number(req.body.proposalId);

      if (isNaN(proposalId)) {
        return res.status(400).json({ msg: "Invalid proposalId" });
      }

      const contract = await createContract(clientId, proposalId);

      return res.status(201).json({
        msg: "Contract created",
        contract,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
        if (e.message === "Proposal not found") {
          return res.status(404).json({ msg: e.message });
        }

        if (e.message === "Job not found") {
          return res.status(404).json({ msg: e.message });
        }

        if (e.message === "Contract already exists") {
          return res.status(409).json({ msg: e.message });
        }

        if (e.message === "Unauthorized") {
          return res.status(403).json({ msg: e.message });
        }
      }

      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

jobRouter.get(
  "/contracts",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const contracts = await showMyContracts(userId);
      return res.status(200).json({ contracts });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

jobRouter.get(
  "/contracts/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const contractId = Number(req.params.id);

      if (isNaN(contractId)) {
        return res.status(400).json({ msg: "Invalid contract id" });
      }

      const data = await getContractById(contractId, userId);

      return res.status(200).json({
        contract: data.contract,
        job: data.job,
        proposal: data.proposal,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "Contract not found") {
          return res.status(404).json({ msg: e.message });
        }

        if (e.message === "Unauthorized") {
          return res.status(403).json({ msg: e.message });
        }
      }

      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

export default jobRouter;
