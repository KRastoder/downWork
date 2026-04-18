import db from "../index.ts";
import { jobsTable } from "../db/schemas/jobs-schema.ts";
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
  }
}
