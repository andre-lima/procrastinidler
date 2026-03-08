import type { CSSProperties, ReactNode } from 'react';

const gapMap: Record<number, string> = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
};

export interface GridProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  columns?: string;
  rows?: string;
  gap?: number | string;
  areas?: string;
  align?: 'center' | 'start' | 'end' | 'stretch';
  gridArea?: string;
}

export function Grid({
  children,
  className = '',
  style = {},
  columns,
  rows,
  gap,
  areas,
  align,
  gridArea,
}: GridProps) {
  const computedStyle: CSSProperties = {
    display: 'grid',
    ...(columns && { gridTemplateColumns: columns }),
    ...(rows && { gridTemplateRows: rows }),
    ...(gap !== undefined && {
      gap: typeof gap === 'number' ? gapMap[gap] ?? `${gap}px` : gap,
    }),
    ...(areas && { gridTemplateAreas: areas }),
    ...(align && { alignItems: align }),
    ...(gridArea && { gridArea }),
    ...style,
  };
  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}
