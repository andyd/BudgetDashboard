# 🚀 Quick Setup Guide

Get your WebApp template up and running in under 5 minutes!

## ⚡ Quick Start (5 minutes)

### 1. Clone & Install

```bash
git clone https://github.com/andyd/andyd-webapp-starter.git
cd andyd-webapp-starter
npm install
```

### 2. Environment Setup

```bash
cp env.example .env.local
# Edit .env.local with your values (optional for basic setup)
```

### 3. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 What You Get

✅ **Complete Landing Page** with 7 sections  
✅ **Responsive Design** mobile-first approach  
✅ **Dark/Light Mode** with system detection  
✅ **TypeScript** strict mode configuration  
✅ **shadcn/ui Components** ready to use  
✅ **ESLint + Prettier** code quality  
✅ **Playwright Tests** for quality assurance  
✅ **SEO Ready** with metadata and sitemap

## 🛠️ Essential Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code
npm run test         # Run tests
npm run analyze      # Analyze bundle size
```

## 🎨 Customization

### Colors & Theme

Edit `tailwind.config.ts` to change your color scheme:

```typescript
primary: {
  500: '#your-color-here', // Main brand color
}
```

### Content

- **Landing Page**: Edit `src/components/sections/`
- **Pages**: Modify `src/app/` files
- **Components**: Customize `src/components/ui/`

### Branding

- Update logo in `src/components/layout/navigation.tsx`
- Change app name in `.env.local`
- Modify meta tags in `src/app/layout.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms

```bash
npm run build        # Build the project
npm run start        # Start production server
```

## 📚 Next Steps

1. **Customize Content** - Update text and images
2. **Add Features** - Extend with new components
3. **Connect APIs** - Add backend integration
4. **Deploy** - Go live with your app

## 🆘 Need Help?

- 📖 **Full Documentation**: [README.md](README.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/andyd/andyd-webapp-starter/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/andyd/andyd-webapp-starter/discussions)

---

**Happy coding! 🎉**
