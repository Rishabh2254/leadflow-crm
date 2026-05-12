"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    setPending(false);

    if (!result?.ok) {
      const code = result?.error;
      if (code === "CredentialsSignin") {
        setError("Invalid email or password.");
      } else if (code) {
        setError(`Sign in failed (${code}).`);
      } else {
        setError("Sign in failed. Check NEXTAUTH_SECRET / NEXTAUTH_URL and try again.");
      }
      return;
    }

    router.push(result.url ?? "/");
    router.refresh();
  };

  return (
    <Card className="w-full rounded-xl border-border/60 p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Sign in to {siteConfig.name}</h1>
        <p className="text-sm text-muted-foreground">Use your email and password.</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="text-foreground underline underline-offset-4" href="/signup">
          Create one
        </Link>
      </p>
    </Card>
  );
}

