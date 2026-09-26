import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VideoModalProvider } from "@/components/media/VideoModal";
import { Cursor } from "@/components/motion/Cursor";
import { Intro } from "@/components/motion/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SmoothScroll>
      <VideoModalProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-violet focus:px-4 focus:py-2">
          Aller au contenu
        </a>
        <Intro name={settings.name} />
        <Header name={settings.name} instagram={settings.instagram} youtube={settings.youtube} email={settings.email} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
        <Cursor />
      </VideoModalProvider>
    </SmoothScroll>
  );
}
