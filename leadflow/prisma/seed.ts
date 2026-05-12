import { addDays, set, subDays, subHours } from "date-fns";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  LeadStatus,
  PrismaClient,
  type Prisma,
} from "../src/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

function atHour(base: Date, hour: number, minute = 0) {
  return set(base, { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
}

async function main() {
  // Keep seed idempotent for local/dev resets.
  await prisma.discussion.deleteMany();
  await prisma.lead.deleteMany();

  const now = new Date();
  const today9am = atHour(now, 9);
  const today4pm = atHour(now, 16);

  const leads: Prisma.LeadCreateInput[] = [
    {
      name: "Aarav Sharma",
      company: "Nimbus Labs",
      phone: "+91-9876543210",
      status: LeadStatus.CONTACTED,
      followUpAt: subHours(now, 4), // overdue
      discussions: {
        create: [
          {
            note: "Inbound demo request from website. Team needs better lead routing and reminders.",
            createdAt: subDays(now, 8),
          },
          {
            note: "Discovery call done with RevOps manager. Pain point: leads falling through due to manual spreadsheet handoffs.",
            createdAt: subDays(now, 6),
          },
          {
            note: "Sent 14-day trial access and onboarding checklist. Awaiting internal stakeholder alignment.",
            createdAt: subDays(now, 2),
            followUpAt: subHours(now, 4),
          },
        ],
      },
    },
    {
      name: "Sofia Patel",
      company: "BluePeak Retail",
      phone: "+91-9988776655",
      status: LeadStatus.QUALIFIED,
      followUpAt: today4pm, // today
      discussions: {
        create: [
          {
            note: "Referred by existing customer. Looking for centralized sales pipeline across 4 store regions.",
            createdAt: subDays(now, 10),
          },
          {
            note: "Qualified budget and timeline. Target go-live before festive campaign in 6 weeks.",
            createdAt: subDays(now, 5),
          },
          {
            note: "Shared ROI calculator and implementation plan. Follow-up for security questionnaire today.",
            createdAt: subDays(now, 1),
            followUpAt: today4pm,
          },
        ],
      },
    },
    {
      name: "Daniel Thomas",
      company: "Northstar HealthTech",
      phone: "+1-415-555-0191",
      status: LeadStatus.PROPOSAL_SENT,
      followUpAt: addDays(today9am, 2),
      discussions: {
        create: [
          {
            note: "Intro via LinkedIn outbound. Interested in replacing legacy CRM used by SDR and BDR teams.",
            createdAt: subDays(now, 14),
          },
          {
            note: "Technical deep-dive with CTO complete. API and SSO requirements confirmed.",
            createdAt: subDays(now, 9),
          },
          {
            note: "Proposal sent with annual pricing and onboarding package. Requested legal review turnaround by Friday.",
            createdAt: subDays(now, 3),
            followUpAt: addDays(today9am, 2),
          },
        ],
      },
    },
    {
      name: "Meera Nair",
      company: "Atlas Logistics",
      phone: "+91-9001122334",
      status: LeadStatus.NEGOTIATION,
      followUpAt: today9am, // today
      discussions: {
        create: [
          {
            note: "Operations head requested better pipeline visibility for distributed inside-sales reps.",
            createdAt: subDays(now, 12),
          },
          {
            note: "Conducted stakeholder demo for sales director and CFO. Positive feedback on activity timeline.",
            createdAt: subDays(now, 7),
          },
          {
            note: "Negotiating seat-based discount for 40 users. Call with procurement scheduled this morning.",
            createdAt: subDays(now, 1),
            followUpAt: today9am,
          },
        ],
      },
    },
    {
      name: "Rohan Deshmukh",
      company: "Crestview Ventures",
      phone: "+91-9811122233",
      status: LeadStatus.NEW,
      followUpAt: addDays(today9am, 1),
      discussions: {
        create: [
          {
            note: "New inbound lead from webinar registration. Requested a walkthrough of lead scoring workflows.",
            createdAt: subDays(now, 1),
            followUpAt: addDays(today9am, 1),
          },
        ],
      },
    },
    {
      name: "Elena Rodriguez",
      company: "SummitWorks",
      phone: "+34-91-555-0175",
      status: LeadStatus.WON,
      followUpAt: null,
      discussions: {
        create: [
          {
            note: "Initial outreach from partner channel. Team evaluating CRM standardization across EU sales pods.",
            createdAt: subDays(now, 21),
          },
          {
            note: "Pilot completed successfully with 3 account executives. Improved response time by 27%.",
            createdAt: subDays(now, 11),
          },
          {
            note: "Deal closed on annual plan. Handover to customer success completed.",
            createdAt: subDays(now, 4),
          },
        ],
      },
    },
  ];

  await prisma.$transaction(
    leads.map((lead) =>
      prisma.lead.create({
        data: lead,
      }),
    ),
  );

  console.info(`Seeded ${leads.length} leads with realistic discussion history.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
