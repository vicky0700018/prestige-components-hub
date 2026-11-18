import { createFileRoute } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { SitePage, siteHead } from "@/components/site/SitePage";
export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () =>
    siteHead(
      "Products",
      "Browse electrical switches, sockets, circuit protection and modular kitchen hardware from New Prestige Corporation LLP.",
    ),
  component: Page,
});

function Page() {
  const { category } = Route.useSearch();
  return (
    <SitePage>
      <Catalogue {...(category === undefined ? {} : { initialCategory: category })} />
    </SitePage>
  );
}