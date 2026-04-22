import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ### POST /api/auth/register
// Creates a new user.

// Body:
// {
//   "name": "string",
//   "email": "string",
//   "password": "string (min 6 chars)",
//   "role": "client" | "freelancer"
// }

// Response:
// {
//   "msg": "success",
//   "user": {
//     "id": number,
//     "name": "string",
//     "email": "string",
//     "role": "client | freelancer"
//   }
// }

export function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role, name }),
      })

      const data: { msg?: string; token?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || "Login failed")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Role</Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              type="text"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
