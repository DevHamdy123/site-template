"use client";

import { MotionConfig } from "framer-motion";

/** Respects the user's "reduce motion" setting for every animation in the site. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
