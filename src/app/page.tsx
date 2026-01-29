import { Metadata } from 'next';
import { HomePageClient } from '@/components/home/HomePageClient';
import type { BudgetHierarchy, BudgetItem } from '@/types/budget';
import type { FeaturedComparison } from '@/types/comparison';

export const metadata: Metadata = {
  title: 'Federal Budget Dashboard - Where Your Tax Dollars Go',
  description:
    'Explore US federal spending with interactive visualizations and side-by-side comparisons that translate billions into tangible terms.',
  openGraph: {
    title: 'Federal Budget Dashboard - Where Your Tax Dollars Go',
    description:
      'Explore US federal spending with interactive visualizations and side-by-side comparisons that translate billions into tangible terms.',
    url: 'https://budget-dashboard.vercel.app',
    siteName: 'Federal Budget Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Federal Budget Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federal Budget Dashboard - Where Your Tax Dollars Go',
    description:
      'Explore US federal spending with interactive visualizations and side-by-side comparisons.',
    images: ['/og-image.png'],
  },
  keywords: [
    'federal budget',
    'government spending',
    'tax dollars',
    'budget visualization',
    'federal spending',
    'budget comparison',
    'USAspending',
  ],
  authors: [{ name: 'Federal Budget Dashboard Team' }],
  creator: 'Federal Budget Dashboard',
  publisher: 'Federal Budget Dashboard',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// TODO: Replace with API fetch from /api/budget
const sampleBudgetData: BudgetHierarchy = {
  root: {
    id: 'federal-budget',
    name: 'Federal Budget',
    amount: 6100000000000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 3.2,
  },
  departments: [
    {
      id: 'defense',
      name: 'Defense',
      amount: 820000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 13.4,
      yearOverYearChange: 2.1,
      agencies: [],
    },
    {
      id: 'health-human-services',
      name: 'Health and Human Services',
      amount: 1700000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 27.9,
      yearOverYearChange: 4.5,
      agencies: [],
    },
    {
      id: 'social-security',
      name: 'Social Security Administration',
      amount: 1400000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 23.0,
      yearOverYearChange: 3.8,
      agencies: [],
    },
    {
      id: 'treasury',
      name: 'Department of the Treasury',
      amount: 900000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 14.8,
      yearOverYearChange: 5.2,
      agencies: [],
    },
    {
      id: 'education',
      name: 'Education',
      amount: 80000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 1.3,
      yearOverYearChange: 1.5,
      agencies: [],
    },
    {
      id: 'veterans-affairs',
      name: 'Veterans Affairs',
      amount: 300000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 4.9,
      yearOverYearChange: 6.1,
      agencies: [],
    },
    {
      id: 'homeland-security',
      name: 'Homeland Security',
      amount: 60000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 1.0,
      yearOverYearChange: -0.5,
      agencies: [],
    },
    {
      id: 'other',
      name: 'Other Departments',
      amount: 840000000000,
      parentId: 'federal-budget',
      fiscalYear: 2024,
      percentOfParent: 13.7,
      yearOverYearChange: 2.8,
      agencies: [],
    },
  ],
  totalAmount: 6100000000000,
  fiscalYear: 2024,
};

const sampleBudgetItems: BudgetItem[] = [
  {
    id: 'defense',
    name: 'Defense Department',
    amount: 820000000000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 2.1,
  },
  {
    id: 'ice-detention',
    name: 'ICE Detention Operations',
    amount: 3200000000,
    parentId: 'homeland-security',
    fiscalYear: 2024,
    percentOfParent: 5.3,
    yearOverYearChange: 8.5,
  },
  {
    id: 'f35-program',
    name: 'F-35 Fighter Program',
    amount: 12400000000,
    parentId: 'defense',
    fiscalYear: 2024,
    percentOfParent: 1.5,
    yearOverYearChange: 3.2,
  },
];

const sampleFeaturedComparisons: FeaturedComparison[] = [
  {
    id: '1',
    budgetItemId: 'ice-detention',
    budgetItemName: 'ICE Detention Operations',
    budgetAmount: 3200000000,
    unit: {
      id: 'teacher-salary',
      name: 'Teacher Salaries',
      nameSingular: 'Teacher Salary',
      costPerUnit: 65000,
      category: 'everyday' as const,
      description: 'Average annual teacher salary',
      icon: '👩‍🏫',
    },
    result: {
      unitCount: 49230,
      formatted: '49,230 Teacher Salaries',
      unit: {
        id: 'teacher-salary',
        name: 'Teacher Salaries',
        nameSingular: 'Teacher Salary',
        costPerUnit: 65000,
        category: 'everyday' as const,
      },
      dollarAmount: 3200000000,
    },
    headline: 'ICE Detention = 49,230 Teacher Salaries',
    context:
      'Annual ICE detention operations cost as much as 49,230 teacher salaries for a year',
    source: 'ICE Budget FY2024, BLS Average Salary Data',
    priority: 100,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    budgetItemId: 'f35-program',
    budgetItemName: 'F-35 Fighter Program',
    budgetAmount: 12400000000,
    unit: {
      id: 'school-construction',
      name: 'New Schools',
      nameSingular: 'New School',
      costPerUnit: 35000000,
      category: 'buildings' as const,
      description: 'Cost to build a new public school',
      icon: '🏫',
    },
    result: {
      unitCount: 354,
      formatted: '354 New Schools',
      unit: {
        id: 'school-construction',
        name: 'New Schools',
        nameSingular: 'New School',
        costPerUnit: 35000000,
        category: 'buildings' as const,
      },
      dollarAmount: 12400000000,
    },
    headline: 'F-35 Program = 354 New Schools',
    context:
      'The annual F-35 program budget could build 354 new public schools',
    source: 'DoD Budget FY2024, School Construction Cost Index',
    priority: 90,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export default function HomePage() {
  const currentFiscalYear = 2024;
  const lastUpdated = new Date('2026-01-15');

  return (
    <HomePageClient
      budgetData={sampleBudgetData}
      budgetItems={sampleBudgetItems}
      featuredComparisons={sampleFeaturedComparisons}
      currentFiscalYear={currentFiscalYear}
      lastUpdated={lastUpdated}
    />
  );
}
