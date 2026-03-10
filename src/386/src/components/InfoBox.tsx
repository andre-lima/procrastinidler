import type { ReactNode } from "react";

export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
}

export function InfoBox({ children, className = "" }: InfoBoxProps) {
  return (
    <div className={`infoBox ${className}`.trim()}>
      {children}
    </div>
  );
}
