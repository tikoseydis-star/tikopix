/**
 * One-time pre-fill of Tiko's Studio with REAL content only:
 *   - site settings: every FR/EN text, email, Instagram, and his 3 velvet-stage portraits
 *   - the 4 categories (titles, icons, FR/EN descriptions), without covers
 * No demo/stock photo is uploaded: until Tiko adds his own, the site keeps showing
 * the demo image for anything still empty.
 *
 * Safe to re-run: documents are only created if missing (never overwrites his edits).
 *
 *   npm run seed:studio
 *
 * Needs SANITY_API_WRITE_TOKEN (Editor) in .env.local. Delete that token afterwards.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { seedCategories, seedEn, seedSettings } from "../lib/seed.ts";

const ROOT = join(import.meta.dirname, "..");

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const token = env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is empty in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vyy136yn",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 12);
const en = seedEn.settings;

async function uploadStage() {
  const images = [];
  for (const img of seedSettings.stageImages) {
    const file = join(ROOT, "public", img.src);
    const asset = await client.assets.upload("image", readFileSync(file), { filename: basename(file) });
    images.push({
      _type: "image",
      _key: key(),
      asset: { _type: "reference", _ref: asset._id },
      alt: img.alt,
      altEn: img.altEn,
    });
    console.log("  uploaded", basename(file));
  }
  return images;
}

async function main() {
  const existing = await client.getDocument("settings");
  if (existing) {
    console.log("settings: already exists, left untouched");
  } else {
    console.log("settings: creating…");
    const s = seedSettings;
    await client.createIfNotExists({
      _id: "settings",
      _type: "settings",
      heroEyebrow: s.heroEyebrow,
      heroTitle: s.heroTitle,
      heroTitleEn: en.heroTitle,
      heroAccent: s.heroAccent,
      heroAccentEn: en.heroAccent,
      heroText: s.heroText,
      heroTextEn: en.heroText,
      specialtiesTitle: s.specialtiesTitle,
      specialtiesTitleEn: en.specialtiesTitle,
      specialtiesText: s.specialtiesText,
      specialtiesTextEn: en.specialtiesText,
      lensTitle: s.lensTitle,
      lensTitleEn: en.lensTitle,
      lensText: s.lensText,
      lensTextEn: en.lensText,
      stageImages: await uploadStage(),
      aboutTitle: s.aboutTitle,
      aboutTitleEn: en.aboutTitle,
      aboutBio: s.aboutBio,
      aboutBioEn: en.aboutBio,
      aboutMission: s.aboutMission,
      aboutMissionEn: en.aboutMission,
      signature: s.signature,
      skills: s.skills.map((k, i) => ({
        _key: key(),
        icon: k.icon,
        label: k.label,
        labelEn: en.skills?.[i]?.label,
        value: k.value,
        valueEn: en.skills?.[i]?.value,
      })),
      ctaText: s.ctaText,
      ctaTextEn: en.ctaText,
      email: s.email,
      instagram: s.instagram,
      handle: s.handle,
      city: s.city,
    });
  }

  const tx = client.transaction();
  seedCategories.forEach((c, i) => {
    tx.createIfNotExists({
      _id: `category-${c.slug}`,
      _type: "category",
      title: c.title,
      titleEn: seedEn.categories[c.slug]?.title,
      slug: { _type: "slug", current: c.slug },
      icon: c.icon,
      description: c.description,
      descriptionEn: seedEn.categories[c.slug]?.description,
      order: (i + 1) * 10,
    });
  });
  await tx.commit();
  console.log(`categories: ${seedCategories.map((c) => c.slug).join(", ")} (created if missing)`);
  console.log("done");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
