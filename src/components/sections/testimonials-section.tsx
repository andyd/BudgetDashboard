'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  company?: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    company: 'TechCorp',
    content:
      'This template saved me weeks of setup time. The TypeScript configuration and component structure are exactly what I needed for my project.',
    rating: 5,
    avatar: '/avatars/sarah.jpg',
  },
  {
    name: 'Mike Chen',
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    content:
      "The best Next.js template I've used. Clean, modern, and well-structured. The dark mode implementation is particularly impressive.",
    rating: 5,
    avatar: '/avatars/mike.jpg',
  },
  {
    name: 'Emily Davis',
    role: 'UI/UX Designer',
    company: 'DesignStudio',
    content:
      'Perfect foundation for building beautiful web applications. The shadcn/ui integration makes prototyping so much faster.',
    rating: 5,
    avatar: '/avatars/emily.jpg',
  },
  {
    name: 'Alex Rodriguez',
    role: 'Senior Developer',
    company: 'Enterprise Inc',
    content:
      'Excellent TypeScript setup and modern tooling. This template follows all the best practices I look for in a project.',
    rating: 5,
    avatar: '/avatars/alex.jpg',
  },
  {
    name: 'Lisa Wang',
    role: 'Product Manager',
    company: 'ProductCo',
    content:
      'The responsive design and accessibility features are outstanding. This template is production-ready from day one.',
    rating: 5,
    avatar: '/avatars/lisa.jpg',
  },
  {
    name: 'David Kim',
    role: 'Lead Developer',
    company: 'DevTeam',
    content:
      'Outstanding developer experience with ESLint, Prettier, and Husky. The project structure is scalable and maintainable.',
    rating: 5,
    avatar: '/avatars/david.jpg',
  },
];

export function TestimonialsSection({
  title = 'Loved by Developers',
  subtitle = 'See what developers are saying about this template.',
  testimonials = defaultTestimonials,
  className,
}: TestimonialsSectionProps) {
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                {/* Rating */}
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground truncate text-xs">
                        {testimonial.role}
                      </p>
                      {testimonial.company && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.company}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 inline-flex items-center gap-8 rounded-lg px-8 py-4">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">500+</div>
              <div className="text-muted-foreground text-sm">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">4.9/5</div>
              <div className="text-muted-foreground text-sm">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">100+</div>
              <div className="text-muted-foreground text-sm">Stars</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
