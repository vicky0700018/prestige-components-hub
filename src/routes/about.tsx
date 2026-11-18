import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/Sections";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/about")({ head: () => siteHead("About Us", "Meet New Prestige Corporation LLP, a quality-focused electrical and kitchen components trading company in Mumbai."), component: Page });
function Page() { return <SitePage><About /></SitePage>; }