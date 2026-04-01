import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MotionProvider } from "./providers/motionprovider";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { BackToTop } from "./components/BackToTop";


export default function App() {
  return (
    <MotionProvider>
      <Router>
        <ScrollToTop />
        <BackToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Router>
    </MotionProvider>
  );
}

