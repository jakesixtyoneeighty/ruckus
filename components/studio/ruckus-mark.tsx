import React from "react";

interface RuckusMarkProps {
  size?: number;
  className?: string;
}

/**
 * Simplified Ruckus brand mark derived from the Ruckus visual DNA:
 * charcoal tile, electric-cyan slash, vivid-orange spray dot and under-stroke.
 * Compact-safe: no taglines, no tiny text.
 */
export function RuckusMark({ size = 32, className }: RuckusMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Ruckus"
      className={["shrink-0", className].filter(Boolean).join(" ")}
    >
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#15181c" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        fill="none"
        stroke="#f5f1e8"
        strokeOpacity="0.16"
      />
      {/* cyan slash */}
      <path
        d="M7 23 L19 8"
        stroke="#00d5ff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* orange slash echo */}
      <path
        d="M13 24.5 L25 9.5"
        stroke="#ff5a1f"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* spray dots */}
      <circle cx="24.5" cy="22" r="1.6" fill="#ff5a1f" />
      <circle cx="8" cy="9" r="1.1" fill="#00d5ff" opacity="0.8" />
      <text
        x="16"
        y="22.5"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="15"
        fill="#f5f1e8"
      >
        R
      </text>
    </svg>
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
