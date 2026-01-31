import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Mail,
  Twitter,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - Federal Budget Dashboard",
  description:
    "Get in touch with the Federal Budget Dashboard team. Report bugs, request features, or send general inquiries.",
  openGraph: {
    title: "Contact - Federal Budget Dashboard",
    description: "Get in touch with the Federal Budget Dashboard team.",
  },
};

const socialLinks = [
  {
    name: "Twitter",
    description: "Follow us for updates and announcements",
    url: "https://twitter.com/budgetdashboard",
    icon: Twitter,
  },
  {
    name: "GitHub",
    description: "Star the repo and follow our progress",
    url: "https://github.com/yourusername/budget-dashboard",
    icon: Github,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Get in Touch
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Have questions, found a bug, or want to suggest a feature? We
              would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Bug Reports */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Github className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Bug Reports</CardTitle>
                <CardDescription>
                  Found something broken? Let us know on GitHub Issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Please include steps to reproduce the issue, your browser, and
                  any relevant screenshots.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://github.com/yourusername/budget-dashboard/issues/new?labels=bug"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report a Bug
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Feature Requests */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <MessageCircle className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Feature Requests</CardTitle>
                <CardDescription>
                  Have an idea to make the dashboard better?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  We welcome suggestions for new comparisons, visualizations, or
                  improvements to existing features.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://github.com/yourusername/budget-dashboard/issues/new?labels=enhancement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request a Feature
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* General Inquiries */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <CardTitle>General Inquiries</CardTitle>
                <CardDescription>
                  Questions, feedback, or just want to say hello?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  For general questions, media inquiries, or partnership
                  opportunities.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:contact@budgetdashboard.example">
                    Send Email
                    <Mail className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold">Follow Us</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Stay updated on new features and budget insights
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {socialLinks.map((link) => (
              <Card key={link.name}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <link.icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{link.name}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Follow
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">GitHub Issues</span>
                <span className="font-medium">1-3 business days</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">Email Inquiries</span>
                <span className="font-medium">3-5 business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Security Issues</span>
                <span className="font-medium">Within 24 hours</span>
              </div>
              <p className="text-muted-foreground pt-4 text-center text-sm">
                For security vulnerabilities, please email directly instead of
                opening a public issue.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
