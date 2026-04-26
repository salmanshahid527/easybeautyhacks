import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const noindex = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
} as const;

function readSecret(request: NextRequest): string | null {
  const q = request.nextUrl.searchParams.get("secret");
  if (q) return q;
  const h = request.headers.get("x-revalidate-secret");
  if (h) return h.trim();
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  return null;
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401, headers: noindex },
  );
}

function handle(request: NextRequest): NextResponse {
  const expected = process.env.REVALIDATE_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "REVALIDATE_SECRET is not set. Add it in hosting env to enable cache invalidation.",
      },
      { status: 503, headers: noindex },
    );
  }

  if (readSecret(request) !== expected) {
    return unauthorized();
  }

  try {
    revalidatePath("/", "layout");
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "revalidate failed",
      },
      { status: 500, headers: noindex },
    );
  }

  return NextResponse.json(
    { ok: true, revalidated: { path: "/", type: "layout" } },
    { status: 200, headers: noindex },
  );
}

export function GET(request: NextRequest) {
  return handle(request);
}

export function POST(request: NextRequest) {
  return handle(request);
}
