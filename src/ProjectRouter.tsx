// ProjectRouter.tsx — All custom project pages registered

import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";

const customProjectPages: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  // Branding
  "driphive":     lazy(() => import("./projects/DripHiveProject").then(m => ({ default: m.DripHiveProject }))),
  "vexel":        lazy(() => import("./projects/VexelsProject").then(m => ({ default: m.VexelsProject }))),
  "vexels":       lazy(() => import("./projects/VexelsProject").then(m => ({ default: m.VexelsProject }))),
  // UI / Product
  "aura-app":     lazy(() => import("./projects/AuraProject").then(m => ({ default: m.AuraProject }))),
  "banana-quest": lazy(() => import("./projects/BananaQuestProject").then(m => ({ default: m.BananaQuestProject }))),
  // Poster Series
  "pixel-era":    lazy(() => import("./projects/PixelEraProject").then(m => ({ default: m.PixelEraProject }))),
  "antaryatra":   lazy(() => import("./projects/AntaryatraProject").then(m => ({ default: m.AntaryatraProject }))),
  // "vitl":      lazy(() => import("./projects/VITLProject").then(m => ({ default: m.VITLProject }))),
};

// ─── Loading fallback (minimal, matches dark theme) ───────
const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: "#0a0a0a" }}
  >
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }}
      />
      <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">
        Loading
      </p>
    </div>
  </div>
);

// ─── The router component ──────────────────────────────────
export const ProjectRouter = () => {
  const { id } = useParams<{ id: string }>();
  const CustomPage = id ? customProjectPages[id] : undefined;

  if (!CustomPage) {
    // No custom page registered → use the generic template
    return <ProjectDetailPage />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <CustomPage />
    </Suspense>
  );
};
