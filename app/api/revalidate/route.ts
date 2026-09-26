import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { submitIndexNow } from "@/lib/indexnow";
import { localizedUrls, STATIC_PATHS } from "@/lib/site-urls";
import { SITE_URL } from "@/lib/structured-data";

/**
 * Sanity webhook → instant refresh after Tiko hits "Publish", then pings IndexNow
 * (Bing, Yahoo, DuckDuckGo, Yandex…) with the pages that changed.
 *
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL        https://tikopix.com/api/revalidate
 *   Trigger    create, update, delete · Dataset production
 *   Projection {_type, "slug": slug.current}
 *   Secret     = SANITY_REVALIDATE_SECRET (Netlify environment variable)
 * Without it, pages still refresh on their own within ~60 seconds.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

  revalidatePath("/[lang]", "layout");
  revalidatePath("/", "layout");

  // A project changes its own page plus every listing that shows it; settings/categories touch every page
  const paths = body?._type === "project" && body.slug ? [`/work/${body.slug}`, "", "/work", "/photo", "/video"] : [...STATIC_PATHS];
  const indexnow = await submitIndexNow(localizedUrls(paths), SITE_URL);

  return NextResponse.json({ revalidated: true, type: body?._type ?? null, indexnow });
}
