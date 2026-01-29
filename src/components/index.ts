// Layout Components
export { Header } from './layout/header';
export { Navigation } from './layout/navigation';
export { Footer } from './layout/footer';
export { MainLayout } from './layout/main-layout';

// Section Components
export { HeroSection } from './sections/hero-section';
export { FeaturesSection } from './sections/features-section';
export { HowItWorksSection } from './sections/how-it-works-section';
export { TestimonialsSection } from './sections/testimonials-section';
export { PricingSection } from './sections/pricing-section';
export { FAQSection } from './sections/faq-section';
export { CTASection } from './sections/cta-section';

// Common Components
export { ThemeToggle } from './common/theme-toggle';
export { Loading } from './common/loading';
export { ErrorBoundary } from './common/error-boundary';
export { SourceCitation } from './common/SourceCitation';
export {
  EmptyState,
  NoComparisonsEmpty,
  NoSearchResults,
  NoSpotlight,
} from './common/empty-states';
export type { EmptyStateProps } from './common/empty-states';

// Budget Components
export { BudgetTreemapSkeleton } from './budget/BudgetTreemapSkeleton';
export { DrillDownSkeleton } from './budget/DrillDownSkeleton';
export { PercentageBar } from './budget/PercentageBar';
export { DataFreshnessIndicator } from './budget/DataFreshnessIndicator';

// Comparison Components
export { ComparisonBuilder } from './comparison/ComparisonBuilder';
export { ComparisonCardSkeleton } from './comparison/ComparisonCardSkeleton';
export { ComparisonPresets } from './comparison/ComparisonPresets';
export type { PresetConfig } from './comparison/ComparisonPresets';
export { ShareModal } from './comparison/ShareModal';

// Provider Components
export { ThemeProvider } from './providers/theme-provider';
export { ToastProvider } from './providers/toast-provider';

// Re-export shadcn/ui components
export { Button } from './ui/button';
export {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
export { Badge } from './ui/badge';
export { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Textarea } from './ui/textarea';
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
export { Toaster } from './ui/sonner';
