"use client";

import { useMemo, useRef, useState } from "react";
import { Clock, Target, TrendingUp, Users } from "lucide-react";

import { AddLeadDialog } from "@/components/dashboard/add-lead-dialog";
import { FollowUpsSection } from "@/components/dashboard/follow-ups-section";
import { LeadCard } from "@/components/dashboard/lead-card";
import { LeadDetailModal } from "@/components/dashboard/lead-detail-modal";
import { LeadsDashboardHeader } from "@/components/dashboard/leads-dashboard-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { filterLeads } from "@/lib/dashboard/lead-format";
import { computeDashboardStats, countByStatus } from "@/lib/dashboard/lead-stats";
import type { DashboardStatusFilter } from "@/lib/dashboard/lead-status";
import { useLeads } from "@/lib/query/hooks";

export function LeadsDashboard() {
  const { data: leads = [], isPending, isError, refetch, isRefetching } = useLeads();
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<DashboardStatusFilter>("ALL");
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const closeModalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(
    () => filterLeads(leads, { status: activeStatus, search }),
    [leads, activeStatus, search],
  );

  const counts = useMemo(() => countByStatus(leads), [leads]);
  const stats = useMemo(() => computeDashboardStats(leads), [leads]);

  const leadForModal = useMemo(() => {
    if (selectedId == null) return null;
    return leads.find((l) => l.id === selectedId) ?? null;
  }, [leads, selectedId]);

  const openLead = (id: number) => {
    if (closeModalTimeoutRef.current) {
      clearTimeout(closeModalTimeoutRef.current);
      closeModalTimeoutRef.current = null;
    }
    setSelectedId(id);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      if (closeModalTimeoutRef.current) {
        clearTimeout(closeModalTimeoutRef.current);
      }
      closeModalTimeoutRef.current = setTimeout(() => {
        setSelectedId(null);
        closeModalTimeoutRef.current = null;
      }, 200);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <LeadsDashboardHeader
        search={search}
        onSearchChange={setSearch}
        onAddLead={() => setAddOpen(true)}
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
            <p className="font-medium text-destructive">Could not load leads.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? "Retrying…" : "Retry"}
            </Button>
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {isPending ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total leads"
                value={stats.total}
                change={`${stats.won} won`}
                trend="neutral"
                icon={Users}
              />
              <StatsCard
                title="Active pipeline"
                value={stats.pipeline}
                change={`${stats.negotiation} in negotiation`}
                trend="neutral"
                icon={Target}
              />
              <StatsCard
                title="Win rate (approx.)"
                value={stats.total ? `${Math.round((stats.won / stats.total) * 100)}%` : "—"}
                change={stats.total ? `${stats.won} closed` : "Add leads to track"}
                trend="neutral"
                icon={TrendingUp}
              />
              <StatsCard
                title="Follow-ups due"
                value={stats.followUpsDue}
                change={
                  stats.overdueCount
                    ? `${stats.overdueCount} overdue`
                    : "No overdue items"
                }
                trend={stats.overdueCount ? "down" : "up"}
                icon={Clock}
              />
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <StatusFilter
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              counts={counts}
            />

            <div className="space-y-3">
              {isPending ? (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                  ))}
                </>
              ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
                  No leads match this view.
                </div>
              ) : (
                filtered.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => openLead(lead.id)} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <FollowUpsSection
              leads={leads}
              onSelectLead={(lead) => openLead(lead.id)}
            />
          </div>
        </div>
      </div>

      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} />

      {leadForModal ? (
        <LeadDetailModal
          lead={leadForModal}
          open={detailOpen}
          onOpenChange={handleDetailOpenChange}
        />
      ) : null}
    </div>
  );
}
