import type { CSSProperties, ReactNode } from 'react';

const gapMap: Record<number, string> = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
};

export interface FlexProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  gap?: number | string;
  align?: 'center' | 'start' | 'end' | 'stretch' | 'baseline';
  justify?: 'center' | 'start' | 'end' | 'between' | 'around';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap';
  flexGrow?: number;
  gridArea?: string;
}

export function Flex({
  children,
  className = '',
  style = {},
  gap,
  align,
  justify,
  direction = 'row',
  wrap,
  flexGrow,
  gridArea,
}: FlexProps) {
  const computedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    ...(gap !== undefined && {
      gap: typeof gap === 'number' ? gapMap[gap] ?? `${gap}px` : gap,
    }),
    ...(align && { alignItems: align }),
    ...(justify && {
      justifyContent:
        justify === 'between'
          ? 'space-between'
          : justify === 'around'
            ? 'space-around'
            : justify,
    }),
    ...(wrap && { flexWrap: wrap }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(gridArea && { gridArea }),
    ...style,
  };
  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}
