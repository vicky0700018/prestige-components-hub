import { createFileRoute } from "@tanstack/react-router";
import { WhyUs } from "@/components/site/Sections";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/why-choose-us")({ head: () => siteHead("Why Choose Us", "Discover our commitment to product variety, quality-focused trading and dependable customer service."), component: Page });
function Page() { return <SitePage><WhyUs /></SitePage>; }