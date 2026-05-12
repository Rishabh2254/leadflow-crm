"use client";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export function StatsCard({ title, value, change, trend = "neutral", icon: Icon }: StatsCardProps) {
  return (
    <Card className="rounded-xl border-border/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
          {change ? (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend === "up" && "text-emerald-600 dark:text-emerald-400",
                trend === "down" && "text-red-500 dark:text-red-400",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {change}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg bg-muted/60 p-2.5">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}
