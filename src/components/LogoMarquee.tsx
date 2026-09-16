"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { ClientLogo } from "@/lib/logos";
import LogoGrid from "@/components/LogoGrid";

function splitRows(logos: ClientLogo[], rowCount: number): ClientLogo[][] {
  const rows: ClientLogo[][] = Array.from({ length: rowCount }, () => []);
  logos.forEach((logo, i) => rows[i % rowCount].push(logo));
  return rows;
}

const ROW_CONFIG = [
  { keyframe: "marquee-ltr", duration: 46 },
  { keyframe: "marquee-rtl", duration: 58 },
  { keyframe: "marquee-ltr", duration: 40 },
] as const;

function MarqueeRow({
  logos,
  keyframe,
  duration,
}: {
  logos: ClientLogo[];
  keyframe: string;
  duration: number;
}) {
  const track = [...logos, ...logos];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex w-max items-center gap-4 group-hover:[animation-play-state:paused] sm:gap-5"
        style={{ animation: `${keyframe} ${duration}s linear infinite` }}
      >
        {track.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_2px_10px_rgba(20,14,4,0.04)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] hover:border-gold-dim/30 hover:shadow-[0_12px_30px_rgba(180,130,50,0.18)] sm:h-28 sm:w-48"
          >
            <div className="relative h-full w-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="192px"
                className="object-contain p-1"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee({ logos }: { logos: ClientLogo[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <LogoGrid logos={logos} />;
  }

  const rows = splitRows(logos, ROW_CONFIG.length);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {rows.map((rowLogos, i) => (
        <MarqueeRow
          key={i}
          logos={rowLogos}
          keyframe={ROW_CONFIG[i].keyframe}
          duration={ROW_CONFIG[i].duration}
        />
      ))}
    </div>
  );
}
