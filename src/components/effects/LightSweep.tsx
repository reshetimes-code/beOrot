import { cn } from "@/lib/utils";

export default function LightSweep({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <span
        className="absolute inset-y-0 w-1/3 animate-sweep"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />
    </span>
  );
}
