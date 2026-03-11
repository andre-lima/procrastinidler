import type { ReactNode } from "react";

const BAR_WIDTH = 20;

export interface AsciiProgressBarProps {
  /** Title shown before the bar; can be string or ReactNode for styled text (e.g. colored amount). */
  title: string | ReactNode;
  value: number;
  max?: number;
  showPercent?: boolean;
  className?: string;
  barCount?: number;
  /** When "disabled", brackets and pipes use muted gray. Use when meter is inactive (e.g. burnout when money is safe). */
  theme?: "default" | "disabled";
}

export function AsciiProgressBar({
  title,
  value,
  max = 100,
  showPercent = true,
  className = "",
  barCount = BAR_WIDTH,
  theme = "default",
}: AsciiProgressBarProps) {
  const filled = Math.round((value / max) * barCount);
  const percent = Math.round((value / max) * 100);
  const themeClass = theme === "disabled" ? " asciiProgressBar--disabled" : "";

  return (
    <div className={`asciiProgressBar${themeClass} ${className}`.trim()}>
      <span className="asciiProgressBar_title">{title}</span>{" "}
      <span className="asciiProgressBar_bar">
        <span className="asciiProgressBar_bracket">[</span>
        {Array.from({ length: barCount }, (_, i) => (
          <span
            key={i}
            className={i < filled ? "asciiProgressBar_fill" : "asciiProgressBar_empty"}
          >
            |
          </span>
        ))}
        <span className="asciiProgressBar_bracket">]</span>
      </span>
      {showPercent && <span className="asciiProgressBar_percent">{percent}%</span>}
    </div>
  );
}
