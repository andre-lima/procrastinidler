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

export type ButtonVariant = "primary" | "secondary";
export type ButtonType = "default" | "success" | "warning" | "danger" | "info";
type ButtonSize = "default" | "lg" | "sm";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Semantic color; use with variant for filled (primary) or outlined (secondary) look. */
  type?: ButtonType;
  size?: ButtonSize;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  type: typeProp = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary" ? classes.btnPrimary : classes.btnSecondary;

  const typeClass =
    typeProp === "default"
      ? ""
      : typeProp === "success"
        ? classes.btnSuccess
        : typeProp === "warning"
          ? classes.btnWarning
          : typeProp === "danger"
            ? classes.btnDanger
            : classes.btnInfo;

  const sizeClass = size === "lg" ? classes.btnLg : size === "sm" ? classes.btnSm : "";

  return (
    <button
      type="button"
      className={`${classes.btn} ${variantClass} ${typeClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
