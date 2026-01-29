import Link from 'next/link';
import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, Home, ArrowLeft, FileText, Users, Mail, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found - 404',
  description:
    "The page you're looking for doesn't exist. Let us help you find what you need.",
  robots: {
    index: false,
    follow: false,
  },
};

const popularPages = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Budget Explorer', href: '/budget', icon: TrendingUp },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] items-center justify-center py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            {/* 404 Number */}
            <div className="space-y-4">
              <h1 className="text-primary/20 text-8xl font-bold sm:text-9xl">
                404
              </h1>
              <h2 className="text-3xl font-bold sm:text-4xl">Page Not Found</h2>
              <p className="text-muted-foreground text-xl">
                Oops! The page you&apos;re looking for doesn&apos;t exist. It
                might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Search */}
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle>Search Our Site</CardTitle>
                <CardDescription>
                  Try searching for what you&apos;re looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input placeholder="Search..." />
                  <Button size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Pages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Popular Pages</h3>
              <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
                {popularPages.map((page) => (
                  <Button key={page.name} variant="outline" asChild>
                    <Link
                      href={page.href}
                      className="flex items-center space-x-2"
                    >
                      <page.icon className="h-4 w-4" />
                      <span>{page.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-muted-foreground mx-auto max-w-md text-sm">
              <p>
                If you believe this is an error, please{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  contact our support team
                </Link>{' '}
                and we&apos;ll help you find what you&apos;re looking for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
