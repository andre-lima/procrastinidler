import type { CSSProperties, ReactNode } from 'react';

const sizeMap: Record<string, string> = {
  '3': 'var(--text-xl)',
  '4': 'var(--text-2xl)',
  '5': 'var(--text-3xl)',
};

export interface HeadingProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'h1' | 'h2' | 'h3';
  size?: '3' | '4' | '5' | string;
}

export function Heading({
  children,
  className = '',
  style = {},
  as: Component = 'h2',
  size = '4',
}: HeadingProps) {
  const computedStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-fg-text)',
    margin: 0,
    ...(size && sizeMap[size] && { fontSize: sizeMap[size] }),
    ...style,
  };
  return (
    <Component className={className} style={computedStyle}>
      {children}
    </Component>
  );
}
