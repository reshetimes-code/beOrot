import { cn } from "@/lib/utils";

type SunRaysEffectProps = {
  className?: string;
  size?: number;
  rayCount?: number;
  opacity?: number;
  spin?: boolean;
};

export default function SunRaysEffect({
  className,
  size = 520,
  rayCount = 14,
  opacity = 0.5,
  spin = true,
}: SunRaysEffectProps) {
  const rays = Array.from({ length: rayCount });

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", spin && "animate-spin-slow", className)}
      style={{ width: size, height: size, opacity }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {rays.map((_, i) => {
          const angle = (360 / rayCount) * i;
          const lengthVariant = i % 3 === 0 ? 78 : i % 3 === 1 ? 58 : 40;
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2={100 - lengthVariant}
              stroke="url(#ray-gradient)"
              strokeWidth={i % 3 === 0 ? 1.4 : 0.7}
              strokeLinecap="round"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}
        <defs>
          <linearGradient id="ray-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#d9a256" stopOpacity="0" />
            <stop offset="100%" stopColor="#f2c98a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
