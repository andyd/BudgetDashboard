"use client";

import * as React from "react";
import { toast } from "sonner";
import { Bell, Mail, TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "budget-notifications";

interface NotificationPreferences {
  featuredComparisons: boolean;
  budgetUpdates: boolean;
  weeklyDigest: boolean;
  email: string;
}

const defaultPreferences: NotificationPreferences = {
  featuredComparisons: false,
  budgetUpdates: false,
  weeklyDigest: false,
  email: "",
};

function loadPreferences(): NotificationPreferences {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultPreferences;
}

function savePreferences(preferences: NotificationPreferences): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function NotificationPreferences() {
  const [preferences, setPreferences] =
    React.useState<NotificationPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load preferences from localStorage on mount
  React.useEffect(() => {
    setPreferences(loadPreferences());
    setIsLoaded(true);
  }, []);

  const handleToggle = (key: keyof Omit<NotificationPreferences, "email">) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
    toast.success("Notification preferences saved", {
      description: "Your preferences have been updated successfully.",
    });
  };

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which updates you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 animate-pulse bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose which updates you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="size-4" />
            Email Address (optional)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={preferences.email}
            onChange={handleEmailChange}
          />
          <p className="text-xs text-muted-foreground">
            We&apos;ll use this to send you notifications. Leave blank to
            disable email notifications.
          </p>
        </div>

        {/* Notification Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="featured-comparisons"
                className="flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp className="size-4" />
                New Featured Comparisons
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified when we publish new featured budget comparisons.
              </p>
            </div>
            <Switch
              id="featured-comparisons"
              checked={preferences.featuredComparisons}
              onCheckedChange={() => handleToggle("featuredComparisons")}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="budget-updates"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Bell className="size-4" />
                Budget Updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive alerts when federal budget data is updated or changes
                significantly.
              </p>
            </div>
            <Switch
              id="budget-updates"
              checked={preferences.budgetUpdates}
              onCheckedChange={() => handleToggle("budgetUpdates")}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="weekly-digest"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="size-4" />
                Weekly Digest
              </Label>
              <p className="text-xs text-muted-foreground">
                A weekly summary of budget highlights and popular comparisons.
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={preferences.weeklyDigest}
              onCheckedChange={() => handleToggle("weeklyDigest")}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
