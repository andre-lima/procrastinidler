import { Fragment, type ReactNode } from "react";

export interface SidebarProps {
  items: readonly string[];
  activeItem?: string;
  onItemClick?: (item: string, index: number) => void;
  renderItem?: (item: string, index: number, isActive: boolean) => ReactNode;
  className?: string;
}

export function Sidebar({
  items,
  activeItem,
  onItemClick,
  renderItem,
  className = "",
}: SidebarProps) {
  return (
    <div className={`sidebar ${className}`.trim()}>
      <div className="sidebarInner">
        {items.map((item, i) => {
          const isActive = activeItem !== undefined ? activeItem === item : i === 0;
          if (renderItem) {
            return <Fragment key={item}>{renderItem(item, i, isActive)}</Fragment>;
          }
          const classNames = isActive ? "sidebarItemActive" : "sidebarItem";
          const commonProps = {
            key: item,
            className: classNames,
            ...(onItemClick && {
              onClick: () => onItemClick(item, i),
              role: "button" as const,
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent) =>
                (e.key === "Enter" || e.key === " ") && onItemClick(item, i),
            }),
          };
          return <span {...commonProps}>{item}</span>;
        })}
      </div>
    </div>
  );
}
