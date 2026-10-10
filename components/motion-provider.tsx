"use client";

import { MotionConfig } from "motion/react";

/** Honours the OS "reduce motion" setting for every motion animation (A7). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
