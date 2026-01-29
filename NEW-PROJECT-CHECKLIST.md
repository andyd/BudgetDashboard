# ✅ New Project Checklist

Quick checklist for creating a new project from this template.

## 🚀 Initial Setup (5 minutes)

### Step 1: Create Project

```bash
# Option A: Use GitHub Template (Recommended)
# Go to https://github.com/andyd/andyd-webapp-starter
# Click "Use this template" → "Create a new repository"

# Option B: Use degit
npx degit andyd/andyd-webapp-starter my-new-project
cd my-new-project
git init
```

### Step 2: Install & Customize

```bash
# Install dependencies
npm install

# Run customization script
npm run customize

# Follow the prompts to enter:
# - Project name
# - Description
# - Author name
# - GitHub username
```

## 📝 Manual Customization

If you didn't run `npm run customize`, update these files manually:

### Essential Files (Must Update)

- [ ] **package.json**

  ```json
  {
    "name": "my-project-name",
    "version": "0.1.0",
    "description": "My project description",
    "author": "Your Name"
  }
  ```

- [ ] **README.md**
  - Change title
  - Update description
  - Replace features list
  - Update clone commands

- [ ] **.env.local**

  ```bash
  cp env.example .env.local
  # Edit .env.local with your values
  ```

- [ ] **src/app/layout.tsx** (Line 8-20)
  ```typescript
  export const metadata: Metadata = {
    title: "My App Name",
    description: "My app description",
    // ... update all fields
  };
  ```

### Content Customization

- [ ] **Landing Page Hero** - `src/components/sections/hero-section.tsx`
  - Update headline
  - Update subtext
  - Update CTA buttons

- [ ] **Features Section** - `src/components/sections/features-section.tsx`
  - Replace with your app's features

- [ ] **Other Sections** - `src/components/sections/`
  - Customize or remove as needed

### Branding

- [ ] **Favicon** - Replace `src/app/favicon.ico`
- [ ] **Theme Colors** - Update `tailwind.config.ts`
- [ ] **CSS Variables** - Update `src/app/globals.css`

## 🧹 Optional Cleanup

### Remove Template Files

```bash
# Remove template documentation
rm USING-AS-TEMPLATE.md
rm NEW-PROJECT-CHECKLIST.md
rm COMPONENTS-QUICK-REF.md

# Remove template-specific pages (if not needed)
rm -rf src/app/about
rm -rf src/app/contact
rm -rf src/components/sections
```

### Remove Unused Components

Review `src/components/ui/` and remove components you won't use.

## 🔧 Development Setup

- [ ] **Git Repository**

  ```bash
  git add .
  git commit -m "Initial commit from andyd-webapp-starter"
  ```

- [ ] **GitHub Repository**

  ```bash
  gh repo create my-project --private --source=. --push
  ```

- [ ] **Start Development**
  ```bash
  npm run dev
  # Open http://localhost:3000
  ```

## 🚢 Before First Deploy

- [ ] Update all metadata in `src/app/layout.tsx`
- [ ] Set `NEXT_PUBLIC_APP_URL` in `.env.local`
- [ ] Add real content (replace placeholders)
- [ ] Test build: `npm run build`
- [ ] Update SEO: `src/app/sitemap.ts`, `src/app/robots.ts`

## 🎯 Next Steps

### For SaaS Dashboard

```bash
# Add authentication
mkdir -p src/app/api/auth/[...nextauth]
npm install next-auth

# Add dashboard
mkdir -p src/app/dashboard
```

### For Landing Page

```bash
# Keep existing sections, just customize content
# Add blog
mkdir -p src/app/blog
```

### For E-commerce

```bash
# Add commerce features
npm install stripe @stripe/stripe-js
mkdir -p src/app/products src/app/cart
```

## 📚 References

- **Full Guide**: `USING-AS-TEMPLATE.md`
- **Component Reference**: `COMPONENTS-QUICK-REF.md`
- **UI Docs**: `docs/UI-COMPONENTS.md`

---

## ⏱️ Time Estimates

- **Minimal Setup**: 5 minutes (customize script + basic edits)
- **Basic Customization**: 15-30 minutes (content + branding)
- **Full Customization**: 1-2 hours (theme, components, cleanup)

---

**Quick Commands:**

```bash
# New project in 30 seconds
npx degit andyd/andyd-webapp-starter my-app && \
cd my-app && \
git init && \
npm install && \
npm run customize
```

**You're ready to build! 🎉**
