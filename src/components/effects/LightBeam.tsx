import { cn } from "@/lib/utils";

type LightBeamProps = {
  className?: string;
  angle?: number;
  width?: number;
  length?: number;
};

export default function LightBeam({
  className,
  angle = 0,
  width = 2,
  length = 400,
}: LightBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute origin-top animate-[ray-grow_1.4s_ease-out_forwards]", className)}
      style={{
        width,
        height: length,
        transform: `rotate(${angle}deg)`,
        background:
          "linear-gradient(to bottom, rgba(242,201,138,0.9), rgba(217,162,86,0.25) 55%, transparent)",
      }}
    />
  );
}
