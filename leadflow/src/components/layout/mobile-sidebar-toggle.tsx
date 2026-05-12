"use client";

import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

type MobileSidebarToggleProps = {
  children: ReactNode;
};

export function MobileSidebarToggle({ children }: MobileSidebarToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-12 items-center justify-between border-b bg-background px-3 md:hidden">
        <span className="text-sm font-semibold">{siteConfig.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-expanded={open}
          aria-controls="mobile-dashboard-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          id="mobile-dashboard-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-dvh w-full max-w-xs flex-col border-r bg-sidebar shadow-lg">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
