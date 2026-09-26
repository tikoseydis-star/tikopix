/** Labels come from the dictionary: t.nav[key] */
export const NAV = [
  { href: "/", key: "home" },
  { href: "/work", key: "work" },
  { href: "/video", key: "video" },
  { href: "/photo", key: "photo" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
