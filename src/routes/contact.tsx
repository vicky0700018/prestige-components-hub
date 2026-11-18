import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/contact")({ head: () => siteHead("Contact Us", "Contact New Prestige Corporation LLP in Mandvi, Mumbai for electrical and kitchen component enquiries."), component: Page });
function Page() { return <SitePage><Contact /></SitePage>; }