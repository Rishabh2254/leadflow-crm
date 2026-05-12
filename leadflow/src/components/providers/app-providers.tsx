"use client";

import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";

type AppProvidersProps = {
  children: ReactNode;
  session?: Session | null;
};

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}
