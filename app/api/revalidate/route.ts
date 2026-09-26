import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → instant refresh after Tiko hits "Publish".
 * Configure in sanity.io/manage → API → Webhooks: URL https://<site>/api/revalidate,
 * trigger on create/update/delete, secret = SANITY_REVALIDATE_SECRET.
 * (Without it, pages still refresh on their own within 60 seconds.)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
