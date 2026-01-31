import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryCard } from "../CategoryCard";

describe("CategoryCard", () => {
  const mockOnClick = vi.fn();

  const defaultProps = {
    id: "education",
    name: "Education",
    description: "Schools, teachers, student aid",
    icon: "GraduationCap",
    selected: false,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders with correct name", () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("renders icon component correctly", () => {
    const { container } = render(<CategoryCard {...defaultProps} />);
    // Icon should be rendered as an SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders with HelpCircle icon when icon name is invalid", () => {
    const { container } = render(
      <CategoryCard {...defaultProps} icon="InvalidIcon" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows description on large cards", () => {
    render(<CategoryCard {...defaultProps} size="large" />);
    expect(
      screen.getByText("Schools, teachers, student aid"),
    ).toBeInTheDocument();
  });

  it("hides description on default cards", () => {
    render(<CategoryCard {...defaultProps} size="default" />);
    expect(
      screen.queryByText("Schools, teachers, student aid"),
    ).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(<CategoryCard {...defaultProps} />);
    const button = screen.getByRole("checkbox");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("shows checkmark when selected", () => {
    const { container } = render(
      <CategoryCard {...defaultProps} selected={true} />,
    );
    // Checkmark should be visible - look for the SVG element within the checkmark container
    const svg = container.querySelector('svg[class*="lucide"]');
    expect(svg).toBeInTheDocument();
  });

  it("does not show checkmark when not selected", () => {
    const { container } = render(
      <CategoryCard {...defaultProps} selected={false} />,
    );
    // Checkmark should not be visible
    const checkmarkContainer = container.querySelector('[class*="animate-in"]');
    expect(checkmarkContainer).toBeFalsy();
  });

  it("applies selected styling when selected", () => {
    render(<CategoryCard {...defaultProps} selected={true} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveClass("border-blue-500");
  });

  it("has correct ARIA attributes when selected", () => {
    render(<CategoryCard {...defaultProps} selected={true} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  it("has correct ARIA attributes when not selected", () => {
    render(<CategoryCard {...defaultProps} selected={false} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveAttribute("aria-checked", "false");
  });

  it("does not call onClick when disabled", () => {
    render(<CategoryCard {...defaultProps} disabled={true} />);
    const button = screen.getByRole("checkbox");
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("applies disabled styling", () => {
    render(<CategoryCard {...defaultProps} disabled={true} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("handles keyboard Enter key", () => {
    render(<CategoryCard {...defaultProps} />);
    const button = screen.getByRole("checkbox");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard Space key", () => {
    render(<CategoryCard {...defaultProps} />);
    const button = screen.getByRole("checkbox");
    fireEvent.keyDown(button, { key: " " });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick for disabled card on keyboard input", () => {
    render(<CategoryCard {...defaultProps} disabled={true} />);
    const button = screen.getByRole("checkbox");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has proper tabIndex when not disabled", () => {
    render(<CategoryCard {...defaultProps} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveAttribute("tabIndex", "0");
  });

  it("has negative tabIndex when disabled", () => {
    render(<CategoryCard {...defaultProps} disabled={true} />);
    const button = screen.getByRole("checkbox");
    expect(button).toHaveAttribute("tabIndex", "-1");
  });

  it("renders all valid icon names from wizard categories", () => {
    const iconNames = [
      "GraduationCap",
      "Heart",
      "Medal",
      "Truck",
      "Leaf",
      "Home",
      "FlaskConical",
      "HandHeart",
      "Shield",
      "Globe",
      "Landmark",
      "Wheat",
      "DollarSign",
      "MoreHorizontal",
    ];

    iconNames.forEach((iconName) => {
      const { container, unmount } = render(
        <CategoryCard {...defaultProps} icon={iconName} />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      unmount();
    });
  });
});
