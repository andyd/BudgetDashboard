import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ErrorBoundary } from '@/components/common/error-boundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Federal Budget Dashboard - See Where Your Tax Dollars Go',
    template: '%s | Federal Budget Dashboard',
  },
  description:
    'Explore US federal spending with interactive visualizations and real-world comparisons. Understand where billions of tax dollars go through tangible side-by-side comparisons that make the numbers meaningful.',
  keywords: [
    'federal budget',
    'US spending',
    'tax dollars',
    'government transparency',
    'budget visualization',
    'federal spending',
    'USAspending',
    'budget comparisons',
  ],
  authors: [{ name: 'Budget Dashboard Team' }],
  creator: 'Budget Dashboard',
  publisher: 'Budget Dashboard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Federal Budget Dashboard - See Where Your Tax Dollars Go',
    description:
      'Explore US federal spending with interactive visualizations and real-world comparisons. Understand billions through tangible side-by-side comparisons.',
    siteName: 'Federal Budget Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Federal Budget Dashboard - Interactive spending visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federal Budget Dashboard - See Where Your Tax Dollars Go',
    description:
      'Explore US federal spending with interactive visualizations and real-world comparisons. Understand billions through tangible side-by-side comparisons.',
    images: ['/og-image.png'],
  },
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            {children}
            <ToastProvider />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
