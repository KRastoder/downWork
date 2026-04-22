import db from "../index.ts";
import {
  contractsTable,
  jobsTable,
  proposalsTable,
} from "../db/schemas/jobs-schema.ts";
import { usersTable } from "../db/schemas/user-schema.ts";
import { eq, and, or } from "drizzle-orm";
export async function createJob({
  title,
  description,
  budget,
  recruiterId,
}: {
  title: string;
  description: string;
  budget: number;
  recruiterId: number;
}) {
  try {
    return await db
      .insert(jobsTable)
      .values({
        recruiterId: recruiterId,
        title: title,
        description: description,
        budget: budget,
      })
      .returning({ id: jobsTable.id });
  } catch (e) {
    console.error("Error in jobService createJobService", e);
    throw e;
  }
}
//TODO ADD PROPOSALS LATER
export async function getJobById(id: number) {
  try {
    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);

    return job;
  } catch (e) {
    throw e;
  }
}
export async function getAllJobs() {
  const jobs = await db
    .select({
      id: jobsTable.id,
      title: jobsTable.title,
      description: jobsTable.description,
      budget: jobsTable.budget,
      avalability: jobsTable.avalability,

      recruiterName: usersTable.name,
    })
    .from(jobsTable)
    .leftJoin(usersTable, eq(jobsTable.recruiterId, usersTable.id));

  return jobs;
}
export async function deleteJobById(id: number, userId: number) {
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, id))
    .limit(1);

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiterId !== userId) {
    throw new Error("Unothorized");
  }

  await db.delete(jobsTable).where(eq(jobsTable.id, id));
}

export async function createJobProposal(
  userId: number,
  jobId: number,
  bid: number,
  estimatedDays: number,
  coverLetter: string,
) {
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, jobId))
    .limit(1);

  if (!job) {
    throw new Error("Job not found");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "freelancer") {
    throw new Error("Only freelancers can make proposals");
  }

  if (bid <= 0) {
    throw new Error("Bid must be greater than 0");
  }

  if (estimatedDays <= 0) {
    throw new Error("Estimated days must be greater than 0");
  }

  const existingProposal = await db
    .select()
    .from(proposalsTable)
    .where(
      and(
        eq(proposalsTable.jobId, jobId),
        eq(proposalsTable.freelancerId, userId),
      ),
    )
    .limit(1);

  if (existingProposal.length > 0) {
    throw new Error("You already applied to this job");
  }

  const [proposal] = await db
    .insert(proposalsTable)
    .values({
      estamatedDays: estimatedDays,
      bid,
      freelancerId: userId,
      jobId,
      coverLetter,
    })
    .returning();

  return proposal;
}

export async function getProposalsByFreelancerId(userId: number) {
  try {
    const proposals = await db
      .select({
        proposalId: proposalsTable.id,
        bid: proposalsTable.bid,
        estimatedDays: proposalsTable.estamatedDays,
        coverLetter: proposalsTable.coverLetter,

        jobId: jobsTable.id,
        jobTitle: jobsTable.title,
        jobDescription: jobsTable.description,
        jobBudget: jobsTable.budget,
        jobAvailability: jobsTable.avalability,
      })
      .from(proposalsTable)
      .leftJoin(jobsTable, eq(proposalsTable.jobId, jobsTable.id))
      .where(eq(proposalsTable.freelancerId, userId));

    return proposals;
  } catch (e) {
    console.error("get proposals by freelancer error!", e);
    throw e;
  }
}
export async function getAllProposalsForClient(userId: number) {
  try {
    const proposals = await db
      .select({
        // proposal data
        proposalId: proposalsTable.id,
        bid: proposalsTable.bid,
        estimatedDays: proposalsTable.estamatedDays,
        coverLetter: proposalsTable.coverLetter,

        // job data
        jobId: jobsTable.id,
        jobTitle: jobsTable.title,
        jobBudget: jobsTable.budget,

        // freelancer data
        freelancerId: usersTable.id,
        freelancerName: usersTable.name,
        freelancerEmail: usersTable.email,
      })
      .from(proposalsTable)
      .innerJoin(jobsTable, eq(proposalsTable.jobId, jobsTable.id))
      .innerJoin(usersTable, eq(proposalsTable.freelancerId, usersTable.id))
      .where(eq(jobsTable.recruiterId, userId));

    return proposals;
  } catch (e) {
    console.error("get all client proposals error!", e);
    throw e;
  }
}

export async function getAllProposalsByJobId(jobId: number, userId: number) {
  try {
    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, jobId));

    if (!job) {
      throw new Error("Job not found");
    }
    if (job.recruiterId !== userId) {
      throw new Error("Forbitten");
    }
    const proposals = await db
      .select()
      .from(proposalsTable)
      .where(eq(proposalsTable.jobId, jobId));

    return proposals;
  } catch (e) {
    console.error("get all proposals service error!", e);
  }
}
export async function createContract(clientId: number, proposalId: number) {
  const [proposal] = await db
    .select()
    .from(proposalsTable)
    .where(eq(proposalsTable.id, proposalId))
    .limit(1);

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, proposal.jobId))
    .limit(1);

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiterId !== clientId) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(contractsTable)
    .where(
      and(
        eq(contractsTable.jobId, job.id),
        eq(contractsTable.proposalId, proposalId),
      ),
    )
    .limit(1);

  if (existing) {
    throw new Error("Contract already exists");
  }

  const [contract] = await db
    .insert(contractsTable)
    .values({
      jobId: job.id,
      proposalId,
    })
    .returning();

  await db
    .update(jobsTable)
    .set({ avalability: false })
    .where(eq(jobsTable.id, job.id));

  return contract;
}

export async function showMyContracts(userId: number) {
  const contracts = await db
    .select()
    .from(contractsTable)
    .innerJoin(jobsTable, eq(contractsTable.jobId, jobsTable.id))
    .innerJoin(proposalsTable, eq(contractsTable.proposalId, proposalsTable.id))
    .where(
      or(
        eq(jobsTable.recruiterId, userId),
        eq(proposalsTable.freelancerId, userId),
      ),
    );

  return contracts;
}

export async function getContractById(contractId: number, userId: number) {
  const [contract] = await db
    .select()
    .from(contractsTable)
    .where(eq(contractsTable.id, contractId))
    .limit(1);

  if (!contract) {
    throw new Error("Contract not found");
  }

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, contract.jobId))
    .limit(1);

  const [proposal] = await db
    .select()
    .from(proposalsTable)
    .where(eq(proposalsTable.id, contract.proposalId))
    .limit(1);

  if (!job || !proposal) {
    throw new Error("Related data not found");
  }

  const isClient = job.recruiterId === userId;
  const isFreelancer = proposal.freelancerId === userId;

  if (!isClient && !isFreelancer) {
    throw new Error("Unauthorized");
  }

  return {
    contract,
    job,
    proposal,
  };
}
