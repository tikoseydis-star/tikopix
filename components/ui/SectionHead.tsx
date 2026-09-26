import { MaskLines, Reveal } from "@/components/motion/Reveal";

/** Eyebrow + two-line uppercase heading + optional right-hand copy/action, as in the mockup. */
export function SectionHead({
  eyebrow,
  title,
  aside,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  const lines = splitTitle(title);
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal y={10}>
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
        <MaskLines as={as} lines={lines} className="h-display text-[clamp(1.9rem,3.6vw,3rem)]" />
      </div>
      {aside && (
        <Reveal delay={0.15} className="md:max-w-sm">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

/** "Différents univers, une même vision." → ["Différents univers,", "une même vision."] */
export function splitTitle(title: string): string[] {
  const i = title.indexOf(",");
  if (i > -1 && i < title.length - 2) return [title.slice(0, i + 1), title.slice(i + 1).trim()];
  const words = title.split(" ");
  if (words.length < 4) return [title];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
