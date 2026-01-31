import Link from "next/link";
import { Metadata } from "next";
import {
  Home,
  Search,
  BarChart3,
  ArrowRight,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Explore the federal budget dashboard to see where your tax dollars go.",
  robots: {
    index: false,
    follow: false,
  },
};

const popularPages = [
  {
    title: "Explore Budget",
    description: "Interactive treemap of federal spending",
    href: "/budget",
    icon: BarChart3,
  },
  {
    title: "Compare Spending",
    description: "See how billions translate to real terms",
    href: "/compare",
    icon: Search,
  },
  {
    title: "About",
    description: "Learn about our data sources",
    href: "/about",
    icon: FileQuestion,
  },
];

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        {/* Illustration/Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* 404 Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Error 404
          </span>
        </div>

        {/* Main Message */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or doesn&apos;t exist.
        </p>

        {/* Primary CTA - Home Link */}
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Popular Pages Section */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-6 text-center text-lg font-semibold text-muted-foreground">
          Popular pages you might find helpful
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {popularPages.map((page) => {
            const Icon = page.icon;
            return (
              <Card
                key={page.href}
                className="group transition-colors hover:border-primary/50"
              >
                <Link href={page.href} className="block h-full">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {page.title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{page.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
