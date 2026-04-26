import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const headers = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
} as const;

function handle(): NextResponse {
  try {
    revalidatePath("/", "layout");
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "revalidate failed",
      },
      { status: 500, headers },
    );
  }

  return NextResponse.json(
    { ok: true, revalidated: { path: "/", type: "layout" } },
    { status: 200, headers },
  );
}

export function GET() {
  return handle();
}

export function POST() {
  return handle();
}
