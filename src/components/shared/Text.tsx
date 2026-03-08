import type { CSSProperties, ReactNode } from 'react';

export interface TextProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'span' | 'p';
  color?: string;
  size?: '1' | '2' | 'sm' | 'base' | 'md';
}

const sizeMap = {
  1: 'var(--text-xs)',
  2: 'var(--text-sm)',
  sm: 'var(--text-sm)',
  base: 'var(--text-base)',
  md: 'var(--text-md)',
};

export function Text({
  children,
  className = '',
  style = {},
  as: Component = 'span',
  color,
  size,
}: TextProps) {
  const computedStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    ...(color && { color }),
    ...(size && { fontSize: sizeMap[size] ?? sizeMap.base }),
    ...style,
  };
  return (
    <Component className={className} style={computedStyle}>
      {children}
    </Component>
  );
}
