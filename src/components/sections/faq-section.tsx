'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'What technologies are included in the template?',
    answer:
      "The template includes Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components, ESLint, Prettier, and Husky. It's built with modern best practices and is fully responsive.",
  },
  {
    question: 'Is the template free to use?',
    answer:
      'Yes! The template is completely free and open source. You can use it for personal and commercial projects. We also offer premium plans with additional features and support.',
  },
  {
    question: 'How do I get started with the template?',
    answer:
      'Simply clone the repository from GitHub, install dependencies with npm, and start the development server. The template comes with comprehensive documentation to help you get up and running quickly.',
  },
  {
    question: 'Can I customize the template for my needs?',
    answer:
      'Absolutely! The template is designed to be highly customizable. You can modify colors, fonts, components, and add your own features. The modular structure makes it easy to extend.',
  },
  {
    question: 'Do you provide support for the template?',
    answer:
      'We provide community support through GitHub issues and discussions. For premium users, we offer priority support with faster response times and dedicated assistance.',
  },
  {
    question: 'Is the template production-ready?',
    answer:
      'Yes, the template is production-ready with proper SEO optimization, error handling, loading states, and performance optimizations. It follows industry best practices.',
  },
  {
    question: 'Can I use the template for client projects?',
    answer:
      'Yes, you can use the template for client projects. The free version is licensed under MIT, which allows commercial use. For enterprise clients, we recommend our Pro or Enterprise plans.',
  },
  {
    question: 'How often do you update the template?',
    answer:
      'We regularly update the template with new features, security patches, and improvements. All updates are free for existing users. We typically release major updates every few months.',
  },
];

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about our template and services.',
  faqs = defaultFAQs,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn('py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            {subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Help */}
        <div className="mt-16 space-y-4 text-center">
          <p className="text-muted-foreground">
            Still have questions? We&apos;re here to help!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact Support
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://github.com/andyd/webapp-template/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              GitHub Issues
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/docs"
              className="text-primary font-medium hover:underline"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
