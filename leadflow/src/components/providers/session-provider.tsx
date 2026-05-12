"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  session?: Session | null;
};

/** Required for `signIn`, `signOut`, and `useSession` on the client. */
export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
  );
}
