import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressIndicator } from "../ProgressIndicator";

describe("ProgressIndicator", () => {
  it("renders 3 progress dots by default", () => {
    const { container } = render(<ProgressIndicator currentStep={1} />);
    const dots = container.querySelectorAll('[role="progressbar"] > div');
    expect(dots).toHaveLength(3);
  });

  it("highlights the current step", () => {
    const { container } = render(<ProgressIndicator currentStep={2} />);
    const dots = container.querySelectorAll('[role="progressbar"] > div');

    // Step 2 should have the brightest color and scale
    expect(dots[1]?.className).toContain("bg-emerald-500");
    expect(dots[1]?.className).toContain("scale-125");
  });

  it("shows completed steps with different styling", () => {
    const { container } = render(<ProgressIndicator currentStep={3} />);
    const dots = container.querySelectorAll('[role="progressbar"] > div');

    // Steps 1 and 2 should be completed (emerald with opacity)
    expect(dots[0]?.className).toContain("bg-emerald-500/60");
    expect(dots[1]?.className).toContain("bg-emerald-500/60");

    // Step 3 should be current (brightest emerald with scale)
    expect(dots[2]?.className).toContain("bg-emerald-500");
    expect(dots[2]?.className).toContain("scale-125");
  });

  it("shows incomplete steps with muted styling", () => {
    const { container } = render(<ProgressIndicator currentStep={1} />);
    const dots = container.querySelectorAll('[role="progressbar"] > div');

    // Steps 2 and 3 should be incomplete (slate gray)
    expect(dots[1]?.className).toContain("bg-slate-600");
    expect(dots[2]?.className).toContain("bg-slate-600");
  });

  it("displays step label by default", () => {
    render(<ProgressIndicator currentStep={2} />);
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("hides label when showLabel is false", () => {
    render(<ProgressIndicator currentStep={2} showLabel={false} />);
    expect(screen.queryByText("Step 2 of 3")).not.toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<ProgressIndicator currentStep={2} />);
    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "2");
    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "3");
    expect(progressbar).toHaveAttribute(
      "aria-label",
      "Wizard progress: Step 2 of 3",
    );
  });

  it("applies responsive classes for mobile", () => {
    const { container } = render(<ProgressIndicator currentStep={1} />);
    const dots = container.querySelectorAll('[role="progressbar"] > div');

    // Check for responsive sizing classes
    dots.forEach((dot) => {
      expect(dot.className).toMatch(/h-2.*w-2/);
      expect(dot.className).toMatch(/sm:h-2\.5.*sm:w-2\.5/);
    });
  });

  it("supports custom totalSteps", () => {
    const { container } = render(
      <ProgressIndicator currentStep={2} totalSteps={5} />,
    );
    const dots = container.querySelectorAll('[role="progressbar"] > div');
    expect(dots).toHaveLength(5);

    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
  });
});
