# Setup Instructions

## Prerequisites

### System Requirements

- Node.js 18.0 or later
- npm or yarn package manager
- Git for version control

### Development Tools

- VS Code (recommended)
- Claude Code CLI with agent support

## Quick Start

### 1. Environment Configuration

Copy the environment template:

```bash
cp env.example .env.local
```

Configure your environment variables in `.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="AgentBase Project"

# Authentication (when implemented)
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (when implemented)
DATABASE_URL="postgresql://username:password@localhost:5432/agentbase"

# External Services (optional)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler check

# Testing
npm run test         # Run Playwright tests
npm run test:ui      # Run tests with UI
npm run test:headed  # Run tests in headed mode

# Database (when implemented)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio

# Utilities
npm run check-all    # Run all quality checks
npm run fix-all      # Fix all auto-fixable issues
```

## Project Structure

```
AgentBaseProject/
├── .claude/                 # Claude Code agents
│   └── agents/             # 17 specialized development agents
├── docs/                   # Project documentation
│   ├── setup/             # Setup and configuration
│   ├── development/       # Development guides
│   ├── architecture/      # System architecture
│   ├── agents/            # Agent documentation
│   └── work-logs/         # Progress tracking
├── src/                   # Application source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── providers/    # Context providers
│   ├── lib/               # Utility libraries
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript definitions
│   ├── constants/         # Application constants
│   └── styles/            # Global styles
├── public/                # Static assets
├── tests/                 # Test files
└── [config files]        # Various configuration files
```

## Claude Code Agents

This project includes 17 specialized Claude Code agents:

### Development Specialists

- `frontend-developer` - Frontend components and UI development
- `backend-developer` - Server-side architecture and APIs
- `api-developer` - API design and integration
- `mobile-developer` - iOS and Android app development

### Language Specialists

- `python-developer` - Python frameworks and ecosystem
- `javascript-developer` - Modern JavaScript and Node.js
- `typescript-developer` - Type-safe development patterns
- `php-developer` - PHP frameworks and web development
- `wordpress-developer` - WordPress themes and plugins
- `ios-developer` - Native iOS development with Swift

### Database & Architecture

- `database-designer` - Database design and optimization

### Code Quality & Maintenance

- `code-reviewer` - Code quality assessment and best practices
- `code-debugger` - Bug identification and troubleshooting
- `code-documenter` - Technical documentation creation
- `code-refactor` - Code optimization and restructuring
- `code-security-auditor` - Security vulnerability assessment
- `code-standards-enforcer` - Coding standards and consistency

## Configuration Files

### TypeScript Configuration

- `tsconfig.json` - TypeScript compiler options
- Strict mode enabled with additional safety checks

### ESLint Configuration

- `eslint.config.mjs` - Comprehensive linting rules
- TypeScript, React, and accessibility rules included

### Tailwind CSS

- `tailwind.config.ts` - Tailwind CSS configuration
- Custom design system with CSS variables
- Dark mode support

### Next.js Configuration

- `next.config.js` - Production-ready configuration
- Security headers, image optimization, bundle analysis

## VS Code Configuration

The project includes VS Code settings in `.vscode/`:

- Recommended extensions
- Workspace settings
- Debug configurations

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### Node Modules Issues

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
npm run type-check
```

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Getting Help

1. Check the [work logs](../work-logs/) for recent changes
2. Review [agent documentation](../agents/) for specialized help
3. Consult the [development guide](../development/) for workflows
4. Use Claude Code agents for specific technical assistance

## Next Steps

After completing setup:

1. **Verify Installation**: Test that the development server starts correctly
2. **Explore Components**: Review the component library in `src/components/`
3. **Plan Development**: Use agents to plan your next development steps
4. **Read Documentation**: Familiarize yourself with the project structure

## Environment-Specific Setup

### Development

- Use `.env.local` for local development
- Enable debug logging
- Use development database

### Staging

- Use `.env.staging` for staging environment
- Enable error reporting
- Use staging database

### Production

- Use environment variables or secrets management
- Enable monitoring and logging
- Use production database with proper security
