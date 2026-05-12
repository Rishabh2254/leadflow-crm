"use client";

import { Bell, Plus, Search } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/dashboard/lead-format";
import { siteConfig } from "@/config/site";

type LeadsDashboardHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddLead: () => void;
};

function profileInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) return getInitials(name.trim());
  if (email?.trim()) return email.trim().slice(0, 2).toUpperCase();
  return "?";
}

export function LeadsDashboardHeader({
  search,
  onSearchChange,
  onAddLead,
}: LeadsDashboardHeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-8">
          <h1 className="shrink-0 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {siteConfig.name}
          </h1>
          <div className="relative hidden min-w-0 flex-1 md:block md:max-w-sm lg:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or company..."
              className="border-0 bg-muted/50 pl-9 focus-visible:ring-1"
              aria-label="Search leads"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button type="button" onClick={onAddLead} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Lead</span>
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {status === "loading" ? (
            <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" aria-hidden />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full p-0"
                  aria-label="Account menu"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {profileInitials(session.user.name, session.user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    {session.user.name ? (
                      <span className="text-sm font-medium">{session.user.name}</span>
                    ) : null}
                    <span className="truncate text-xs text-muted-foreground">
                      {session.user.email ?? ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={() => signOut({ callbackUrl: "/login" })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="relative mt-3 md:hidden">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads..."
          className="border-0 bg-muted/50 pl-9 focus-visible:ring-1"
          aria-label="Search leads"
        />
      </div>
    </header>
  );
}
