import { hash } from "bcryptjs";
import { NextRequest } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { ApiError, handleRouteError } from "@/server/api/errors";
import { ok } from "@/server/api/response";
import { signupSchema } from "@/server/api/validators/auth";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const input = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name ?? null,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return ok(user, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

