"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Close } from "relume-icons";
import { cn } from "@/lib/utils";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        "absolute top-4 right-4 border-none opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <Close className="size-7 text-scheme-text" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
}

function DialogOverlay({
  className,
  showCloseIcon = true,
  closeIconClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & {
  showCloseIcon?: boolean;
  closeIconClassName?: string;
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    >
      {showCloseIcon && <DialogClose className={cn("text-white", closeIconClassName)} />}
    </DialogPrimitive.Overlay>
  );
}

function DialogContent({
  className,
  children,
  closeIconPosition = "outside",
  closeIconClassName,
  overlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  closeIconPosition?: "outside" | "inside";
  closeIconClassName?: string;
  overlayClassName?: string;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay
        className={cn("bg-neutral-darkest/90", overlayClassName)}
        showCloseIcon={closeIconPosition === "outside"}
        closeIconClassName={closeIconClassName}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 p-6",
          className,
        )}
        {...props}
      >
        {children}
        {closeIconPosition === "inside" && (
          <DialogClose className={cn("text-neutral-darkest", closeIconClassName)} />
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
};
