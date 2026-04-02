// providers/MotionProvider.tsx
//
// MotionConfig with reducedMotion:"user" is already applied at the root
// in App.tsx. This file is kept as a named export so any existing imports
// don't break — it simply passes children through unchanged.
//
// If you remove MotionConfig from App.tsx in the future, restore the
// wrapper here and re-import it in App.tsx instead.

import { PropsWithChildren } from "react";

export const MotionProvider = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};