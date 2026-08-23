import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../schema";
import {
  siteSettings,
  navItem,
  page,
  section,
  sectionTab,
  sectionBullet,
  heroSlide,
  blogPost,
  teamMember,
  contactMethod,
  memberState,
  partner,
  opportunity,
  publication,
  miscResource,
} from "../schema";

function p(text: string) {
  return `<p>${text}</p>`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set — copy .env.example to .env first.",
    );
  }

  const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema, mode: "default" });

  async function resetPage(slug: string) {
    const [existing] = await db
      .select({ id: page.id })
      .from(page)
      .where(eq(page.slug, slug));
    if (existing) {
      await db.delete(section).where(eq(section.pageId, existing.id));
      await db.delete(page).where(eq(page.id, existing.id));
    }
  }

  console.log("Seeding site_settings...");
  await db.delete(siteSettings);
  await db.insert(siteSettings).values({
    logoLight: "/logo/logo-light.png",
    logoDark: "/logo/logo-dark.png",
    footerDescription:
      "Stay updated with our latest insights, projects, and clean energy developments.",
    copyrightText: "© 2026 CECECO. All rights reserved.",
  });

  console.log("Seeding nav_item (navbar + footer)...");
  await db.delete(navItem);
  const [about] = await db
    .insert(navItem)
    .values({ label: "About", href: "#", location: "navbar", order: 1 })
    .$returningId();
  const [projects] = await db
    .insert(navItem)
    .values({ label: "Projects", href: "#", location: "navbar", order: 2 })
    .$returningId();
  await db.insert(navItem).values({
    label: "Partners",
    href: "/partners",
    location: "navbar",
    order: 3,
  });
  const [news] = await db
    .insert(navItem)
    .values({ label: "News", href: "#", location: "navbar", order: 4 })
    .$returningId();
  const [resources] = await db
    .insert(navItem)
    .values({ label: "Resources", href: "#", location: "navbar", order: 5 })
    .$returningId();
  await db.insert(navItem).values({
    label: "Contact",
    href: "/contact",
    location: "navbar",
    order: 6,
  });

  await db.insert(navItem).values([
    {
      label: "About CECECO",
      href: "/about",
      location: "navbar",
      parentId: about.id,
      order: 1,
    },
    {
      label: "Team",
      href: "/team",
      location: "navbar",
      parentId: about.id,
      order: 2,
    },
    {
      label: "Mission & Vision",
      href: "/vision-and-mission",
      location: "navbar",
      parentId: about.id,
      order: 3,
    },
    {
      label: "Signatory Countries",
      href: "/about/signatory-countries",
      location: "navbar",
      parentId: about.id,
      order: 4,
    },
    {
      label: "Work With Us",
      href: "/work-with-us",
      location: "navbar",
      parentId: about.id,
      order: 5,
    },
  ]);
  await db.insert(navItem).values([
    {
      label: "Projects",
      href: "/projects",
      location: "navbar",
      parentId: projects.id,
      order: 1,
    },
    {
      label: "Regional Initiatives",
      href: "/projects?type=regional-initiative",
      location: "navbar",
      parentId: projects.id,
      order: 2,
    },
  ]);
  await db.insert(navItem).values([
    {
      label: "News",
      href: "/news",
      location: "navbar",
      parentId: news.id,
      order: 1,
    },
    {
      label: "Events",
      href: "/events",
      location: "navbar",
      parentId: news.id,
      order: 2,
    },
  ]);
  await db.insert(navItem).values([
    {
      label: "Publications",
      href: "/resources/publications",
      location: "navbar",
      parentId: resources.id,
      order: 1,
    },
    {
      label: "Reports",
      href: "/resources/reports",
      location: "navbar",
      parentId: resources.id,
      order: 2,
    },
    {
      label: "Documents",
      href: "/resources/documents",
      location: "navbar",
      parentId: resources.id,
      order: 3,
    },
    {
      label: "Media",
      href: "/resources/media",
      location: "navbar",
      parentId: resources.id,
      order: 4,
    },
  ]);

  await db.insert(navItem).values([
    {
      label: "About",
      href: "/about",
      location: "footer",
      group: "quick_links",
      order: 1,
    },
    {
      label: "Our work",
      href: "/our-work",
      location: "footer",
      group: "quick_links",
      order: 2,
    },
    {
      label: "Team",
      href: "/team",
      location: "footer",
      group: "quick_links",
      order: 3,
    },
    {
      label: "Partners",
      href: "/partners",
      location: "footer",
      group: "quick_links",
      order: 4,
    },
    {
      label: "Resources",
      href: "/resources",
      location: "footer",
      group: "quick_links",
      order: 5,
    },

    {
      label: "X",
      href: "https://x.com/cececo",
      location: "footer",
      group: "connect",
      icon: "x",
      order: 1,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/cececo",
      location: "footer",
      group: "connect",
      icon: "linkedin",
      order: 2,
    },
  ]);

  console.log("Seeding hero slides...");
  await db.delete(heroSlide);
  await db.insert(heroSlide).values([
    {
      order: 1,
      backgroundImage: "/images/home-hero-header-section.png",
      title: "Driving clean energy and cooperation across the ECO region",
      description:
        "Accelerating sustainable energy transition through regional collaboration and innovative solutions.",
      seeMoreEnabled: true,
      pageSlug: "our-mission",
      pageTitle: "Our Mission",
      pageBody: [
        p(
          "CECECO exists to accelerate the clean energy and climate transition across the ECO region, reducing environmental externalities and promoting sustainable industrialisation.",
        ),
        `<img src="/images/home-2-0-about-section.png" alt="" />`,
        p(
          "By advancing renewable energy, energy efficiency, and circular economy practices, CECECO contributes to economic diversification, job creation, and regional cooperation.",
        ),
      ].join(""),
    },
    {
      order: 2,
      backgroundImage: "/images/home-2-0-gallery-section-0.png",
      title: "Regional collaboration shaping clean energy futures",
      description:
        "Explore our impactful initiatives and collaborative efforts across ECO member states.",
      seeMoreEnabled: false,
    },
    {
      order: 3,
      backgroundImage: "/images/about-2-0-header-section.png",
      title: "A regional mechanism for the energy transition",
      description:
        "Established with the support of ECO member states to advance a shared clean energy agenda.",
      seeMoreEnabled: false,
    },
  ]);

  console.log("Seeding blog posts...");
  await db.delete(blogPost);
  await db.insert(blogPost).values([
    {
      slug: "innovative-solutions-for-clean-energy",
      title: "Innovative Solutions for Clean Energy",
      excerpt:
        "Discover how new technologies are transforming the energy landscape.",
      body: [
        p(
          "Across the ECO region, new technologies are transforming how energy is generated, stored, and distributed. From modular solar installations to smart grid pilots, member states are experimenting with approaches tailored to their own resources and needs.",
        ),
        `<img src="/images/home-features-list-section-0.png" alt="" />`,
        p(
          "CECECO's role is to connect these efforts — sharing lessons learned, co-financing pilots with regional partners, and helping successful projects scale across borders.",
        ),
      ].join(""),
      coverImage: "/images/home-2-0-blog-list-section-0.jpg",
      category: "Research",
      status: "published",
      publishedAt: new Date("2026-08-01"),
    },
    {
      slug: "the-future-of-renewable-energy",
      title: "The Future of Renewable Energy",
      excerpt: "Insights into the future trends of renewable energy policies.",
      body: [
        p(
          "Renewable energy policy across the ECO region is shifting from pilot-scale incentives toward long-term, coordinated frameworks. This piece looks at what that shift means for investors, utilities, and communities alike.",
        ),
        p(
          "Harmonised grid codes, shared technical standards, and joint procurement are among the tools member states are exploring to reduce costs and accelerate deployment.",
        ),
      ].join(""),
      coverImage: "/images/home-2-0-blog-list-section-1.jpg",
      category: "Policy",
      status: "published",
      publishedAt: new Date("2026-07-15"),
    },
    {
      slug: "cececos-recent-achievements",
      title: "CECECO's Recent Achievements",
      excerpt:
        "Celebrating milestones in our clean energy journey and collaborations.",
      body: p(
        "From the ratification of the CECECO Charter to the first cohort of regional pilot projects, the past year has marked real progress toward a shared clean energy agenda across the ECO region.",
      ),
      coverImage: "/images/home-2-0-blog-list-section-2.jpg",
      category: "Updates",
      status: "published",
      publishedAt: new Date("2026-06-20"),
    },
    {
      slug: "regional-grid-integration-progress",
      title: "Regional Grid Integration: Progress Report",
      excerpt:
        "An update on cross-border grid integration efforts among ECO member states.",
      body: p(
        "Cross-border grid integration remains one of the most technically demanding — and highest-impact — programmes in CECECO's portfolio. This update covers progress across three pilot corridors.",
      ),
      coverImage: "/images/home-features-list-section-1.png",
      category: "Updates",
      status: "published",
      publishedAt: new Date("2026-05-10"),
    },
  ]);

  console.log("Seeding team members (leadership + technical)...");
  await db.delete(teamMember);
  await db.insert(teamMember).values([
    {
      name: "Aysel Yagubova",
      role: "Executive Director",
      bio: "Leading initiatives to enhance clean energy solutions across the ECO region.",
      photo: null,
      email: "a.yagubova@cececo.org",
      group: "leadership",
      status: "active",
      order: 1,
    },
    {
      name: "Asif Mammadzada",
      role: "Communication Manager",
      bio: "Shaping CECECO's communications and public engagement across the ECO region.",
      photo: "/images/about-2-0-team-0.jpg",
      email: "a.mammadzada@cececo.org",
      group: "leadership",
      status: "active",
      order: 2,
    },
    {
      name: "Nigar Shukurova",
      role: "Project Coordinator",
      bio: "Coordinating regional projects to ensure successful implementation and impact.",
      photo: "/images/about-2-0-team-1.jpg",
      email: "n.shukurova@cececo.org",
      group: "leadership",
      status: "active",
      order: 3,
    },
    {
      name: "Ulduz Ibrahimova",
      role: "Finance Manager",
      bio: "Managing CECECO's financial operations and resource planning.",
      photo: "/images/about-2-0-team-2.jpg",
      email: "u.ibrahimova@cececo.org",
      group: "leadership",
      status: "active",
      order: 4,
    },
    {
      name: "Vacant Position",
      role: "Technical Lead",
      bio: "Expertise in renewable energy technologies and regional infrastructure development.",
      photo: null,
      email: null,
      group: "leadership",
      status: "vacant",
      order: 5,
    },
    {
      name: "Vacant Position",
      role: "Policy Advisor",
      bio: "Strategic thinker focused on sustainable energy transitions and international cooperation.",
      photo: null,
      email: null,
      group: "leadership",
      status: "vacant",
      order: 6,
    },
    {
      name: "Vacant Position",
      role: "Research Director",
      bio: "Specialized in energy efficiency and circular economy innovations.",
      photo: null,
      email: null,
      group: "leadership",
      status: "vacant",
      order: 7,
    },
    {
      name: "Vacant Position",
      role: "Partnerships Manager",
      bio: "Expert in building strategic collaborations across international energy networks.",
      photo: null,
      email: null,
      group: "leadership",
      status: "vacant",
      order: 8,
    },
    {
      name: "Vacant Position",
      role: "Energy Analyst",
      bio: "Comprehensive research skills for emerging renewable energy technologies and market trends.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 1,
    },
    {
      name: "Vacant Position",
      role: "Climate Specialist",
      bio: "Deep knowledge of regional climate adaptation and mitigation strategies.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 2,
    },
    {
      name: "Vacant Position",
      role: "Technology Coordinator",
      bio: "Expertise in managing complex clean energy technology implementation projects.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 3,
    },
    {
      name: "Vacant Position",
      role: "Regional Integration Expert",
      bio: "Skilled in developing cross-border energy collaboration frameworks.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 4,
    },
    {
      name: "Vacant Position",
      role: "Capacity Building Specialist",
      bio: "Focused on training and empowering local energy sector professionals.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 5,
    },
    {
      name: "Vacant Position",
      role: "Innovation Strategist",
      bio: "Driving technological breakthroughs in sustainable energy solutions.",
      photo: null,
      email: null,
      group: "technical",
      status: "vacant",
      order: 6,
    },
  ]);

  console.log("Seeding contact methods...");
  await db.delete(contactMethod);
  await db.insert(contactMethod).values([
    {
      type: "email",
      title: "Email",
      description: "Reach out with questions or partnership inquiries",
      value: "secretariat@cececo.org",
      order: 1,
    },
    {
      type: "phone",
      title: "Phone",
      description: "Connect directly with our team during business hours",
      value: "+994 12 497 2020",
      order: 2,
    },
    {
      type: "office",
      title: "Office",
      description: "Visit us in the heart of the ECO region",
      value: "Baku, Azerbaijan",
      order: 3,
    },
  ]);

  console.log("Seeding member states (signatory states) + partners...");
  await db.delete(memberState);
  await db.insert(memberState).values([
    {
      name: "Azerbaijan",
      flagImage: "/images/home-logo-list-section-0.png",
      isSignatory: true,
      order: 1,
    },
    {
      name: "Kazakhstan",
      flagImage: "/images/home-2-0-logo-list-section-0.png",
      isSignatory: true,
      order: 2,
    },
    {
      name: "Kyrgyz Republic",
      flagImage: "/images/home-logo-list-section-1.png",
      isSignatory: true,
      order: 3,
    },
    {
      name: "Pakistan",
      flagImage: "/images/home-logo-list-section-2.png",
      isSignatory: true,
      order: 4,
    },
    {
      name: "Türkiye",
      flagImage: "/images/home-2-0-logo-list-section-1.png",
      isSignatory: true,
      order: 5,
    },
    {
      name: "Uzbekistan",
      flagImage: "/images/home-2-0-logo-list-section-2.png",
      isSignatory: true,
      order: 6,
    },
  ]);

  await db.delete(partner);
  await db.insert(partner).values([
    {
      name: "GN-SEC",
      logoImage: "/images/home-logo-list-section-3.png",
      order: 1,
    },
    {
      name: "UNIDO",
      logoImage: "/images/home-2-0-logo-list-section-3.png",
      order: 2,
    },
    {
      name: "European Union",
      logoImage: "/images/home-2-0-logo-list-section-4.jpg",
      order: 3,
    },
  ]);

  console.log(
    "Seeding home page + sections (hero carousel is a separate table, not a section)...",
  );
  await resetPage("home");

  const [homePage] = await db
    .insert(page)
    .values({ slug: "home", title: "Home", status: "published" })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: homePage.id,
      componentKey: "countries-carousel",
      scheme: "scheme-1",
      order: 1,
      eyebrow: "CECECO Countries",
      heading: "Explore Our Signatory Countries",
      subtitle: p(
        "Discover the clean energy landscape across each of CECECO's founding member states.",
      ),
    },
    {
      pageId: homePage.id,
      componentKey: "blog-list",
      scheme: "scheme-4",
      order: 2,
      eyebrow: "News",
      heading: "Latest Insights and Updates",
      subtitle: p("Explore our latest thoughts on clean energy initiatives."),
      ctaPrimaryLabel: "See more",
      ctaPrimaryHref: "/news",
    },
    {
      pageId: homePage.id,
      componentKey: "contact-methods",
      scheme: "scheme-2",
      order: 3,
      eyebrow: "Connect",
      heading: "Get in touch",
      subtitle: p("We're here to discuss partnerships and opportunities."),
    },
    {
      pageId: homePage.id,
      componentKey: "newsletter-cta",
      scheme: "scheme-3",
      order: 4,
      heading: "Stay informed on CECECO",
      subtitle: p(
        "Receive updates on regional initiatives, policy developments, news and events, and partnership opportunities.",
      ),
      disclaimer:
        "By subscribing, you agree to receive communications about CECECO's work and mission.",
    },
  ]);

  console.log("Seeding about page + sections...");
  await resetPage("about");

  const [aboutPage] = await db
    .insert(page)
    .values({ slug: "about", title: "About", status: "published" })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: aboutPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "About CECECO",
      subtitle: p(
        "Clean energy catalyst driving sustainable transformation across the Economic Cooperation Organisation region",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: aboutPage.id,
      componentKey: "origin",
      scheme: "scheme-6",
      order: 2,
      eyebrow: "Origin",
      heading: "Collaborative journey of clean energy development",
      subtitle: p(
        "Emerging from intensive consultations between 2020 and 2025, CECECO was strategically established during the ECO COM meeting in Ashgabat. The centre stands poised to play a pivotal role in the upcoming COP29 discussions.",
      ),
      backgroundImage: "/images/home-2-0-gallery-section-0.png",
      ctaPrimaryLabel: "Explore",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Learn",
      ctaSecondaryHref: "/about",
    },
    {
      pageId: aboutPage.id,
      componentKey: "purpose",
      scheme: "scheme-2",
      order: 3,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/eco.svg",
      eyebrow: "Purpose",
      heading: "Accelerating clean energy transition in the ECO region",
      subtitle: p(
        "We drive sustainable economic development through renewable energy solutions. Our approach integrates efficiency, circular economy principles, and industrial competitiveness to transform regional energy landscapes.",
      ),
      backgroundImage: "/images/home-2-0-gallery-section-1.png",
      ctaPrimaryLabel: "Discover",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Connect",
      ctaSecondaryHref: "/partners",
    },
  ]);

  console.log("Seeding about objectives-tabs objectives...");
  const [objectivesSection] = await db
    .insert(section)
    .values({
      pageId: aboutPage.id,
      componentKey: "objectives-tabs",
      scheme: "scheme-2",
      order: 4,
      eyebrow: "Focus",
      heading: "Strategic objectives for regional energy transformation",
      subtitle: p(
        "Our comprehensive strategy targets holistic energy development across the Economic Cooperation Organisation region.",
      ),
    })
    .$returningId();

  await db.insert(sectionTab).values([
    {
      sectionId: objectivesSection.id,
      order: 1,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/overview.svg",
      tabLabel: "Regional projects",
      title: "Regional projects overview",
      body: p(
        "Developing collaborative initiatives that scale renewable energy solutions across multiple countries.",
      ),
      ctaPrimaryLabel: "Explore",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Learn",
      ctaSecondaryHref: "/our-work",
    },
    {
      sectionId: objectivesSection.id,
      order: 2,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/strategy.svg",
      tabLabel: "Energy access",
      title: "Energy access strategies",
      body: p(
        "Creating pathways for universal energy availability in underserved communities.",
      ),
      ctaPrimaryLabel: "Discover",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Connect",
      ctaSecondaryHref: "/partners",
    },
    {
      sectionId: objectivesSection.id,
      order: 3,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/biotech.svg",
      tabLabel: "Technology innovation",
      title: "Technology innovation",
      body: p(
        "Advancing cutting-edge renewable technologies tailored to regional economic contexts.",
      ),
      ctaPrimaryLabel: "Research",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Engage",
      ctaSecondaryHref: "/partners",
    },
    {
      sectionId: objectivesSection.id,
      order: 4,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/local_activity.svg",
      tabLabel: "Capacity building",
      title: "Capacity building",
      body: p(
        "Empowering local professionals through targeted training and knowledge transfer programs.",
      ),
      ctaPrimaryLabel: "Learn",
      ctaPrimaryHref: "/team",
      ctaSecondaryLabel: "Join",
      ctaSecondaryHref: "/team",
    },
    {
      sectionId: objectivesSection.id,
      order: 5,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/policy.svg",
      tabLabel: "Policy integration",
      title: "Policy integration",
      body: p(
        "Developing harmonized regulatory frameworks to support sustainable energy transitions.",
      ),
      ctaPrimaryLabel: "Analyze",
      ctaPrimaryHref: "/our-work",
      ctaSecondaryLabel: "Collaborate",
      ctaSecondaryHref: "/partners",
    },
    {
      sectionId: objectivesSection.id,
      order: 6,
      icon: "https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@latest/rounded/eco.svg",
      tabLabel: "Sustainable markets",
      title: "Sustainable markets",
      body: p(
        "Creating economic opportunities through strategic investments in clean energy infrastructure.",
      ),
      ctaPrimaryLabel: "Invest",
      ctaPrimaryHref: "/partners",
      ctaSecondaryLabel: "Partner",
      ctaSecondaryHref: "/partners",
    },
  ]);

  console.log("Seeding team page + sections...");
  await resetPage("team");

  const [teamPage] = await db
    .insert(page)
    .values({ slug: "team", title: "Team", status: "published" })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: teamPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Driving clean energy forward",
      subtitle: p(
        "Our team leads the transformation of regional energy landscapes with expertise and commitment.",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: teamPage.id,
      componentKey: "leadership-team",
      scheme: "scheme-6",
      order: 2,
      eyebrow: "Leadership",
      heading: "Our team",
      subtitle: p(
        "Experts driving sustainable energy solutions across the ECO region",
      ),
      secondaryHeading: "Join our team",
      secondaryBody: p(
        "Help shape the future of clean energy in the ECO region",
      ),
      closingCtaLabel: "View positions",
      closingCtaHref: "#",
    },
    {
      pageId: teamPage.id,
      componentKey: "technical-team",
      scheme: "scheme-2",
      order: 3,
      eyebrow: "Expertise",
      heading: "Technical experts",
      subtitle: p(
        "Preparing to assemble a world-class team of energy transition specialists",
      ),
      secondaryHeading: "We're expanding",
      secondaryBody: p("Help us build a sustainable energy future"),
      closingCtaLabel: "Apply now",
      closingCtaHref: "#",
    },
  ]);

  console.log("Seeding our-work page + sections...");
  await resetPage("our-work");

  const [workPage] = await db
    .insert(page)
    .values({ slug: "our-work", title: "Our Work", status: "published" })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: workPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Our Work",
      subtitle: p(
        "CECECO drives regional integration through targeted energy programmes that transform economic cooperation across the ECO region.",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: workPage.id,
      componentKey: "outcome-intro",
      scheme: "scheme-2",
      order: 2,
      eyebrow: "Future",
      heading: "Sustainable energy future",
      subtitle: p(
        "Transforming regional energy landscapes through strategic renewable investments.",
      ),
      secondaryEyebrow: "Vision",
      secondaryHeading: "Comprehensive renewable energy strategy",
      secondaryBody: p(
        "We develop integrated approaches to accelerate clean energy adoption across ECO member states. Our strategies target systemic transformation.",
      ),
      backgroundImage: "/images/home-features-list-section-0.png",
      ctaPrimaryLabel: "Learn",
      ctaPrimaryHref: "/about",
      ctaSecondaryLabel: "Explore",
      ctaSecondaryHref: "/partners",
    },
  ]);

  const outcomeFeatures = [
    {
      order: 3,
      eyebrow: "Access",
      heading: "Universal energy access for all communities",
      subtitle: p(
        "We bridge energy gaps in remote and underserved regions. Our programmes ensure inclusive infrastructure development.",
      ),
      backgroundImage: "/images/home-features-list-section-2.png",
      imagePosition: "right" as const,
      ctaPrimaryLabel: "Connect",
      ctaPrimaryHref: "/partners",
      ctaSecondaryLabel: "Discover",
      ctaSecondaryHref: "/about",
      bullets: [
        "Extending grid connectivity to rural areas",
        "Developing decentralized renewable solutions",
        "Supporting community energy initiatives",
      ],
    },
    {
      order: 4,
      eyebrow: "Empower",
      heading: "Capacity building and regional empowerment",
      subtitle: p(
        "We invest in human capital through targeted training and knowledge exchange programmes. Our approach strengthens institutional capabilities.",
      ),
      backgroundImage: "/images/home-2-0-features-list-section-0.png",
      imagePosition: "left" as const,
      ctaPrimaryLabel: "Engage",
      ctaPrimaryHref: "/team",
      ctaSecondaryLabel: "Learn",
      ctaSecondaryHref: "/team",
      bullets: [
        "Professional development workshops",
        "Technical skills training programmes",
        "Leadership development initiatives",
      ],
    },
    {
      order: 5,
      eyebrow: "Innovate",
      heading: "Driving technological innovation in clean energy",
      subtitle: p(
        "We support research and development of breakthrough technologies. Our focus accelerates the transition to sustainable energy solutions.",
      ),
      backgroundImage: "/images/home-2-0-features-list-section-1.png",
      imagePosition: "right" as const,
      ctaPrimaryLabel: "Explore",
      ctaPrimaryHref: "/about",
      ctaSecondaryLabel: "Discover",
      ctaSecondaryHref: "/about",
      bullets: [
        "Advanced renewable technology research",
        "Collaborative innovation platforms",
        "Emerging technology incubation",
      ],
    },
    {
      order: 6,
      eyebrow: "Connect",
      heading: "Advocacy and regional cooperation framework",
      subtitle: p(
        "We build strategic partnerships that drive collaborative energy transitions. Our network connects governments, institutions, and stakeholders.",
      ),
      backgroundImage: "/images/home-2-0-features-list-section-2.png",
      imagePosition: "left" as const,
      ctaPrimaryLabel: "Engage",
      ctaPrimaryHref: "/partners",
      ctaSecondaryLabel: "Collaborate",
      ctaSecondaryHref: "/partners",
      bullets: [] as string[],
    },
  ];

  for (const feature of outcomeFeatures) {
    const { bullets, ...fields } = feature;
    const [row] = await db
      .insert(section)
      .values({
        pageId: workPage.id,
        componentKey: "outcome-feature",
        scheme: "scheme-2",
        ...fields,
      })
      .$returningId();
    if (bullets.length > 0) {
      await db
        .insert(sectionBullet)
        .values(
          bullets.map((text, i) => ({ sectionId: row.id, text, order: i + 1 })),
        );
    }
  }

  console.log("Seeding signatory-countries page + sections...");
  await resetPage("signatory-countries");

  const [signatoryPage] = await db
    .insert(page)
    .values({
      slug: "signatory-countries",
      title: "Signatory Countries",
      status: "published",
    })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: signatoryPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Signatory Countries",
      subtitle: p(
        "The founding signatory states driving CECECO's mandate across the ECO region.",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: signatoryPage.id,
      componentKey: "member-states-grid",
      scheme: "scheme-2",
      order: 2,
      eyebrow: "Signatories",
      heading: "CECECO Signatory States",
      subtitle: p(
        "The founding signatory states driving CECECO's mandate across the region.",
      ),
    },
  ]);

  console.log("Seeding partners page + sections...");
  await resetPage("partners");

  const [partnersPage] = await db
    .insert(page)
    .values({
      slug: "partners",
      title: "Partners & Member States",
      status: "published",
    })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: partnersPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Partners & Member States",
      subtitle: p(
        "CECECO's impact is built on strong partnerships — with ECO member states, international organisations, and technical institutions working toward a shared clean energy future.",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: partnersPage.id,
      componentKey: "member-states-grid",
      scheme: "scheme-2",
      order: 2,
      eyebrow: "Signatories",
      heading: "CECECO Signatory States",
      subtitle: p(
        "The founding signatory states driving CECECO's mandate across the region.",
      ),
    },
    {
      pageId: partnersPage.id,
      componentKey: "partners-grid",
      scheme: "scheme-6",
      order: 3,
      eyebrow: "Collaboration",
      heading: "Our Core Partners",
      subtitle: p(
        "International organisations working alongside CECECO to accelerate the clean energy transition.",
      ),
    },
  ]);

  console.log("Seeding vision-and-mission page + sections...");
  await resetPage("vision-and-mission");

  const [visionPage] = await db
    .insert(page)
    .values({
      slug: "vision-and-mission",
      title: "Vision and Mission",
      status: "published",
    })
    .$returningId();

  await db.insert(section).values([
    {
      pageId: visionPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Vision and Mission",
      subtitle: p(
        "The principles and long-term goals guiding CECECO's work across the ECO region.",
      ),
      backgroundImage: "/images/about-2-0-header-section.png",
    },
    {
      pageId: visionPage.id,
      componentKey: "content-block",
      scheme: "scheme-2",
      order: 2,
      eyebrow: "Vision",
      heading: "A shared clean energy future for the ECO region",
      subtitle: p(
        "CECECO envisions an ECO region powered by clean, affordable, and secure energy — where regional cooperation accelerates the transition faster than any member state could achieve alone.",
      ),
      backgroundImage: "/images/home-2-0-about-section.png",
    },
    {
      pageId: visionPage.id,
      componentKey: "content-block",
      scheme: "scheme-6",
      order: 3,
      eyebrow: "Mission",
      heading: "Our mission",
      subtitle: p(
        "To accelerate the clean energy and climate transition across the ECO region by advancing renewable energy, energy efficiency, and circular economy practices — reducing environmental externalities while promoting sustainable industrialisation and regional cooperation.",
      ),
      backgroundImage: "/images/home-2-0-gallery-section-1.png",
    },
  ]);

  console.log(
    "Seeding legal pages (privacy-policy, terms-of-service, cookie-settings)...",
  );
  function h(text: string) {
    return `<p><strong>${text}</strong></p>`;
  }
  function ul(items: string[]) {
    return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  }
  const legalContact = p(
    "If you have questions about this policy, contact the CECECO Secretariat at " +
      "secretariat@cececo.org, by phone at +994 12 526 48 73, or by post at 29 Gurban Abbasov Street, Baku, Azerbaijan.",
  );

  for (const slug of ["privacy-policy", "terms-of-service", "cookie-settings"])
    await resetPage(slug);

  const [privacyPage] = await db
    .insert(page)
    .values({
      slug: "privacy-policy",
      title: "Privacy Policy",
      status: "published",
    })
    .$returningId();
  await db.insert(section).values([
    {
      pageId: privacyPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Privacy Policy",
      subtitle: p(
        "How CECECO collects, uses, and protects information on this website.",
      ),
    },
    {
      pageId: privacyPage.id,
      componentKey: "legal-content",
      scheme: "scheme-2",
      order: 2,
      subtitle: [
        h("1. Introduction"),
        p(
          "The Clean Energy Centre for the ECO Region (CECECO) respects your privacy and is committed to protecting the personal data of visitors to this website. This Privacy Policy explains what information we collect, how we use it, and the choices you have.",
        ),
        h("2. Information We Collect"),
        p("We collect information in the following ways:"),
        ul([
          "Information you provide directly — such as your name, email address, and organisation, when you subscribe to our newsletter, submit a contact form, or apply for an opportunity listed on this site.",
          "Information collected automatically — such as your IP address, browser type, pages visited, and time spent on the site, gathered through cookies and similar technologies (see our Cookie Settings page).",
        ]),
        h("3. How We Use Your Information"),
        p("We use the information we collect to:"),
        ul([
          "Respond to enquiries submitted through the Contact page.",
          "Send newsletters and updates to subscribers who have opted in.",
          "Process applications submitted through the Work With Us section.",
          "Improve the content, usability, and performance of this website.",
        ]),
        h("4. Cookies and Tracking"),
        p(
          "This website uses cookies to operate correctly and to understand how visitors use our content. You can control cookie preferences at any time — see our Cookie Settings page for details.",
        ),
        h("5. Data Sharing and Disclosure"),
        p(
          "CECECO does not sell or rent personal data to third parties. Information may be shared with service providers who support the operation of this website (for example, hosting and email delivery), under obligations of confidentiality, or where required by law.",
        ),
        h("6. Data Retention"),
        p(
          "We retain personal data only for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law.",
        ),
        h("7. Your Rights"),
        p(
          "You may request access to, correction of, or deletion of your personal data, and you may withdraw consent to marketing communications (such as the newsletter) at any time by contacting us using the details below.",
        ),
        h("8. Data Security"),
        p(
          "We apply reasonable technical and organisational measures to protect personal data against unauthorised access, loss, or misuse.",
        ),
        h("9. Changes to This Policy"),
        p(
          "We may update this Privacy Policy from time to time. Material changes will be reflected by an updated revision date on this page.",
        ),
        h("10. Contact Us"),
        legalContact,
      ].join(""),
    },
  ]);

  const [termsPage] = await db
    .insert(page)
    .values({
      slug: "terms-of-service",
      title: "Terms of Service",
      status: "published",
    })
    .$returningId();
  await db.insert(section).values([
    {
      pageId: termsPage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Terms of Service",
      subtitle: p(
        "The terms and conditions governing use of the CECECO website.",
      ),
    },
    {
      pageId: termsPage.id,
      componentKey: "legal-content",
      scheme: "scheme-2",
      order: 2,
      subtitle: [
        h("1. Acceptance of Terms"),
        p(
          "By accessing or using the CECECO website (cececo.org), you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use this website.",
        ),
        h("2. Use of This Website"),
        p(
          "This website provides information about CECECO's mandate, projects, publications, and opportunities across the ECO region. You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of, this website by any third party.",
        ),
        h("3. Intellectual Property"),
        p(
          "Unless otherwise stated, all content on this website — including text, graphics, logos, and publications — is the property of CECECO or its content partners and is protected by applicable intellectual property laws. Publications and reports made available for download may be used for non-commercial, informational purposes with appropriate attribution to CECECO.",
        ),
        h("4. User Contributions"),
        p(
          "Where this website allows you to submit information (such as through the Contact form, newsletter subscription, or an application under Work With Us), you confirm that the information you provide is accurate and that you have the right to submit it.",
        ),
        h("5. Links to Third-Party Sites"),
        p(
          "This website may contain links to third-party websites, including partner organisations. CECECO is not responsible for the content, accuracy, or practices of any linked third-party site.",
        ),
        h("6. Disclaimer of Warranties"),
        p(
          'This website and its content are provided on an "as is" and "as available" basis. While CECECO makes reasonable efforts to keep information accurate and up to date, we make no warranties, express or implied, regarding the completeness or reliability of any content on this site.',
        ),
        h("7. Limitation of Liability"),
        p(
          "To the fullest extent permitted by applicable law, CECECO shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, this website.",
        ),
        h("8. Governing Law"),
        p(
          "These Terms of Service are governed by the laws applicable in the Republic of Azerbaijan, where the CECECO Secretariat is headquartered.",
        ),
        h("9. Changes to These Terms"),
        p(
          "CECECO may update these Terms of Service from time to time. Continued use of this website after changes are posted constitutes acceptance of the revised terms.",
        ),
        h("10. Contact Us"),
        legalContact,
      ].join(""),
    },
  ]);

  const [cookiePage] = await db
    .insert(page)
    .values({
      slug: "cookie-settings",
      title: "Cookie Settings",
      status: "published",
    })
    .$returningId();
  await db.insert(section).values([
    {
      pageId: cookiePage.id,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 1,
      heading: "Cookie Settings",
      subtitle: p(
        "How CECECO uses cookies on this website and how to manage your preferences.",
      ),
    },
    {
      pageId: cookiePage.id,
      componentKey: "legal-content",
      scheme: "scheme-2",
      order: 2,
      subtitle: [
        h("1. What Are Cookies"),
        p(
          "Cookies are small text files placed on your device when you visit a website. They help the website function properly and allow us to understand how visitors interact with our content.",
        ),
        h("2. How We Use Cookies"),
        p("CECECO uses cookies for the following purposes:"),
        ul([
          "To ensure the website functions correctly across sessions and devices.",
          "To understand aggregate visitor behaviour, so we can improve the site's content and structure.",
          "To remember your cookie preferences so we don't ask again on every visit.",
        ]),
        h("3. Types of Cookies We Use"),
        ul([
          "Essential cookies — required for the website's core functionality (such as navigation and form submission). These cannot be disabled.",
          "Analytics cookies — help us understand how visitors use the site, so we can improve it over time.",
          "Preference cookies — remember choices you've made, such as your cookie consent selection.",
        ]),
        h("4. Managing Your Cookie Preferences"),
        p(
          "Most web browsers allow you to control cookies through their settings, including blocking or deleting cookies already stored on your device. Note that disabling essential cookies may affect the functionality of this website.",
        ),
        h("5. Third-Party Cookies"),
        p(
          "Where this website embeds third-party content (such as a map on the Contact page), those third parties may set their own cookies in accordance with their own policies. CECECO does not control these cookies.",
        ),
        h("6. Changes to This Policy"),
        p(
          "We may update this Cookie Settings page from time to time to reflect changes in the cookies we use or for operational, legal, or regulatory reasons.",
        ),
        h("7. Contact Us"),
        legalContact,
      ].join(""),
    },
  ]);

  console.log("Seeding resources (opportunities, publications, misc)...");
  await db.delete(opportunity);
  await db.insert(opportunity).values([
    {
      slug: "regional-energy-policy-analyst",
      title: "Regional Energy Policy Analyst",
      excerpt:
        "CECECO is seeking a Regional Energy Policy Analyst to support policy harmonisation efforts across ECO member states.",
      description: p(
        "CECECO is seeking a Regional Energy Policy Analyst to support policy harmonisation efforts across ECO member states. Fluency in English is required; regional language skills are an asset.",
      ),
      category: "vacancy",
      deadline: new Date("2026-10-15"),
      applyUrl: "mailto:secretariat@cececo.org",
      status: "active",
    },
    {
      slug: "clean-energy-innovation-grant-2026",
      title: "Clean Energy Innovation Grant 2026",
      excerpt:
        "A regional grant programme supporting early-stage clean energy technology pilots in ECO member states.",
      description: p(
        "A regional grant programme supporting early-stage clean energy technology pilots in ECO member states. Grants of up to $50,000 are available for qualifying projects.",
      ),
      category: "other",
      deadline: new Date("2026-11-30"),
      applyUrl: "mailto:secretariat@cececo.org",
      status: "active",
    },
    {
      slug: "baku-office-renovation-tender",
      title: "Baku Office Renovation Tender",
      excerpt:
        "Tender for renovation and fit-out works at the CECECO secretariat office in Baku, Azerbaijan.",
      description: p(
        "Tender for renovation and fit-out works at the CECECO secretariat office in Baku, Azerbaijan.",
      ),
      category: "other",
      deadline: new Date("2026-05-01"),
      applyUrl: "mailto:secretariat@cececo.org",
      status: "closed",
    },
  ]);

  await db.delete(publication);
  await db.insert(publication).values([
    {
      slug: "regional-energy-outlook-2026",
      title: "Regional Energy Outlook 2026",
      excerpt:
        "An annual overview of energy trends, investment, and policy across the ECO region.",
      body: p(
        "This report examines the state of clean energy transition across ECO member states, highlighting investment trends, policy developments, and regional cooperation opportunities for the year ahead.",
      ),
      coverImage: "/images/home-2-0-blog-list-section-0.jpg",
      category: "Report",
      status: "published",
      publishedAt: new Date("2026-07-01"),
    },
    {
      slug: "renewable-integration-case-studies",
      title: "Renewable Integration: Case Studies from the ECO Region",
      excerpt:
        "A collection of case studies on successful renewable energy grid integration projects.",
      body: p(
        "Drawing on pilot projects across member states, this publication documents lessons learned in integrating variable renewable generation into national grids.",
      ),
      coverImage: "/images/home-2-0-blog-list-section-1.jpg",
      category: "Research",
      status: "published",
      publishedAt: new Date("2026-05-20"),
    },
  ]);

  await db.delete(miscResource);
  await db.insert(miscResource).values([
    {
      title: "ECO Secretariat",
      description: "Official website of the Economic Cooperation Organization.",
      link: "https://www.eco.int",
      order: 1,
    },
    {
      title: "UNIDO Energy Programmes",
      description:
        "United Nations Industrial Development Organization's clean energy initiatives.",
      link: "https://www.unido.org",
      order: 2,
    },
    {
      title: "Contact the Secretariat",
      description:
        "Get in touch with the CECECO secretariat for partnership or media inquiries.",
      link: "/about",
      order: 3,
    },
  ]);

  console.log(
    "Done — home (hero carousel + countries carousel + news + get in touch + stay informed), about (4 sections + objectives), team (3 sections), our-work (6 sections + bullets), partners (3 sections), vision-and-mission (3 sections), privacy-policy/terms-of-service/cookie-settings (2 sections each), and resources (opportunities/publications/misc) fully seeded.",
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
