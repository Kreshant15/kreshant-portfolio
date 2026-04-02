import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prev         = useRef(pathname);

  useEffect(() => {
    // Only fire on actual route changes, not hash changes within a page
    if (prev.current === pathname) return;
    prev.current = pathname;

    // Respect prefers-reduced-motion
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: motionOk ? "smooth" : "instant" });
  }, [pathname]);

  return null;
};