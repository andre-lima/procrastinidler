import type { CSSProperties, ReactNode } from 'react';

export interface BoxProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  flexGrow?: number;
  flexShrink?: number;
  gridArea?: string;
}

export function Box({
  children,
  className = '',
  style = {},
  flexGrow,
  flexShrink,
  gridArea,
}: BoxProps) {
  const computedStyle: CSSProperties = {
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink: flexShrink }),
    ...(gridArea && { gridArea }),
    ...style,
  };
  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}
