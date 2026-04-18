import db from "../index.ts";
import { jobsTable } from "../db/schemas/jobs-schema.ts";
import { eq } from "drizzle-orm";
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
