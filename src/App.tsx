import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { BackToTop } from "./components/BackToTop";
import SketchbookPage from './pages/SketchbookPage';


export default function App() {
  return (
    // MotionConfig at root — all Framer Motion instances inherit this.
    // reducedMotion: "user" reads the OS prefers-reduced-motion setting
    // and disables animations automatically. No per-component checks needed.
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollToTop />
        <BackToTop />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/projects"  element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/sketchbook" element={<SketchbookPage />} />
        </Routes>
      </Router>
    </MotionConfig>
  );
}