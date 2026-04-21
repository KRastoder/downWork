import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import CreateJobPage from "./pages/jobs/CreateJobPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/post-job" element={<CreateJobPage />} />
    </Routes>
  )
}

export default App
