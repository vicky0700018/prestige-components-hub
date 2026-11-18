import { createFileRoute } from "@tanstack/react-router";
import { Categories } from "@/components/site/Sections";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/categories")({ head: () => siteHead("Categories", "Explore the electrical components and kitchen components categories at New Prestige Corporation LLP."), component: Page });
function Page() { return <SitePage><Categories /></SitePage>; }