import { Link } from "@/components/i18n";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { getDict, type Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { NAV } from "./nav";

export function Footer({ settings, lang }: { settings: Settings; lang: Locale }) {
  const t = getDict(lang);
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <Logo name={settings.name} />
        <nav aria-label={t.a11y.footerNav}>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-fg">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-3 text-xs text-muted md:items-end">
          <div className="flex items-center gap-4">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-fg/80 hover:text-violet-soft"><InstagramIcon /></a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-fg/80 hover:text-violet-soft"><YoutubeIcon /></a>
            )}
            <span>{settings.handle}</span>
          </div>
          <p>© {new Date().getFullYear()} {settings.name}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
