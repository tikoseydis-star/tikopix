/**
 * IndexNow: tells Bing, Yahoo, DuckDuckGo (via Bing), Yandex, Seznam, Naver… that pages
 * changed, so they recrawl within minutes instead of weeks. Google does not take part:
 * it reads the sitemap submitted in Search Console.
 *
 * The key is public by design: search engines check it against /<key>.txt on the site.
 */
export const INDEXNOW_KEY = "dc03981e6a5822e54361c3718b4d0fc3";

export async function submitIndexNow(urls: string[], siteUrl = "https://tikopix.com") {
  const list = [...new Set(urls)].filter((u) => u.startsWith(siteUrl));
  if (!list.length) return { ok: true, submitted: 0 };
  const host = new URL(siteUrl).host;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`, urlList: list.slice(0, 10000) }),
    });
    // 200 = accepted, 202 = accepted (key validation pending)
    return { ok: res.status === 200 || res.status === 202, status: res.status, submitted: list.length };
  } catch (err) {
    console.error("[indexnow] submit failed", err);
    return { ok: false, submitted: 0 };
  }
}
