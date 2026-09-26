import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/contact", "Contact", getDict(lang).meta.contact);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const [s, categories] = await Promise.all([getSettings(lang), getCategories(lang)]);
  return (
    <>
      <PageHeader eyebrow="Contact" title={t.cta.workTogether} />
      <section className="container-x grid gap-16 pb-28 lg:grid-cols-[1fr_1.5fr]">
        <Reveal className="space-y-10">
          <div>
            <p className="eyebrow mb-3">{t.contact.email}</p>
            <a href={`mailto:${s.email}`} className="text-xl text-fg underline decoration-violet decoration-1 underline-offset-8 hover:text-violet-soft">
              {s.email}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-3">{t.contact.basedIn}</p>
            <p className="text-fg">{s.city}</p>
            <p className="mt-1 text-sm text-muted">{t.contact.travel}</p>
          </div>
          <div>
            <p className="eyebrow mb-3">{t.contact.socials}</p>
            <div className="flex items-center gap-4">
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-fg hover:text-violet-soft">
                  <InstagramIcon /> {s.handle}
                </a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-fg hover:text-violet-soft">
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm email={s.email} types={categories.map((c) => c.title)} />
        </Reveal>
      </section>
    </>
  );
}
