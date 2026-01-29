# 🚀 andyd-webapp-starter - Modern Next.js 15 Template

A production-ready, enterprise-grade Next.js 15 template with TypeScript, Tailwind CSS 4, and **shadcn/ui** as the primary UI component system. Built for developers who want to ship fast without compromising on quality.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge)

## ✨ Features

### 🎯 **Core Stack**

- **Next.js 15.5.2** with App Router and Turbopack for blazing-fast builds
- **React 19.1.0** with latest features and improvements
- **TypeScript 5** with strict mode and path aliases
- **Tailwind CSS 4** with the latest CSS features
- **[shadcn/ui](https://ui.shadcn.com)** - Primary UI component system with Radix UI primitives
- **Lucide React** icons for consistent iconography

### 🎨 **shadcn/ui Component System**

This template uses **[shadcn/ui](https://ui.shadcn.com)** as the main UI component library:

- ✅ **15+ Pre-installed Components** - Ready to use out of the box
- ✅ **Copy & Paste Philosophy** - Own your components, customize freely
- ✅ **Radix UI Foundation** - Accessible primitives under the hood
- ✅ **Tailwind Styled** - Fully customizable with utility classes
- ✅ **TypeScript First** - Complete type safety
- ✅ **Dark Mode Built-in** - Seamless theme switching

**Installed Components:**
`accordion`, `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `navigation-menu`, `select`, `sheet`, `sonner`, `textarea`

**Add More Components:**

```bash
npx shadcn@latest add [component-name]
```

Browse all available components at [ui.shadcn.com](https://ui.shadcn.com)

### 🎨 **Design & UX**

- **Dark/Light Mode** with system preference detection
- **Responsive Design** mobile-first approach
- **Custom Animations** with CSS keyframes
- **Accessibility** WCAG compliant components
- **Modern UI** with glassmorphism and gradients

### 🚀 **Performance & SEO**

- **Image Optimization** with Next.js Image component
- **Font Optimization** with local font loading
- **Bundle Analysis** with webpack-bundle-analyzer
- **SEO Ready** with metadata API and sitemap
- **Performance Monitoring** with Core Web Vitals

### 🛠️ **Developer Experience**

- **ESLint** with Next.js and TypeScript rules
- **Prettier** with Tailwind CSS plugin
- **Husky** git hooks for pre-commit checks
- **lint-staged** for staged file processing
- **Playwright** for end-to-end testing

### 📱 **Landing Page Sections**

1. **Hero Section** - Compelling headline with CTA
2. **Features Section** - Icon cards showcasing benefits
3. **How It Works** - 3-step process explanation
4. **Testimonials** - Social proof with ratings
5. **Pricing** - 3-tier pricing structure
6. **FAQ** - Accordion with common questions
7. **CTA Section** - Final call-to-action

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ or **yarn** 1.22+ or **pnpm** 8+
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/andyd/andyd-webapp-starter.git
cd andyd-webapp-starter
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration values.

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
andyd-webapp-starter/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── loading.tsx        # Loading page
│   │   ├── not-found.tsx      # 404 page
│   │   ├── page.tsx           # Home page
│   │   ├── robots.ts          # Robots.txt
│   │   └── sitemap.ts         # Sitemap
│   ├── components/             # Reusable components
│   │   ├── common/            # Common UI components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Landing page sections
│   │   ├── ui/                # shadcn/ui components
│   │   └── index.ts           # Component exports
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   └── constants/             # Application constants
├── public/                    # Static assets
├── tests/                     # Playwright tests
├── .vscode/                   # VS Code settings
├── .husky/                    # Git hooks
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run clean        # Clean build artifacts
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run format:check # Check Prettier formatting
npm run type-check   # Run TypeScript compiler
```

### Testing

```bash
npm run test         # Run Playwright tests
npm run test:ui      # Run tests with UI
npm run test:headed  # Run tests with browser visible
npm run test:debug   # Run tests in debug mode
npm run test:report  # Show test report
```

### Analysis & Optimization

```bash
npm run analyze      # Analyze bundle size
npm run check-all    # Run all checks (lint, format, type-check, test)
npm run fix-all      # Fix all auto-fixable issues
```

## 🎨 Customization

### shadcn/ui Components

All UI components are built with [shadcn/ui](https://ui.shadcn.com) and can be fully customized:

**Add New Components:**

```bash
# Add a specific component
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add toast
npx shadcn@latest add popover
```

**Customize Existing Components:**

- All component source code is in `src/components/ui/`
- Modify styles, behavior, and structure as needed
- Components are yours to own and customize

**Component Documentation:**

- Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) for usage examples
- Each component includes TypeScript types and examples
- Full accessibility with Radix UI primitives

### Colors & Theme

Customize your color palette in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // Customize CSS variables in src/app/globals.css
    },
  },
},
```

**Theme Variables:**
Edit CSS variables in `src/app/globals.css` for both light and dark themes

### Content

- Update landing page content in `src/components/sections/`
- Modify page content in `src/app/`
- Add new pages by creating directories in `src/app/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Netlify

1. Build your project: `npm run build`
2. Deploy the `out` folder to Netlify

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run specific test file
npx playwright test tests/app.spec.ts
```

### Test Structure

- **E2E Tests**: `tests/app.spec.ts`
- **Component Tests**: `tests/components/`
- **API Tests**: `tests/api/`

## 📊 Performance

### Core Web Vitals

- **LCP**: Optimized with Next.js Image component
- **FID**: Minimal JavaScript bundle
- **CLS**: Stable layout with proper sizing

### Bundle Analysis

```bash
npm run analyze
```

This will generate a bundle analysis report to identify optimization opportunities.

## 🔒 Security

### Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: restricted permissions

### Environment Variables

- Never commit `.env.local` to version control
- Use `.env.example` as a template
- Validate environment variables at runtime

## 🌐 SEO & Metadata

### Metadata API

Each page includes comprehensive metadata:

- Title and description
- Open Graph tags
- Twitter Card tags
- Structured data

### Sitemap & Robots

- Dynamic sitemap generation
- SEO-friendly robots.txt
- Automatic meta tag generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Tools & Services

- [Vercel](https://vercel.com) - Hosting and deployment
- [PlanetScale](https://planetscale.com) - Database hosting
- [Upstash](https://upstash.com) - Redis and Kafka
- [Uploadthing](https://uploadthing.com) - File uploads

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Radix UI](https://www.radix-ui.com) for the accessible primitives
- [Lucide](https://lucide.dev) for the beautiful icons

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/andyd/andyd-webapp-starter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/andyd/andyd-webapp-starter/discussions)
- **Email**: hello@andyd.com

---

**Built with ❤️ by Andy Dahley**

_Ready to build something amazing? Start with this template and ship your next project faster than ever!_
