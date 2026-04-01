// providers/MotionProvider.tsx
import { MotionConfig } from "motion/react";
import { PropsWithChildren } from "react";

export const MotionProvider = ({ children }: PropsWithChildren) => {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
};
