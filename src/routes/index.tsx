import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero, Categories } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

const TITLE = "New Prestige Corporation LLP — Electrical & Kitchen Components, Mumbai";
const DESC = "Retail trading of electrical components and modular kitchen hardware in Mandvi, Mumbai. Browse switches, MCBs, wiring, hinges, handles, baskets and more.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  useReveal();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
  }, []);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
      </main>
      <Footer />
    </>
  );
}
