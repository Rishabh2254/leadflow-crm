import { NextResponse } from "next/server";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function fail(message: string, status = 400) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      message,
    },
    { status },
  );
}
