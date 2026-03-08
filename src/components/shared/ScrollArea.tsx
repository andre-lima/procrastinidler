import type { CSSProperties, ReactNode } from 'react';

export interface ScrollAreaProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxHeight?: string | number;
}

export function ScrollArea({
  children,
  className = '',
  style = {},
  maxHeight = '70vh',
}: ScrollAreaProps) {
  const computedStyle: CSSProperties = {
    overflowY: 'auto',
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    ...style,
  };
  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}
