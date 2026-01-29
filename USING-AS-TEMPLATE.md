# 🚀 Using andyd-webapp-starter as a Template

This guide explains how to use this starter template to create new, independent web applications.

## 📋 Table of Contents

- [Quick Start Methods](#quick-start-methods)
- [Recommended Workflow](#recommended-workflow)
- [Customization Checklist](#customization-checklist)
- [File-by-File Guide](#file-by-file-guide)
- [Best Practices](#best-practices)
- [Example Projects](#example-projects)

---

## 🎯 Quick Start Methods

### Method 1: GitHub Template (Recommended)

Once this repo is marked as a template on GitHub:

```bash
# 1. Go to https://github.com/andyd/andyd-webapp-starter
# 2. Click "Use this template" → "Create a new repository"
# 3. Enter your new project name (e.g., "my-saas-app")
# 4. Clone your new repository
git clone https://github.com/YOUR-USERNAME/my-saas-app.git
cd my-saas-app

# 5. Install dependencies
npm install

# 6. Run the customization script (see below)
npm run customize
```

### Method 2: Manual Clone & Customize

```bash
# 1. Clone the template
git clone https://github.com/andyd/andyd-webapp-starter.git my-new-project
cd my-new-project

# 2. Remove existing git history
rm -rf .git

# 3. Initialize new git repository
git init
git add .
git commit -m "Initial commit from andyd-webapp-starter template"

# 4. Install dependencies
npm install

# 5. Follow customization checklist below
```

### Method 3: Using degit (Fast & Clean)

```bash
# Install degit globally (one time)
npm install -g degit

# Create new project from template
degit andyd/andyd-webapp-starter my-new-project
cd my-new-project

# Initialize git
git init
git add .
git commit -m "Initial commit from andyd-webapp-starter template"

# Install dependencies
npm install
```

---

## 🔄 Recommended Workflow

### Step-by-Step Process

```bash
# 1. CREATE NEW PROJECT FROM TEMPLATE
degit andyd/andyd-webapp-starter my-awesome-app
cd my-awesome-app

# 2. INITIALIZE GIT
git init
git add .
git commit -m "Initial commit from andyd-webapp-starter"

# 3. INSTALL DEPENDENCIES
npm install

# 4. CUSTOMIZE PROJECT
# - Update package.json name field
# - Update README.md with your project details
# - Configure environment variables
# - Customize landing page content

# 5. CREATE GITHUB REPO & PUSH
gh repo create my-awesome-app --private --source=. --push

# 6. START DEVELOPING
npm run dev

# 7. BUILD YOUR APP
# - Remove template landing page sections
# - Add your app-specific routes
# - Customize theme and styling
# - Add your business logic
```

---

## ✅ Customization Checklist

### Essential Updates (Do This First)

- [ ] **package.json**
  - [ ] Change `name` to your project name
  - [ ] Update `version` to `0.1.0` or your starting version
  - [ ] Update `description`
  - [ ] Update repository URLs
  - [ ] Update author information

- [ ] **README.md**
  - [ ] Change title to your project name
  - [ ] Rewrite description for your app
  - [ ] Update badges (if applicable)
  - [ ] Replace "Features" section with your app features
  - [ ] Update clone commands
  - [ ] Remove template-specific documentation

- [ ] **Environment Variables**
  - [ ] Copy `env.example` to `.env.local`
  - [ ] Configure your API keys and secrets
  - [ ] Add project-specific variables

- [ ] **Landing Page Content**
  - [ ] Update `src/components/sections/hero-section.tsx`
  - [ ] Customize `src/components/sections/features-section.tsx`
  - [ ] Modify or remove other sections as needed

- [ ] **Metadata & SEO**
  - [ ] Update `src/app/layout.tsx` metadata
  - [ ] Update `src/app/sitemap.ts` URLs
  - [ ] Update `src/app/robots.ts` if needed

- [ ] **Branding**
  - [ ] Replace favicon (`src/app/favicon.ico`)
  - [ ] Update colors in `tailwind.config.ts`
  - [ ] Customize theme in `src/app/globals.css`
  - [ ] Add your logo to `public/`

### Optional Updates

- [ ] **Remove Template Pages** (if you don't need them)
  - [ ] `src/app/about/page.tsx`
  - [ ] `src/app/contact/page.tsx`
  - [ ] `src/components/sections/*` (landing page sections)

- [ ] **Add Your Routes**
  - [ ] Create `src/app/dashboard/` for authenticated area
  - [ ] Add `src/app/api/` routes for backend
  - [ ] Set up authentication pages

- [ ] **Testing**
  - [ ] Update `tests/app.spec.ts` for your app
  - [ ] Remove template-specific tests
  - [ ] Add your own test cases

---

## 📝 File-by-File Customization Guide

### 1. package.json

```json
{
  "name": "my-awesome-app", // ← Change this
  "version": "0.1.0", // ← Reset version
  "description": "My awesome app", // ← Your description
  "author": "Your Name", // ← Add your info
  "repository": {
    "type": "git",
    "url": "https://github.com/you/my-awesome-app" // ← Your repo
  }
}
```

### 2. README.md

Replace the entire README with your project documentation:

```markdown
# My Awesome App

Brief description of what your app does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

[Installation instructions]

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
```

### 3. Environment Variables (.env.local)

```bash
# Copy from template
cp env.example .env.local

# Add your specific variables
NEXT_PUBLIC_APP_NAME="My Awesome App"
NEXT_PUBLIC_APP_URL="https://myawesomeapp.com"

# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
STRIPE_SECRET_KEY="your-stripe-key"
# ... etc
```

### 4. Landing Page Content

**src/components/sections/hero-section.tsx:**

```tsx
<h1>
  Build Your Awesome App
  <span className="...">
    10x Faster
  </span>
</h1>
<p>
  Your unique value proposition here
</p>
```

### 5. Metadata (src/app/layout.tsx)

```typescript
export const metadata: Metadata = {
  title: "My Awesome App",
  description: "Build amazing things faster",
  // ... update all metadata
};
```

### 6. Theme Colors (tailwind.config.ts)

```typescript
colors: {
  primary: {
    DEFAULT: 'hsl(210, 100%, 50%)',  // Your brand color
    foreground: 'hsl(0, 0%, 100%)',
  },
  // ... customize other colors
}
```

### 7. Favicon & Logo

```bash
# Replace these files:
src/app/favicon.ico           # Your favicon
public/logo.svg               # Your logo
public/og-image.png          # Social media preview image
```

---

## 🎯 Best Practices

### 1. Keep Template Updated Locally

Keep the original template as a reference:

```bash
# In your projects parent directory
git clone https://github.com/andyd/andyd-webapp-starter.git _template
cd _template
git remote add upstream https://github.com/andyd/andyd-webapp-starter.git

# Update template periodically
git pull upstream main
```

### 2. Project Organization

```
~/projects/
├── _template/                    # Keep template here
│   └── andyd-webapp-starter/    # Updated template reference
├── my-saas-app/                 # Project 1
├── my-blog/                     # Project 2
└── my-portfolio/                # Project 3
```

### 3. Track Template Version

Add a note to your project's README:

```markdown
## Template Info

Based on [andyd-webapp-starter](https://github.com/andyd/andyd-webapp-starter)

- Template version: 2024-01-04
- Customizations: [list major changes]
```

### 4. Selective Updates

When the template gets updated, selectively merge improvements:

```bash
# Add template as a remote (one time)
git remote add template https://github.com/andyd/andyd-webapp-starter.git
git fetch template

# View what changed
git diff template/main

# Cherry-pick specific commits or files
git checkout template/main -- path/to/file
```

### 5. Clean Unused Code

Remove what you don't need:

```bash
# Remove landing page sections if building a dashboard app
rm -rf src/components/sections/

# Remove example pages
rm -rf src/app/about src/app/contact

# Remove unused UI components
# (Keep what you use, delete the rest from src/components/ui/)
```

---

## 📚 Example Projects from Template

### Example 1: SaaS Dashboard

```bash
# Create project
degit andyd/andyd-webapp-starter my-saas-dashboard
cd my-saas-dashboard

# Remove landing page, add dashboard
rm -rf src/components/sections/
mkdir -p src/app/dashboard

# Add authentication
npm install next-auth
mkdir -p src/app/api/auth/[...nextauth]

# Add database
npm install prisma @prisma/client
npx prisma init
```

### Example 2: Marketing Site

```bash
# Create project
degit andyd/andyd-webapp-starter my-marketing-site
cd my-marketing-site

# Keep landing page sections
# Just customize content in src/components/sections/

# Add blog
mkdir -p src/app/blog
npm install contentlayer next-contentlayer
```

### Example 3: E-commerce Store

```bash
# Create project
degit andyd/andyd-webapp-starter my-store
cd my-store

# Add commerce features
npm install stripe @stripe/stripe-js
mkdir -p src/app/products src/app/cart src/app/checkout

# Add product components
npx shadcn@latest add badge card button
```

---

## 🔧 Automation Script

Create a customization script to automate common changes:

**scripts/customize.js:**

```javascript
#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function customize() {
  // Get project details
  const projectName = await question("Project name: ");
  const description = await question("Description: ");
  const author = await question("Author name: ");

  // Update package.json
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.name = projectName;
  pkg.description = description;
  pkg.author = author;
  pkg.version = "0.1.0";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  console.log("✅ Customization complete!");
  console.log("Next steps:");
  console.log("1. Update README.md");
  console.log("2. Configure .env.local");
  console.log("3. Customize landing page content");
  console.log("4. Run: npm run dev");

  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

customize();
```

Add to package.json:

```json
{
  "scripts": {
    "customize": "node scripts/customize.js"
  }
}
```

Run after cloning:

```bash
npm run customize
```

---

## 🚀 Quick Reference

### Creating a New Project (30 seconds)

```bash
# One command to create and set up
npx degit andyd/andyd-webapp-starter my-app && \
cd my-app && \
git init && \
npm install && \
code .
```

### Essential Files to Update

1. `package.json` - name, description, author
2. `README.md` - project documentation
3. `.env.local` - environment variables
4. `src/app/layout.tsx` - metadata
5. `src/components/sections/hero-section.tsx` - hero content

### Files You Can Safely Delete

- `USING-AS-TEMPLATE.md` (this file)
- `COMPONENTS-QUICK-REF.md` (if you know shadcn/ui)
- `docs/` (if you don't need the docs)
- `tests/app.spec.ts` (replace with your own tests)
- Unused landing page sections in `src/components/sections/`

---

## 💡 Tips

1. **Start Small**: Don't remove everything at once. Build your app incrementally.

2. **Keep shadcn/ui**: The component system is valuable. Keep `src/components/ui/` intact.

3. **Preserve Structure**: Keep the folder structure (`src/app/`, `src/components/`) as it follows Next.js best practices.

4. **Document Changes**: Note what you customized so you can reference it later.

5. **Test Before Deploying**: Run `npm run build` to ensure everything compiles.

6. **Version Control**: Commit often as you customize and build.

---

## 📞 Questions?

- **Template Issues**: [andyd-webapp-starter Issues](https://github.com/andyd/andyd-webapp-starter/issues)
- **Next.js Questions**: [Next.js Docs](https://nextjs.org/docs)
- **shadcn/ui Help**: [shadcn/ui Docs](https://ui.shadcn.com)

---

**Happy Building! 🎉**

Remember: This template is your starting point. Make it your own, remove what you don't need, and build something amazing!
