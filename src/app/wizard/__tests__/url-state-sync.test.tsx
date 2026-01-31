/**
 * URL State Synchronization Tests for WizardClient
 *
 * Tests that verify URL parameters are correctly synced with wizard state:
 * 1. useSearchParams correctly reads URL params
 * 2. updateURL function properly updates the URL
 * 3. Step navigation updates URL correctly
 * 4. Selections are persisted in URL params
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WizardClient } from "../WizardClient";
import type { ReadonlyURLSearchParams } from "next/navigation";

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockSearchParams = new Map<string, string>();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => {
    const params = new URLSearchParams();
    mockSearchParams.forEach((value, key) => {
      params.set(key, value);
    });
    return params as unknown as ReadonlyURLSearchParams;
  },
}));

describe("WizardClient - URL State Synchronization", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockPush.mockClear();
    mockSearchParams.clear();
  });

  describe("Initial URL param reading", () => {
    it("should start at step 1 by default when no URL params", () => {
      render(<WizardClient />);

      // Should show step 1 content
      expect(
        screen.getByText(/What needs more investment?/i),
      ).toBeInTheDocument();
    });

    it("should load step 2 when URL has step=2", async () => {
      mockSearchParams.set("step", "2");
      mockSearchParams.set("priorities", "education");

      render(<WizardClient />);

      await waitFor(() => {
        expect(
          screen.getByText(/What's overfunded or wasteful?/i),
        ).toBeInTheDocument();
      });
    });

    it("should load step 3 when URL has step=3", async () => {
      mockSearchParams.set("step", "3");
      mockSearchParams.set("priorities", "education,healthcare");
      mockSearchParams.set("wasteful", "defense");

      render(<WizardClient />);

      await waitFor(() => {
        expect(
          screen.getByText(/What's your top priority?/i),
        ).toBeInTheDocument();
      });
    });

    it("should load results page when URL has step=results", async () => {
      mockSearchParams.set("step", "results");
      mockSearchParams.set("priorities", "education,healthcare");
      mockSearchParams.set("wasteful", "defense");
      mockSearchParams.set("topPriority", "education");

      render(<WizardClient />);

      await waitFor(() => {
        // Results page should be shown (check for restart button or results content)
        expect(
          screen.getByText(/Restart Wizard/i) ||
            screen.getByText(/Your Personalized/i),
        ).toBeInTheDocument();
      });
    });

    it("should parse comma-separated priorities from URL", async () => {
      mockSearchParams.set("step", "1");
      mockSearchParams.set("priorities", "education,healthcare,veterans");

      render(<WizardClient />);

      await waitFor(() => {
        // Check if the categories are selected (they should have visual indication)
        const educationCard = screen.getByText("Education").closest("button");
        const healthcareCard = screen.getByText("Healthcare").closest("button");
        const veteransCard = screen.getByText("Veterans").closest("button");

        // These should be selected (have specific classes or aria-pressed)
        expect(educationCard).toHaveAttribute("aria-pressed", "true");
        expect(healthcareCard).toHaveAttribute("aria-pressed", "true");
        expect(veteransCard).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should parse comma-separated wasteful categories from URL", async () => {
      mockSearchParams.set("step", "2");
      mockSearchParams.set("priorities", "education");
      mockSearchParams.set("wasteful", "defense,foreign-aid");

      render(<WizardClient />);

      await waitFor(() => {
        const defenseCard = screen
          .getByText("Defense & Military")
          .closest("button");
        const foreignAidCard = screen
          .getByText("Foreign Aid")
          .closest("button");

        expect(defenseCard).toHaveAttribute("aria-pressed", "true");
        expect(foreignAidCard).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should parse topPriority from URL", async () => {
      mockSearchParams.set("step", "3");
      mockSearchParams.set("priorities", "education,healthcare");
      mockSearchParams.set("wasteful", "defense");
      mockSearchParams.set("topPriority", "education");

      render(<WizardClient />);

      await waitFor(() => {
        const educationCard = screen.getByText("Education").closest("button");
        expect(educationCard).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should filter out invalid category IDs from URL", async () => {
      mockSearchParams.set("step", "1");
      mockSearchParams.set(
        "priorities",
        "education,invalid-category,healthcare",
      );

      render(<WizardClient />);

      await waitFor(() => {
        // Only valid categories should be selected
        const educationCard = screen.getByText("Education").closest("button");
        const healthcareCard = screen.getByText("Healthcare").closest("button");

        expect(educationCard).toHaveAttribute("aria-pressed", "true");
        expect(healthcareCard).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should default to step 1 if URL has results but missing required params", async () => {
      mockSearchParams.set("step", "results");
      // Missing priorities, wasteful, and topPriority

      render(<WizardClient />);

      await waitFor(() => {
        // Should show incomplete data message or go to step 1
        expect(
          screen.getByText(/Incomplete Wizard Data/i) ||
            screen.getByText(/What needs more investment?/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("URL updates during navigation", () => {
    it("should update URL when selecting a priority on step 1", async () => {
      const user = userEvent.setup();
      render(<WizardClient />);

      // Click on Education category
      const educationCard = screen.getByText("Education").closest("button");
      await user.click(educationCard!);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("step=1"),
          expect.any(Object),
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("priorities=education"),
          expect.any(Object),
        );
      });
    });

    it("should update URL when deselecting a priority", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");
      mockSearchParams.set("priorities", "education,healthcare");

      render(<WizardClient />);

      // Deselect Education
      const educationCard = screen.getByText("Education").closest("button");
      await user.click(educationCard!);

      await waitFor(() => {
        // URL should be updated without education
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("priorities=healthcare"),
          expect.any(Object),
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.not.stringContaining("education"),
          expect.any(Object),
        );
      });
    });

    it("should update URL when navigating to next step", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");
      mockSearchParams.set("priorities", "education");

      render(<WizardClient />);

      // Click Next button
      const nextButton = screen.getByText(/Next/i);
      await user.click(nextButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("step=2"),
          expect.any(Object),
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("priorities=education"),
          expect.any(Object),
        );
      });
    });

    it("should update URL when navigating back", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "2");
      mockSearchParams.set("priorities", "education");
      mockSearchParams.set("wasteful", "defense");

      render(<WizardClient />);

      // Click Back button
      const backButton = screen.getByText(/Back/i);
      await user.click(backButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("step=1"),
          expect.any(Object),
        );
      });
    });

    it("should preserve all selections in URL during navigation", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "2");
      mockSearchParams.set("priorities", "education,healthcare");
      mockSearchParams.set("wasteful", "defense");

      render(<WizardClient />);

      // Go to next step
      const nextButton = screen.getByText(/Next/i);
      await user.click(nextButton);

      await waitFor(() => {
        const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
        const url = lastCall?.[0];

        expect(url).toContain("step=3");
        expect(url).toContain("priorities=education,healthcare");
        expect(url).toContain("wasteful=defense");
      });
    });
  });

  describe("URL state persistence", () => {
    it("should maintain selections when navigating back and forth", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");

      render(<WizardClient />);

      // Select education
      const educationCard = screen.getByText("Education").closest("button");
      await user.click(educationCard!);

      // Go to step 2
      const nextButton = screen.getByText(/Next/i);
      await user.click(nextButton);

      // Go back to step 1
      await waitFor(() => {
        const backButton = screen.getByText(/Back/i);
        return user.click(backButton);
      });

      // Education should still be selected
      await waitFor(() => {
        const educationCardAgain = screen
          .getByText("Education")
          .closest("button");
        expect(educationCardAgain).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should clear URL params on restart", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "results");
      mockSearchParams.set("priorities", "education");
      mockSearchParams.set("wasteful", "defense");
      mockSearchParams.set("topPriority", "education");

      render(<WizardClient />);

      // Click restart (if on results page)
      await waitFor(async () => {
        const restartButton =
          screen.queryByText(/Restart Wizard/i) ||
          screen.queryByText(/Start the Wizard/i);
        if (restartButton) {
          return user.click(restartButton);
        }
        return Promise.resolve();
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/wizard", undefined);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty priorities param gracefully", async () => {
      mockSearchParams.set("step", "1");
      mockSearchParams.set("priorities", "");

      render(<WizardClient />);

      // Should not crash and show step 1
      expect(
        screen.getByText(/What needs more investment?/i),
      ).toBeInTheDocument();
    });

    it("should handle malformed URL params", async () => {
      mockSearchParams.set("step", "invalid");
      mockSearchParams.set("priorities", "education");

      render(<WizardClient />);

      // Should default to step 1
      expect(
        screen.getByText(/What needs more investment?/i),
      ).toBeInTheDocument();
    });

    it("should not navigate to step 2 without selections", () => {
      mockSearchParams.set("step", "1");

      render(<WizardClient />);

      const nextButton = screen.getByText(/Next/i);

      // Next button should be disabled
      expect(nextButton).toBeDisabled();
    });

    it("should handle scroll: false in router.push", async () => {
      const user = userEvent.setup();
      render(<WizardClient />);

      const educationCard = screen.getByText("Education").closest("button");
      await user.click(educationCard!);

      await waitFor(() => {
        const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
        const options = lastCall?.[1];

        expect(options).toEqual({ scroll: false });
      });
    });
  });

  describe("URL format validation", () => {
    it("should format URL correctly with all params", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");

      render(<WizardClient />);

      // Select multiple priorities
      await user.click(screen.getByText("Education").closest("button")!);
      await user.click(screen.getByText("Healthcare").closest("button")!);

      await waitFor(() => {
        const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
        const url = lastCall?.[0];

        expect(url).toMatch(/^\/wizard\?/);
        expect(url).toContain("step=1");
        expect(url).toContain("priorities=");
      });
    });

    it("should not include empty params in URL", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");

      render(<WizardClient />);

      // Select education only
      await user.click(screen.getByText("Education").closest("button")!);

      await waitFor(() => {
        const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
        const url = lastCall?.[0];

        // Should not have wasteful or topPriority params
        expect(url).not.toContain("wasteful=");
        expect(url).not.toContain("topPriority=");
      });
    });

    it("should use comma-separated values for multi-select params", async () => {
      const user = userEvent.setup();
      mockSearchParams.set("step", "1");

      render(<WizardClient />);

      // Select three priorities
      await user.click(screen.getByText("Education").closest("button")!);
      await user.click(screen.getByText("Healthcare").closest("button")!);
      await user.click(screen.getByText("Veterans").closest("button")!);

      await waitFor(() => {
        const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
        const url = lastCall?.[0];

        // Should have comma-separated priorities
        const match = url.match(/priorities=([^&]+)/);
        expect(match?.[1]).toMatch(
          /education.*healthcare.*veterans|education.*veterans.*healthcare/,
        );
      });
    });
  });
});
