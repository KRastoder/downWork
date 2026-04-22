import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Job = {
  id: number
  title: string
  description: string
  budget: number
  avalability: boolean
  recruiterName: string
}

export default function FindWorkPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs/all-jobs")

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.msg || "Failed to fetch jobs")
        }

        setJobs(data.jobs)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Something went wrong")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading jobs...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Find Work</h1>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted by:{" "}
                <span className="font-bold text-red-500">
                  {job.recruiterName}
                </span>
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{job.description}</p>

              <p className="font-medium">Budget: ${job.budget}</p>

              <a
                className="bg-red-800 p-1 outline-2 outline-black hover:cursor-pointer"
                href={`/propose/${job.id}`}
              >
                Apply
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
