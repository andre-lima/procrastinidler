const BAR_WIDTH = 20;

export interface AsciiProgressBarProps {
  title: string;
  value: number;
  max?: number;
  showPercent?: boolean;
  className?: string;
}

export function AsciiProgressBar({
  title,
  value,
  max = 100,
  showPercent = true,
  className = "",
}: AsciiProgressBarProps) {
  const filled = Math.round((value / max) * BAR_WIDTH);
  const percent = Math.round((value / max) * 100);

  return (
    <div className={`asciiProgressBar ${className}`.trim()}>
      <span className="asciiProgressBar_title">{title}</span>{" "}
      <span className="asciiProgressBar_bar">
        <span className="asciiProgressBar_bracket">[</span>
        {Array.from({ length: BAR_WIDTH }, (_, i) => (
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
