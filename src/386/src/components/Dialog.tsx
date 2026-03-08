import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps, ReactElement, ReactNode } from "react";

const classes = {
  dialogBackdrop: "dialogBackdrop",
  dialogPopup: "dialogPopup",
  dialogTitleBar: "dialogTitleBar",
  dialogCloseBtn: "dialogCloseBtn",
  dialogBody: "dialogBody",
  dialogFooter: "dialogFooter",
};

export function DialogRoot(props: ComponentProps<typeof BaseDialog.Root>) {
  return <BaseDialog.Root {...props} />;
}

export function DialogTrigger(props: ComponentProps<typeof BaseDialog.Trigger>) {
  return <BaseDialog.Trigger {...props} />;
}

export function DialogPortal(props: ComponentProps<typeof BaseDialog.Portal>) {
  return <BaseDialog.Portal {...props} />;
}

export function DialogBackdrop({ className = "", ...props }: ComponentProps<typeof BaseDialog.Backdrop>) {
  return <BaseDialog.Backdrop className={`${classes.dialogBackdrop} ${className}`} {...props} />;
}

export function DialogPopup({ className = "", ...props }: ComponentProps<typeof BaseDialog.Popup>) {
  return <BaseDialog.Popup className={`${classes.dialogPopup} ${className}`} {...props} />;
}

export function DialogTitleBar({ className = "", children, ...props }: { className?: string; children: ReactNode }) {
  return (
    <div className={`${classes.dialogTitleBar} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogClose({ render }: { render: ReactElement }) {
  return <BaseDialog.Close render={render} />;
}

export function DialogBody({ className = "", ...props }: { className?: string; children: ReactNode }) {
  return <div className={`${classes.dialogBody} ${className}`} {...props} />;
}

export function DialogTitle({ className = "", ...props }: ComponentProps<typeof BaseDialog.Title>) {
  return <BaseDialog.Title className={className} {...props} />;
}

export function DialogDescription({ className = "", ...props }: ComponentProps<typeof BaseDialog.Description>) {
  return <BaseDialog.Description className={className} {...props} />;
}

export function DialogFooter({ className = "", ...props }: { className?: string; children: ReactNode }) {
  return <div className={`${classes.dialogFooter} ${className}`} {...props} />;
}
