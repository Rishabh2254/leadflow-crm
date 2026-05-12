import { prisma } from "@/lib/db/prisma";
import { ApiError, handleRouteError } from "@/server/api/errors";
import { parseNumericId } from "@/server/api/params";
import { ok } from "@/server/api/response";
import { updateLeadSchema } from "@/server/api/validators/lead";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const { id } = await context.params;
    const leadId = parseNumericId(id, "lead id");
    const input = updateLeadSchema.parse(body);

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!existingLead) {
      throw new ApiError(404, "Lead not found");
    }

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: input.status,
        followUpAt: input.followUpAt,
      },
    });

    return ok(lead);
  } catch (error) {
    return handleRouteError(error);
  }
}
