import type { ReactNode } from "react";

export interface WindowContainerProps {
  /** "primary" = gray background, "secondary" = black background */
  variant?: "primary" | "secondary";
  /** When set, shows a title centered on the top inner border */
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function WindowContainer({
  variant = "primary",
  title,
  children,
  className = "",
}: WindowContainerProps) {
  const variantClass = variant === "secondary" ? "windowContainer--secondary" : "windowContainer--primary";
  return (
    <div className={`windowContainer ${variantClass} ${className}`.trim()}>
      {title != null && (
        <div className="windowContainer_titleWrap" aria-hidden>
          <span className="windowContainer_title">{title}</span>
        </div>
      )}
      <div className="windowContainerInner">{children}</div>
    </div>
  );
}
