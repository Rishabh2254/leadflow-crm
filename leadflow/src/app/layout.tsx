import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";

import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import { authOptions } from "@/server/auth/options";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={cn(geistMono.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
