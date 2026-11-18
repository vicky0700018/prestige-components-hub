const P = (id: string, name: string, categoryId: string, type: string, image: string, short: string, description: string, featured = false) => ({
  id, name, categoryId, type, image, short, description, featured, active: true, createdAt: "2026-01-01T00:00:00.000Z",
});

const ELEC_TYPES = ["Electrical Switches", "Modular Switches", "Electrical Sockets", "MCB & Circuit Protection", "Distribution Boards", "Electrical Wires & Cables", "LED Lighting Components", "Electrical Accessories", "Connectors & Terminals", "Switchgear Components"];
const KITCHEN_TYPES = ["Kitchen Cabinet Handles", "Cabinet Hinges", "Drawer Channels", "Kitchen Pull-Out Accessories", "Cabinet Fittings", "Kitchen Baskets", "Modular Kitchen Hardware", "Storage Accessories", "Kitchen Organization Components", "Kitchen Fittings & Accessories"];

export const SEED = {
  categories: [
    { id: "cat_electrical", name: "Electrical Components", description: "Switches, sockets, circuit protection, wiring, lighting components and electrical accessories for residential and commercial requirements.", image: "asset:switches", status: "active", types: ELEC_TYPES },
    { id: "cat_kitchen", name: "Kitchen Components", description: "Cabinet handles, hinges, drawer channels, pull-out baskets and modular kitchen hardware for functional, well-organised kitchens.", image: "asset:handlesHinges", status: "active", types: KITCHEN_TYPES },
  ],
  products: [
    P("p1", "Classic Piano Switch Series", "cat_electrical", "Electrical Switches", "asset:switches", "Smooth-action switches with a clean, durable finish.", "A dependable range of piano-style electrical switches suited to homes, offices and retail spaces. Designed for smooth operation and a tidy, contemporary look on any wall.", true),
    P("p2", "Glass Touch Modular Panel", "cat_electrical", "Modular Switches", "asset:modularDark", "Sleek glass-finish modular switch plates.", "Modular switch panels with a refined glass front, available in multiple module configurations to suit modern interiors and lighting layouts.", true),
    P("p3", "Multi-Pin Socket with USB", "cat_electrical", "Electrical Sockets", "asset:switches", "Universal sockets with integrated USB charging.", "Multi-pin electrical sockets combining standard outlets with USB charging points — practical for bedrooms, offices and workstations."),
    P("p4", "Miniature Circuit Breakers", "cat_electrical", "MCB & Circuit Protection", "asset:mcb", "Circuit protection for safe electrical installations.", "A selection of MCBs for overload and short-circuit protection across residential and light commercial installations.", true),
    P("p5", "Distribution Board Enclosure", "cat_electrical", "Distribution Boards", "asset:mcb", "Neat enclosures for organised circuit management.", "Distribution boards that house MCBs and wiring in a clean, organised enclosure with neutral and earth bars."),
    P("p6", "House Wiring Cable Coils", "cat_electrical", "Electrical Wires & Cables", "asset:wiresLed", "Insulated copper wiring in standard colours.", "Insulated copper wires and cables in standard colour coding for house wiring and general electrical work."),
    P("p7", "LED Panel & Bulb Components", "cat_electrical", "LED Lighting Components", "asset:wiresLed", "LED panels, bulbs and drivers.", "LED lighting components including round panels, bulbs, spot lamps and LED drivers for efficient lighting setups.", true),
    P("p8", "Electrical Fitting Accessories", "cat_electrical", "Electrical Accessories", "asset:modularDark", "Plates, frames and finishing accessories.", "Supporting electrical accessories such as cover plates, frames and fitting essentials that complete every installation."),
    P("p9", "Brass Terminal Blocks & Lugs", "cat_electrical", "Connectors & Terminals", "asset:connectors", "Terminal blocks, lugs and ferrules.", "Brass terminal blocks, copper cable lugs and insulated ferrules for secure, reliable electrical connections."),
    P("p10", "Contactors & Switchgear Parts", "cat_electrical", "Switchgear Components", "asset:connectors", "Components for control and switching.", "Switchgear components including contactors for motor control and switching applications."),
    P("p11", "Brushed Steel Cabinet Handles", "cat_kitchen", "Kitchen Cabinet Handles", "asset:handlesHinges", "Minimal handles in steel and matte black.", "Contemporary cabinet handles in brushed steel and matte black finishes, offered in multiple lengths for drawers and shutters.", true),
    P("p12", "Soft-Close Concealed Hinges", "cat_kitchen", "Cabinet Hinges", "asset:handlesHinges", "Quiet, smooth closing for cabinet doors.", "Concealed hinges with soft-close action for quiet, controlled closing of kitchen and wardrobe shutters.", true),
    P("p13", "Telescopic Drawer Channels", "cat_kitchen", "Drawer Channels", "asset:kitchenBasket", "Full-extension ball-bearing channels.", "Telescopic drawer channels for smooth, full-extension movement in kitchen drawers and storage units."),
    P("p14", "Bottle Pull-Out Unit", "cat_kitchen", "Kitchen Pull-Out Accessories", "asset:kitchenFittings", "Slim pull-out for bottles and oils.", "A space-saving pull-out unit for bottles, oils and condiments that fits narrow cabinet spaces."),
    P("p15", "Lift-Up Cabinet Mechanism", "cat_kitchen", "Cabinet Fittings", "asset:kitchenFittings", "Assisted lift-up for overhead cabinets.", "Cabinet fittings including lift-up mechanisms that hold overhead shutters open for easy access."),
    P("p16", "Stainless Pull-Out Basket", "cat_kitchen", "Kitchen Baskets", "asset:kitchenBasket", "Wire baskets for drawers and cabinets.", "Stainless steel wire baskets for pots, pans and utensils, designed for modular kitchen drawers.", true),
    P("p17", "Modular Kitchen Hardware Set", "cat_kitchen", "Modular Kitchen Hardware", "asset:kitchenInterior", "Coordinated hardware for complete kitchens.", "A coordinated selection of modular kitchen hardware — handles, hinges and fittings — for complete kitchen projects."),
    P("p18", "Tall Pantry Pull-Out", "cat_kitchen", "Storage Accessories", "asset:kitchenStorage", "Floor-to-ceiling pantry storage.", "Tall pantry pull-out units with multiple shelves for organised storage of dry goods and essentials."),
    P("p19", "Corner Carousel Organiser", "cat_kitchen", "Kitchen Organization Components", "asset:kitchenStorage", "Make full use of corner cabinets.", "Rotating corner carousel trays that make blind corner cabinets accessible and practical."),
    P("p20", "Cutlery Tray & Plate Rack", "cat_kitchen", "Kitchen Fittings & Accessories", "asset:kitchenFittings", "Everyday organisation fittings.", "Cutlery tray inserts and plate racks that keep everyday kitchen items neatly in place."),
  ],
  gallery: [
    { id: "g1", title: "Electrical & Kitchen Range", description: "A curated selection across both categories.", category: "Product Collections", image: "asset:hero", active: true },
    { id: "g2", title: "Modular Switch Plate", description: "Switches, sockets and USB modules.", category: "Modular Switches", image: "asset:switches", active: true },
    { id: "g3", title: "Circuit Protection", description: "MCBs within a distribution board.", category: "Electrical Components", image: "asset:mcb", active: true },
    { id: "g4", title: "Wires & LED Components", description: "Cable coils, LED panels and drivers.", category: "Electrical Accessories", image: "asset:wiresLed", active: true },
    { id: "g5", title: "Handles & Hinges", description: "Cabinet hardware in steel and black.", category: "Kitchen Cabinet Hardware", image: "asset:handlesHinges", active: true },
    { id: "g6", title: "Pull-Out Basket", description: "Drawer channels with wire basket.", category: "Kitchen Fittings", image: "asset:kitchenBasket", active: true },
    { id: "g7", title: "Modern Modular Kitchen", description: "Hardware in a complete kitchen setting.", category: "Modern Kitchen Components", image: "asset:kitchenInterior", active: true },
    { id: "g8", title: "Connectors & Terminals", description: "Terminal blocks, lugs and contactors.", category: "Electrical Components", image: "asset:connectors", active: true },
    { id: "g9", title: "Pantry & Corner Storage", description: "Tall pull-outs and carousel units.", category: "Modern Kitchen Components", image: "asset:kitchenStorage", active: true },
    { id: "g10", title: "Glass Touch Switches", description: "Modular glass switch panel.", category: "Modular Switches", image: "asset:modularDark", active: true },
    { id: "g11", title: "Kitchen Fittings", description: "Trays, racks and lift-up fittings.", category: "Kitchen Fittings", image: "asset:kitchenFittings", active: true },
    { id: "g12", title: "Showroom Display", description: "Electrical and kitchen hardware displays.", category: "Product Collections", image: "asset:about", active: true },
  ],
  content: {
    hero: {
      label: "Your Trusted Components Trading Partner",
      heading: "Quality Electrical & Kitchen Components, All Under One Roof.",
      description: "Discover a comprehensive range of electrical and kitchen components backed by quality, reliability and professional trading solutions.",
      image: "asset:hero",
      cta1: "Explore Our Products",
      cta2: "Contact Us",
    },
    about: {
      heading: "Building Trust Through Quality & Reliability",
      description: "NEW PRESTIGE CORPORATION LLP is engaged in the retail trading of electrical and kitchen components, offering customers access to a diverse range of products for their requirements. We focus on product quality, dependable service and long-term business relationships.",
      image: "asset:about",
      companyInfo: "Retail Trade – Electrical Components & Kitchen Components",
      blocks: [
        { title: "Company Overview", text: "A retail trading company offering a diverse range of electrical and kitchen components and accessories." },
        { title: "Our Business Approach", text: "We understand each customer's requirement and help them find the right components from a varied product range." },
        { title: "Quality Commitment", text: "We focus on quality-oriented products so customers can rely on what they purchase." },
        { title: "Customer-Focused Service", text: "Clear communication and dependable service form the base of our long-term business relationships." },
      ],
      partners: ["Mitesh Himatlal Sanghavi", "Sanjay Himatlal Sanghavi"],
    },
    why: {
      heading: "Why Choose NEW PRESTIGE CORPORATION LLP?",
      intro: "A focused trading partner for electrical and kitchen components — built on variety, quality and lasting relationships.",
      features: [
        { title: "Wide Product Range", text: "A diverse selection of components and accessories to meet varied customer requirements.", visible: true },
        { title: "Electrical & Kitchen Components", text: "Two complementary product categories, conveniently available from one trading partner.", visible: true },
        { title: "Quality-Focused Products", text: "Products chosen with attention to quality, finish and dependable performance.", visible: true },
        { title: "Customer-Centric Approach", text: "We listen to requirements and help customers find suitable components.", visible: true },
        { title: "Reliable Trading Partner", text: "Consistent, dependable service you can count on for your component needs.", visible: true },
        { title: "Professional Business Relationships", text: "Transparent, professional dealings aimed at long-term relationships.", visible: true },
      ],
    },
    contact: {
      email: "newprestigecorp@gmail.com",
      address: "Office 11, Plot 55/57, Nagdevi X Lane, Mandvi, Mumbai, Maharashtra, India – 400003.",
      description: "Have a requirement for electrical or kitchen components? Send us your enquiry and our team will get back to you.",
    },
    footer: {
      description: "Retail trading of electrical components and kitchen components — offering product variety, quality-focused trading and professional service.",
      copyright: "© 2026 NEW PRESTIGE CORPORATION LLP. All Rights Reserved.",
      credit: "Designed and development by SOSynch Ai Tech",
    },
  },
  enquiries: [
    { id: "e1", name: "Demo Customer", email: "demo.customer@example.com", subject: "Modular switch enquiry", category: "Electrical Components", message: "Sample demo enquiry: please share details of the modular switch range.", date: "2026-11-10T10:00:00.000Z", status: "New" },
    { id: "e2", name: "Sample Interiors", email: "sample.interiors@example.com", subject: "Soft-close hinges", category: "Kitchen Components", message: "Sample demo enquiry: looking for soft-close hinges and drawer channels.", date: "2026-11-08T10:00:00.000Z", status: "Contacted" },
  ],
  admin: { name: "Site Administrator", email: "admin@newprestigecorp.com", password: "Admin@123" },
  activity: [
    { id: "a1", text: "Demo data initialised", date: "2026-11-01T09:00:00.000Z" },
  ],
};
