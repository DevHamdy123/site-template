"use client";

import { motion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** seconds */
  delay?: number;
  /** true = animate on load (above the fold). false = animate when scrolled into view. */
  immediate?: boolean;
};

export function Reveal({ children, className, delay = 0, immediate = false }: RevealProps) {
  const common = {
    initial: { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  };

  if (immediate) {
    return (
      <motion.div className={className} {...common} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      {...common}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
