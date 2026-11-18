import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useReveal } from "@/hooks/use-reveal";

export function SitePage({ children }: { children: ReactNode }) {
  useReveal();
  return <><Navbar /><main>{children}</main><Footer /></>;
}

export function siteHead(section: string, description: string) {
  const title = `${section} — New Prestige Corporation LLP`;
  return { meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] };
}