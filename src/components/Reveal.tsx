"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
  duration?: number;
  as?: "div" | "span";
  once?: boolean;
  amount?: number;
};

const offsets: Record<string, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: -32 },
  right: { x: 32 },
  none: {},
};

export default function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  blur = true,
  duration = 0.8,
  as = "div",
  once = true,
  amount = 0.3,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = offsets[direction];

  const variants: Variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: {
          opacity: 0,
          x: offset.x ?? 0,
          y: offset.y ?? 0,
          filter: blur ? "blur(10px)" : "blur(0px)",
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
