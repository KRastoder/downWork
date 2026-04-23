import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import CreateJobPage from "./pages/jobs/CreateJobPage"
import FindWorkPage from "./pages/jobs/FindWorkPage"
import CreateProposalsPage from "./pages/jobs/CreateProposalsPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import MyProposalsPage from "./pages/jobs/MyProposalsPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/post-job" element={<CreateJobPage />} />
      <Route path="/find-work" element={<FindWorkPage />} />
      <Route path="/propose/:jobId" element={<CreateProposalsPage />} />
      <Route path="/my-proposals" element={<MyProposalsPage />} />
    </Routes>
  )
}

export default App
