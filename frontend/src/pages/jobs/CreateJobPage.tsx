import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateJobPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [budget, setBudget] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/", { replace: true })
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))

      if (payload.role !== "client") {
        navigate("/", { replace: true })
        return
      }
    } catch {
      navigate("/", { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:3000/api/jobs/create-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || "Failed to create job")
      }

      navigate("/")
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
      <Card className="w-full max-w-xl">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-xl">Create a job</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Budget</Label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
