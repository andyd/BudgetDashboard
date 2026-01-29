import { MetadataRoute } from 'next';

/**
 * Top-level federal departments for budget drill-down
 * Based on major cabinet departments and independent agencies
 */
const BUDGET_DEPARTMENTS = [
  'defense',
  'hhs', // Health and Human Services
  'treasury',
  'agriculture',
  'transportation',
  'veterans-affairs',
  'education',
  'homeland-security',
  'justice',
  'state',
  'interior',
  'labor',
  'energy',
  'commerce',
  'epa', // Environmental Protection Agency
  'nasa',
  'social-security',
] as const;

/**
 * Featured comparison pages
 * These are curated comparisons that provide meaningful budget context
 */
const FEATURED_COMPARISONS = [
  {
    slug: 'ice-detention-vs-teacher-salaries',
    title: 'ICE Detention vs Teacher Salaries',
  },
  {
    slug: 'defense-spending-vs-education',
    title: 'Defense Spending vs Education Funding',
  },
  {
    slug: 'f35-program-vs-health-insurance',
    title: 'F-35 Program vs Health Insurance Coverage',
  },
  {
    slug: 'border-wall-vs-school-lunches',
    title: 'Border Wall Funding vs School Lunch Program',
  },
  {
    slug: 'medicare-vs-social-security',
    title: 'Medicare vs Social Security Spending',
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://webapp-template.vercel.app';

  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly', // Updates with new budget data
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Top-level budget department pages
  const budgetRoutes: MetadataRoute.Sitemap = BUDGET_DEPARTMENTS.map(
    (dept) => ({
      url: `${baseUrl}/budget/${dept}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const, // Budget data updates regularly
      priority: 0.8,
    })
  );

  // Featured comparison pages
  const comparisonRoutes: MetadataRoute.Sitemap = FEATURED_COMPARISONS.map(
    (comparison) => ({
      url: `${baseUrl}/compare/${comparison.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const, // Comparisons are relatively static
      priority: 0.7,
    })
  );

  // Combine all routes
  return [...staticRoutes, ...budgetRoutes, ...comparisonRoutes];
}
