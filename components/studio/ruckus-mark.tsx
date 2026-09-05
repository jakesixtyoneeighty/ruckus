import React from "react";
import Image from "next/image";
import ruckusLogo from "@/app/ruckus.png";

interface RuckusMarkProps {
  size?: number;
  className?: string;
}

/**
 * Ruckus brand mark rendering the official ruckus.png image.
 * Sized responsively and styled to match existing icon dimensions and squircle curvature.
 */
export function RuckusMark({ size = 32, className }: RuckusMarkProps) {
  return (
    <Image
      src={ruckusLogo}
      alt="Ruckus"
      width={size}
      height={size}
      priority
      className={["shrink-0 object-contain rounded-[20%] overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    />
  );
}

export function RuckusWordmark({ className }: { className?: string }) {
  return (
    <span
      className={[
        "font-extrabold uppercase tracking-tight text-[#f5f1e8]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Ruckus
    </span>
  );
}
