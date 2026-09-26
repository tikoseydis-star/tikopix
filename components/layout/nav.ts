export const NAV = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/video", label: "Video" },
  { href: "/photo", label: "Photo" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
