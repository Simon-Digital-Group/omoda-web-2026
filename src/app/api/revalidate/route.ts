import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * On-demand revalidation endpoint for Contentful webhooks.
 *
 * Wire it in Contentful → Settings → Webhooks:
 *   - URL:    https://omodajaecoo.com.uy/api/revalidate
 *   - Trigger: Entry/Asset → publish + unpublish
 *   - Header:  x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>
 *
 * On publish it invalidates the whole CMS layer (everything tagged "contentful"
 * in lib/contentful.ts), so content goes live immediately even though the time
 * window (`revalidate`) is long — that's what lets us keep API calls low.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CONTENTFUL_REVALIDATE_SECRET;

  // If no secret is configured we refuse rather than run unauthenticated.
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: "Revalidation secret not configured" },
      { status: 500 }
    );
  }

  const provided =
    req.headers.get("x-revalidate-secret") ||
    req.nextUrl.searchParams.get("secret");

  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret" },
      { status: 401 }
    );
  }

  revalidateTag("contentful");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
