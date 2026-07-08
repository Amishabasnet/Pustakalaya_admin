"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;

export function DrawerContent({
  className,
  children,
  title,
  description,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  title: string;
  description?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
      <DialogPrimitive.Content
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 w-[92vw] max-w-md overflow-y-auto",
          "bg-surface shadow-[0_6px_24px_rgba(26,20,14,0.16)] border-l border-border/70",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border sticky top-0 bg-surface z-10">
          <div>
            <DialogPrimitive.Title className="font-body font-bold text-[17px] text-text-dark">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-[13px] text-text-medium mt-0.5">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className="h-8 w-8 shrink-0 flex items-center justify-center rounded-btn hover:bg-black/5 text-text-medium">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
        <div className="px-6 py-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
