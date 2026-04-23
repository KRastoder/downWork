import { useEffect, useState } from "react"

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    async function getMyProposals() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:3000/api/jobs/my-proposals", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setProposals(data.proposals)
      } catch (e) {
        console.error(e)
      }
    }

    getMyProposals()
  }, [])

  return (
    <div>
      <h1>My Proposals Page</h1>
      {proposals.map((p, i) => (
        <div key={i}>
          <pre>{JSON.stringify(p, null, 2)}</pre>
        </div>
      ))}
    </div>
  )
}
