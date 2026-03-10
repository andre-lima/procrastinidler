const BAR_WIDTH = 20;

export interface AsciiProgressBarProps {
  title: string;
  value: number;
  max?: number;
  showPercent?: boolean;
  className?: string;
  barCount?: number;
}

export function AsciiProgressBar({
  title,
  value,
  max = 100,
  showPercent = true,
  className = "",
  barCount = BAR_WIDTH,
}: AsciiProgressBarProps) {
  const filled = Math.round((value / max) * barCount);
  const percent = Math.round((value / max) * 100);

  return (
    <div className={`asciiProgressBar ${className}`.trim()}>
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
