import { Prisma } from "@/generated/prisma/client";
import { LeadStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { ApiError, handleRouteError } from "@/server/api/errors";
import { ok } from "@/server/api/response";
import { createLeadSchema, listLeadsQuerySchema } from "@/server/api/validators/lead";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const parsedQuery = listLeadsQuerySchema.parse({
      status: request.nextUrl.searchParams.get("status") ?? undefined,
      search: request.nextUrl.searchParams.get("search") ?? undefined,
    });

    const where: Prisma.LeadWhereInput = {};

    if (parsedQuery.status) {
      where.status = parsedQuery.status;
    }

    if (parsedQuery.search) {
      where.OR = [
        { name: { contains: parsedQuery.search } },
        { company: { contains: parsedQuery.search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: [{ followUpAt: "asc" }, { createdAt: "desc" }],
      include: {
        discussions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            note: true,
            createdAt: true,
            followUpAt: true,
          },
        },
        _count: {
          select: {
            discussions: true,
          },
        },
      },
    });

    const data = leads.map((lead) => {
      const latestDiscussion = lead.discussions[0] ?? null;
      return {
        id: lead.id,
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        status: lead.status,
        followUpAt: lead.followUpAt,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        latestDiscussion,
        discussionCount: lead._count.discussions,
      };
    });

    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const input = createLeadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        company: input.company,
        phone: input.phone,
        followUpAt: input.followUpAt,
        status: LeadStatus.NEW,
      },
    });

    return ok(lead, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
