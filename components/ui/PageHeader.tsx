import { MaskLines, Reveal } from "@/components/motion/Reveal";

/** Top of inner pages: huge outlined-then-filled title with an eyebrow and intro line. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="container-x relative pb-12 pt-36 md:pb-16 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
      <Reveal y={10}>
        <p className="eyebrow mb-5">{eyebrow}</p>
      </Reveal>
      <MaskLines as="h1" lines={[title]} animateOnMount delay={0.1} className="h-display text-[clamp(3.2rem,11vw,10rem)]" />
      {intro && (
        <Reveal delay={0.25} className="mt-8 max-w-xl">
          <p className="text-[15px] leading-relaxed text-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
