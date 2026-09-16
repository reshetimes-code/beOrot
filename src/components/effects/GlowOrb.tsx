import { cn } from "@/lib/utils";

type GlowOrbProps = {
  className?: string;
  size?: number;
  color?: "gold" | "warm";
};

export default function GlowOrb({ className, size = 480, color = "gold" }: GlowOrbProps) {
  const gradient =
    color === "gold"
      ? "radial-gradient(circle, rgba(217,162,86,0.35) 0%, rgba(217,162,86,0.08) 45%, transparent 70%)"
      : "radial-gradient(circle, rgba(242,201,138,0.25) 0%, rgba(217,162,86,0.06) 45%, transparent 70%)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full animate-drift", className)}
      style={{
        width: size,
        height: size,
        background: gradient,
        filter: "blur(10px)",
      }}
    />
  );
}
