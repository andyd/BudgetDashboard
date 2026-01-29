"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Sparkles,
  Rocket,
  CheckCircle,
  Code,
  Palette,
  Zap,
} from "lucide-react";
import { ComparisonPresets } from "@/components/comparison/ComparisonPresets";

export default function TestPage() {
  const [name, setName] = useState("");
  const [clicks, setClicks] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Hello, ${name || "World"}! 👋`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Hello World! 🎉</h1>
          <p className="text-xl text-muted-foreground">
            Your andyd-webapp-starter is working perfectly!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="default">Next.js 15</Badge>
            <Badge variant="secondary">React 19</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="default">shadcn/ui</Badge>
          </div>
        </div>

        {/* Test Tabs */}
        <Tabs defaultValue="components" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">
              <Palette className="mr-2 h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="interactive">
              <Zap className="mr-2 h-4 w-4" />
              Interactive
            </TabsTrigger>
            <TabsTrigger value="info">
              <Code className="mr-2 h-4 w-4" />
              Info
            </TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Button Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <Rocket className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badge Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Badge Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Form Test */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Form Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Enter your name</Label>
                      <Input
                        id="name"
                        placeholder="Your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Say Hello
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interactive Tab */}
          <TabsContent value="interactive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparison Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Quick-select buttons for common budget comparison scenarios.
                </p>
                <ComparisonPresets
                  onSelect={(config) => {
                    setSelectedPreset(config.name);
                    toast.success(`Selected preset: ${config.name}`);
                  }}
                />
                {selectedPreset && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">
                      Last selected: <span className="text-primary">{selectedPreset}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Counter Test</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-primary">
                    {clicks}
                  </div>
                  <p className="text-muted-foreground">
                    Click the button below
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => setClicks(clicks + 1)} size="lg">
                    Click Me! (+1)
                  </Button>
                  <Button
                    onClick={() => setClicks(0)}
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toast Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 md:grid-cols-2">
                  <Button onClick={() => toast("Default notification")}>
                    Default
                  </Button>
                  <Button onClick={() => toast.success("Success!")}>
                    Success
                  </Button>
                  <Button onClick={() => toast.error("Error occurred")}>
                    Error
                  </Button>
                  <Button onClick={() => toast.info("Info message")}>
                    Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Everything is Working!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">✅ Installed & Working:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Next.js 15.5.2 with Turbopack</li>
                    <li>• React 19.1.0</li>
                    <li>• TypeScript 5</li>
                    <li>• Tailwind CSS 4</li>
                    <li>• shadcn/ui (22 components)</li>
                    <li>• Lucide Icons</li>
                    <li>• Dark/Light Mode</li>
                    <li>• Toast Notifications (Sonner)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">📁 Project Location:</h3>
                  <code className="block rounded bg-muted p-2 text-xs">
                    /Users/andyd/My Drive/CODE
                    PROJECTS/4-Web-App-Frameworks/andyd-webapp-starter
                  </code>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">🔗 Quick Links:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/">Home</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/about">About</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/contact">Contact</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  🚀 Ready to start building your app!
                </p>
                <p className="text-xs text-muted-foreground">
                  See USING-AS-TEMPLATE.md for how to create new projects from
                  this template.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Tips */}
        <div className="mt-12">
          <Card className="mx-auto max-w-4xl border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="mb-3 font-semibold">💡 Quick Tips:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Toggle dark/light mode using the button in the header</li>
                <li>
                  • Try the interactive components in the
                  &ldquo;Interactive&rdquo; tab
                </li>
                <li>
                  • Check out all 22 shadcn/ui components in
                  COMPONENTS-QUICK-REF.md
                </li>
                <li>
                  • Run{" "}
                  <code className="rounded bg-muted px-1">
                    npm run customize
                  </code>{" "}
                  to set up a new project
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
