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

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const resp = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || null, email, password }),
    });

    let payload: { success: boolean; message?: string };
    try {
      payload = (await resp.json()) as { success: boolean; message?: string };
    } catch {
      setPending(false);
      setError(`Server error (${resp.status}). Run a migration if User table is missing: npx prisma migrate dev`);
      return;
    }

    if (!resp.ok || !payload.success) {
      setPending(false);
      setError(payload.message ?? `Could not create account (${resp.status}).`);
      return;
    }

    // Auto sign-in after successful signup.
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    setPending(false);

    if (!result?.ok) {
      setError(
        result?.error
          ? `Auto sign-in failed (${result.error}). Try signing in manually on the login page.`
          : "Auto sign-in failed. Try signing in manually on the login page.",
      );
      router.push("/login");
      return;
    }

    router.push(result.url ?? "/");
    router.refresh();
  };

  return (
    <Card className="w-full rounded-xl border-border/60 p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Create your {siteConfig.name} account</h1>
        <p className="text-sm text-muted-foreground">This is a simple email/password login.</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-foreground underline underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

