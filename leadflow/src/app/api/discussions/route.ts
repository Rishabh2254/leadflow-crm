import { prisma } from "@/lib/db/prisma";
import { ApiError, handleRouteError } from "@/server/api/errors";
import { parseNumericId } from "@/server/api/params";
import { ok } from "@/server/api/response";
import { createDiscussionSchema } from "@/server/api/validators/discussion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const input = createDiscussionSchema.parse(body);
    const leadId = parseNumericId(input.leadId, "leadId");

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
        select: { id: true },
      });

      if (!lead) {
        throw new ApiError(404, "Lead not found");
      }

      const discussion = await tx.discussion.create({
        data: {
          leadId,
          note: input.note,
          followUpAt: input.followUpAt ?? null,
        },
      });

      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          // Keep lead follow-up in sync with the latest discussion input.
          followUpAt: input.followUpAt ?? null,
        },
        select: {
          id: true,
          followUpAt: true,
          updatedAt: true,
        },
      });

      return { discussion, lead: updatedLead };
    });

    return ok(result, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
