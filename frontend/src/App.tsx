import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import CreateJobPage from "./pages/jobs/CreateJobPage"
import FindWorkPage from "./pages/jobs/FindWorkPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/post-job" element={<CreateJobPage />} />
      <Route path="/find-work" element={<FindWorkPage />} />
    </Routes>
  )
}

export default App
