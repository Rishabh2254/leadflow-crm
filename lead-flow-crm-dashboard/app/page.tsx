"use client";

import { useState, useMemo } from "react";
import { Users, TrendingUp, Target, Clock } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatusFilter, LeadStatus } from "@/components/dashboard/status-filter";
import { LeadCard, Lead } from "@/components/dashboard/lead-card";
import { FollowUps } from "@/components/dashboard/follow-ups";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AddLeadDialog } from "@/components/dashboard/add-lead-dialog";
import { LeadTimelineModal } from "@/components/dashboard/lead-timeline-modal";

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "TechCorp Solutions",
    email: "sarah@techcorp.com",
    status: "qualified",
    latestNote: "Very interested in our enterprise plan. Requested a demo for their team of 50+ next week.",
    timeAgo: "2 hours ago",
    hasFollowUp: true,
    followUpDate: "Today, 3:00 PM",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    company: "Global Dynamics",
    email: "m.rodriguez@globaldyn.com",
    status: "proposal",
    latestNote: "Sent pricing proposal. Awaiting feedback from their procurement team.",
    timeAgo: "4 hours ago",
    hasFollowUp: true,
    followUpDate: "Today, 5:00 PM",
  },
  {
    id: "3",
    name: "Emily Thompson",
    company: "Startup Labs",
    email: "emily@startuplabs.io",
    status: "new",
    latestNote: "Inbound lead from website. Downloaded our whitepaper on automation.",
    timeAgo: "1 day ago",
    hasFollowUp: false,
  },
  {
    id: "4",
    name: "David Park",
    company: "CloudFirst Inc",
    email: "dpark@cloudfirst.com",
    status: "contacted",
    latestNote: "Had initial call. Interested but evaluating competitors. Mentioned budget constraints.",
    timeAgo: "2 days ago",
    hasFollowUp: true,
    followUpDate: "Today, 10:00 AM",
  },
  {
    id: "5",
    name: "Jennifer Martinez",
    company: "Retail Pro",
    email: "jmartinez@retailpro.com",
    status: "won",
    latestNote: "Contract signed! Starting onboarding next Monday. 24-month deal.",
    timeAgo: "3 days ago",
    hasFollowUp: false,
  },
  {
    id: "6",
    name: "Robert Kim",
    company: "Finance Hub",
    email: "rkim@financehub.co",
    status: "qualified",
    latestNote: "Looking for compliance features. Need to discuss security certifications.",
    timeAgo: "4 days ago",
    hasFollowUp: false,
  },
  {
    id: "7",
    name: "Amanda Foster",
    company: "HealthTech Co",
    email: "afoster@healthtech.com",
    status: "lost",
    latestNote: "Decided to go with competitor. Budget was the main concern.",
    timeAgo: "1 week ago",
    hasFollowUp: false,
  },
  {
    id: "8",
    name: "James Wilson",
    company: "Manufacturing Plus",
    email: "jwilson@mfgplus.com",
    status: "new",
    latestNote: "Referred by existing customer. Interested in the starter plan.",
    timeAgo: "5 hours ago",
    hasFollowUp: true,
    followUpDate: "Today, 4:00 PM",
  },
];

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeStatus, setActiveStatus] = useState<LeadStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    if (activeStatus === "all") return leads;
    return leads.filter((lead) => lead.status === activeStatus);
  }, [leads, activeStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      all: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      won: 0,
      lost: 0,
    };
    leads.forEach((lead) => {
      counts[lead.status]++;
    });
    return counts;
  }, [leads]);

  const handleAddLead = (leadData: Omit<Lead, "id" | "timeAgo">) => {
    const newLead: Lead = {
      ...leadData,
      id: String(Date.now()),
      timeAgo: "Just now",
    };
    setLeads([newLead, ...leads]);
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setTimelineOpen(true);
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, ...updates, timeAgo: "Just now" } : lead
    ));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
  };

  const handleAddNote = (leadId: string, note: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, latestNote: note, timeAgo: "Just now" } : lead
    ));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, latestNote: note, timeAgo: "Just now" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddLead={() => setDialogOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Leads"
            value={leads.length}
            change="+12% from last month"
            trend="up"
            icon={Users}
          />
          <StatsCard
            title="Conversion Rate"
            value="24%"
            change="+3% from last month"
            trend="up"
            icon={TrendingUp}
          />
          <StatsCard
            title="Active Pipeline"
            value={statusCounts.qualified + statusCounts.proposal}
            change={`${statusCounts.proposal} in proposal`}
            trend="neutral"
            icon={Target}
          />
          <StatsCard
            title="Avg. Response Time"
            value="2.4h"
            change="-18% from last month"
            trend="up"
            icon={Clock}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Lead List */}
          <div className="lg:col-span-2 space-y-4">
            <StatusFilter
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              counts={statusCounts}
            />
            
            <div className="space-y-3">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No leads found in this category.
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => handleLeadClick(lead)} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FollowUps leads={leads} />
          </div>
        </div>
      </main>

      <AddLeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddLead={handleAddLead}
      />

      <LeadTimelineModal
        lead={selectedLead}
        open={timelineOpen}
        onOpenChange={setTimelineOpen}
        onUpdateLead={handleUpdateLead}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
