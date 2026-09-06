import type { MetadataRoute } from "next";
import { getProjects } from "@/db/queries/projects";
import { getAllPublishedBlogPosts } from "@/db/queries/blog";
import { getTeamMembersByGroup } from "@/db/queries/team";
import { getSignatoryStates } from "@/db/queries/partners";
import { getOpportunities, getPublishedPublications } from "@/db/queries/resources";
import { getHeroSlides } from "@/db/queries/hero";

const BASE_URL = "https://cececo.org";

const RESOURCE_CATEGORY_PATH: Record<string, string> = {
  Report: "reports",
  Publication: "publications",
  Document: "documents",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, leadership, technical, countries, opportunities, publications, heroSlides] =
    await Promise.all([
      getProjects(),
      getAllPublishedBlogPosts(),
      getTeamMembersByGroup("leadership"),
      getTeamMembersByGroup("technical"),
      getSignatoryStates(),
      getOpportunities(),
      getPublishedPublications(),
      getHeroSlides(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/vision-and-mission`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/about/signatory-countries`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/news`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/events`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/work-with-us`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resources/reports`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resources/publications`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resources/documents`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/partners`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/news/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const teamRoutes: MetadataRoute.Sitemap = [...leadership, ...technical]
    .filter((m) => m.hasDetailPage && m.slug)
    .map((m) => ({
      url: `${BASE_URL}/team/${m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: "yearly",
      priority: 0.4,
    }));

  const countryRoutes: MetadataRoute.Sitemap = countries
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/countries/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  const opportunityRoutes: MetadataRoute.Sitemap = opportunities
    .filter((o) => o.slug)
    .map((o) => ({
      url: `${BASE_URL}/work-with-us/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const publicationRoutes: MetadataRoute.Sitemap = publications
    .filter((p) => RESOURCE_CATEGORY_PATH[p.category])
    .map((p) => ({
      url: `${BASE_URL}/resources/${RESOURCE_CATEGORY_PATH[p.category]}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  const highlightRoutes: MetadataRoute.Sitemap = heroSlides
    .filter((h) => h.seeMoreEnabled && h.pageSlug)
    .map((h) => ({
      url: `${BASE_URL}/highlights/${h.pageSlug}`,
      lastModified: h.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...newsRoutes,
    ...teamRoutes,
    ...countryRoutes,
    ...opportunityRoutes,
    ...publicationRoutes,
    ...highlightRoutes,
  ];
}
