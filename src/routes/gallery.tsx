import { createFileRoute } from "@tanstack/react-router";
import { Gallery } from "@/components/site/Gallery";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/gallery")({ head: () => siteHead("Gallery", "View electrical components, modular switches and kitchen hardware collections from New Prestige Corporation LLP."), component: Page });
function Page() { return <SitePage><Gallery /></SitePage>; }