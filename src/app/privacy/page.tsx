import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Database,
  Cookie,
  Eye,
  Lock,
  Mail,
  FileText,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Federal Budget Dashboard. Learn how we protect your privacy with no personal data collection and local-only storage.",
  openGraph: {
    title: "Privacy Policy - Federal Budget Dashboard",
    description:
      "Our commitment to your privacy: no tracking, no cookies, no personal data collection.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground text-xl">
            Your privacy matters. We believe in transparency about how we handle
            your data.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            Last updated: January 30, 2026
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-primary/20 bg-primary/5 mb-12">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold">Privacy at a Glance</h2>
            <ul className="text-muted-foreground grid gap-3 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Lock className="text-primary h-4 w-4 flex-shrink-0" />
                <span>No personal data collection</span>
              </li>
              <li className="flex items-center gap-2">
                <Cookie className="text-primary h-4 w-4 flex-shrink-0" />
                <span>No tracking cookies</span>
              </li>
              <li className="flex items-center gap-2">
                <Eye className="text-primary h-4 w-4 flex-shrink-0" />
                <span>No third-party analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="text-primary h-4 w-4 flex-shrink-0" />
                <span>All preferences stored locally</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
          {/* Introduction */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="text-primary h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Federal Budget Dashboard is a data visualization tool
                  designed to make federal spending information accessible and
                  understandable. We are committed to protecting your privacy
                  and being transparent about our data practices.
                </p>
                <p className="text-muted-foreground">
                  This privacy policy explains what information we collect (or
                  more accurately, what we do not collect), how we use it, and
                  your rights regarding your data.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Information We Do Not Collect */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="text-primary h-5 w-5" />
                  Information We Do Not Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We have designed this application with privacy as a core
                  principle. We do not collect, store, or process any personal
                  information. Specifically:
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>
                    <strong>No account registration required</strong> - You can
                    use all features without creating an account or providing
                    any personal information.
                  </li>
                  <li>
                    <strong>No email addresses</strong> - We do not collect or
                    store email addresses for any purpose.
                  </li>
                  <li>
                    <strong>No tracking cookies</strong> - We do not use cookies
                    to track your behavior or identify you across sessions.
                  </li>
                  <li>
                    <strong>No device fingerprinting</strong> - We do not
                    collect information about your device, browser, or operating
                    system for identification purposes.
                  </li>
                  <li>
                    <strong>No location data</strong> - We do not track or store
                    your geographic location.
                  </li>
                  <li>
                    <strong>No browsing history</strong> - We do not track which
                    pages you visit or how you interact with the site.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Local Storage */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="text-primary h-5 w-5" />
                  Local Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To provide a better user experience, we use your
                  browser&apos;s local storage to save certain preferences. This
                  data is stored only on your device and is never transmitted to
                  our servers.
                </p>
                <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                  <h4 className="font-semibold">What we store locally:</h4>
                  <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                    <li>
                      <strong>Theme preference</strong> - Your choice of light
                      or dark mode (stored as{" "}
                      <code className="bg-muted rounded px-1 text-sm">
                        budget-dashboard-theme
                      </code>
                      )
                    </li>
                    <li>
                      <strong>UI state</strong> - Panel positions, collapsed
                      sections, and other interface preferences
                    </li>
                    <li>
                      <strong>Recent comparisons</strong> - Your recently viewed
                      or created budget comparisons for quick access
                    </li>
                  </ul>
                </div>
                <p className="text-muted-foreground text-sm">
                  You can clear this data at any time by clearing your
                  browser&apos;s local storage or using your browser&apos;s
                  privacy settings. This will reset all preferences to their
                  defaults.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Analytics */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="text-primary h-5 w-5" />
                  Analytics and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We do not use any third-party analytics services such as
                  Google Analytics, Mixpanel, or similar tracking tools. We do
                  not track:
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>Page views or click events</li>
                  <li>Session duration or bounce rates</li>
                  <li>User demographics or interests</li>
                  <li>Referral sources or campaign tracking</li>
                  <li>Conversion funnels or user journeys</li>
                </ul>
                <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
                  <p className="text-sm">
                    <strong>Server logs:</strong> Like most web services, our
                    servers may generate standard access logs that include IP
                    addresses and request timestamps for security and
                    performance monitoring. These logs are automatically deleted
                    after 30 days and are never used for tracking or
                    identification purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Third-Party Services */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We minimize our use of third-party services. The services we
                  do use are:
                </p>
                <div className="space-y-4">
                  <div className="border-primary border-l-4 pl-4">
                    <h4 className="font-semibold">Content Delivery</h4>
                    <p className="text-muted-foreground text-sm">
                      We may use a content delivery network (CDN) to serve
                      static assets like fonts and images. CDN providers may
                      collect minimal technical information required for content
                      delivery but do not track individual users.
                    </p>
                  </div>
                  <div className="border-primary border-l-4 pl-4">
                    <h4 className="font-semibold">Government Data APIs</h4>
                    <p className="text-muted-foreground text-sm">
                      Budget data is fetched from USAspending.gov, a U.S.
                      government website. Your interactions with this data are
                      subject to the{" "}
                      <a
                        href="https://www.usaspending.gov/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        USAspending.gov privacy policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Security */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="text-primary h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Since we do not collect personal data, the primary security
                  concern is protecting the integrity of the budget data we
                  display. We implement the following security measures:
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>
                    All connections are encrypted using HTTPS/TLS to prevent
                    man-in-the-middle attacks
                  </li>
                  <li>
                    Budget data is sourced exclusively from verified government
                    APIs
                  </li>
                  <li>
                    Our application follows security best practices including
                    Content Security Policy headers
                  </li>
                  <li>
                    Regular security updates are applied to all dependencies
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Children&apos;s Privacy */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Children&apos;s Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Federal Budget Dashboard is a public information resource
                  suitable for all ages. Since we do not collect any personal
                  information from any users, we are fully compliant with the
                  Children&apos;s Online Privacy Protection Act (COPPA) and
                  similar regulations.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Your Rights */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Since we do not collect personal data, traditional data
                  subject rights (access, correction, deletion) do not apply.
                  However, you have full control over any data stored locally in
                  your browser:
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>
                    <strong>Clear local storage</strong> - Use your browser
                    settings to delete stored preferences at any time
                  </li>
                  <li>
                    <strong>Use private browsing</strong> - Browse in incognito
                    or private mode to prevent any local storage
                  </li>
                  <li>
                    <strong>Block JavaScript</strong> - The site functions with
                    reduced features without JavaScript
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Changes to This Policy */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time to reflect
                  changes in our practices or for legal, operational, or
                  regulatory reasons. When we make changes:
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                  <li>
                    The &quot;Last updated&quot; date at the top of this page
                    will be revised
                  </li>
                  <li>
                    Material changes will be highlighted for a reasonable period
                  </li>
                  <li>
                    We will continue our commitment to not collecting personal
                    data
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  We encourage you to review this policy periodically to stay
                  informed about how we protect your privacy.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you have any questions or concerns about this privacy
                  policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@budgetdashboard.example"
                      className="text-primary hover:underline"
                    >
                      privacy@budgetdashboard.example
                    </a>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>GitHub:</strong>{" "}
                    <a
                      href="https://github.com/yourusername/budget-dashboard/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open an issue
                    </a>{" "}
                    for privacy-related inquiries
                  </p>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  For more information about how we handle data and our
                  methodology, please see our{" "}
                  <Link href="/about" className="text-primary hover:underline">
                    About page
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/methodology"
                    className="text-primary hover:underline"
                  >
                    Methodology page
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
