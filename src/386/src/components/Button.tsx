import type { ButtonHTMLAttributes, ReactNode } from "react";

const classes = {
  btn: "btn",
  btnPrimary: "btnPrimary",
  btnSecondary: "btnSecondary",
  btnSuccess: "btnSuccess",
  btnWarning: "btnWarning",
  btnDanger: "btnDanger",
  btnInfo: "btnInfo",
  btnLg: "btnLg",
  btnSm: "btnSm",
};

type ButtonVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info";
type ButtonSize = "default" | "lg" | "sm";

export function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const variantClass =
    variant === "primary"
      ? classes.btnPrimary
      : variant === "secondary"
        ? classes.btnSecondary
        : variant === "success"
          ? `${classes.btnPrimary} ${classes.btnSuccess}`
          : variant === "warning"
            ? `${classes.btnPrimary} ${classes.btnWarning}`
            : variant === "danger"
              ? `${classes.btnPrimary} ${classes.btnDanger}`
              : `${classes.btnPrimary} ${classes.btnInfo}`;

  const sizeClass = size === "lg" ? classes.btnLg : size === "sm" ? classes.btnSm : "";

  return (
    <button
      className={`${classes.btn} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
