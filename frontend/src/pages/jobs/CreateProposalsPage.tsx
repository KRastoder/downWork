import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useParams } from "react-router-dom"

export default function CreateProposalsPage() {
  const { jobId } = useParams()

  const [bid, setBid] = useState(0)
  const [estimatedDays, setEstimatedDays] = useState(0)
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token || !jobId) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(
        `http://localhost:3000/api/jobs/proposals/${Number(jobId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bid,
            estimatedDays,
            coverLetter,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || "Failed to create proposal")
      }

      // ✅ SUCCESS MESSAGE
      setSuccess("Your proposal has been sent ✅")

      // optional: reset form
      setBid(0)
      setEstimatedDays(0)
      setCoverLetter("")
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-5">
          <h1 className="text-xl font-bold">Create Proposal</h1>

          <Input
            type="number"
            placeholder="Bid"
            value={bid}
            onChange={(e) => setBid(Number(e.target.value))}
            className="border p-2"
            required
          />

          <Input
            type="number"
            placeholder="Estimated Days"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(Number(e.target.value))}
            className="border p-2"
            required
          />

          <Textarea
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="border p-2"
            required
          />

          {/* ❌ ERROR */}
          {error && <p className="text-red-500">{error}</p>}

          {/* ✅ SUCCESS */}
          {success && <p className="text-green-500">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Proposal"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
