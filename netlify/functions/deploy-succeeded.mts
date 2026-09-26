/**
 * Netlify event function: runs automatically after every successful deploy.
 * Reads the live sitemap and submits all its URLs to IndexNow (Bing, Yahoo,
 * DuckDuckGo, Yandex, Seznam, Naver…). Google reads the sitemap on its own.
 */
import { submitIndexNow } from "../../lib/indexnow";

const SITE = "https://tikopix.com";

const onDeploySucceeded = async (req: Request) => {
  let context: string | undefined;
  try {
    const body = (await req.json()) as { payload?: { context?: string } };
    context = body.payload?.context;
  } catch {
    /* no body: treat as production */
  }
  if (context && context !== "production") return new Response("skipped: " + context);

  const xml = await fetch(`${SITE}/sitemap.xml`, { cache: "no-store" }).then((r) => r.text());
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const result = await submitIndexNow(urls, SITE);
  console.log("[indexnow] after deploy", result);
  return new Response(JSON.stringify(result));
};

export default onDeploySucceeded;
