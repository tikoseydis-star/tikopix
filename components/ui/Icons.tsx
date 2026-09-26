import { Aperture, Camera, Clapperboard, House, MapPin, Palette, PartyPopper, Trophy, Video, Wrench } from "lucide-react";
import type { CategoryIcon, Skill } from "@/lib/types";

type P = { className?: string };

export function InstagramIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9L15.5 12l-5.7 3.1Z" />
    </svg>
  );
}

const CATEGORY = { sport: Trophy, lifestyle: Camera, realestate: House, events: PartyPopper, video: Clapperboard, camera: Aperture };
export function CategoryGlyph({ icon, className = "h-5 w-5" }: { icon: CategoryIcon } & P) {
  const I = CATEGORY[icon] ?? Aperture;
  return <I className={className} strokeWidth={1.4} aria-hidden />;
}

const SKILL = { camera: Camera, video: Video, palette: Palette, tools: Wrench, pin: MapPin };
export function SkillGlyph({ icon, className = "h-6 w-6" }: { icon: Skill["icon"] } & P) {
  const I = SKILL[icon] ?? Camera;
  return <I className={className} strokeWidth={1.3} aria-hidden />;
}
