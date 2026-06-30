# Design Portfolio

A modern, responsive design portfolio built with React, TypeScript, and Vite. Showcase your UI/UX and product design work with a clean, professional aesthetic.

## Features

- ⚡️ **Fast Development** - Vite for instant dev server and lightning-fast HMR
- 🎨 **Modern Design** - Clean, gradient-based aesthetics with smooth animations
- 📱 **Fully Responsive** - Works beautifully on mobile, tablet, and desktop
- ♿️ **Accessible** - WCAG 2.1 AA compliant
- 🏗️ **Well-Structured** - Organized components and CSS Modules for scalability
- 📦 **TypeScript** - Full type safety out of the box

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx    # Top navigation bar
│   ├── Hero.tsx          # Landing section
│   ├── FeaturedProjects.tsx # Portfolio showcase
│   ├── Skills.tsx        # Skills & expertise
│   ├── Contact.tsx       # Contact section
│   └── Footer.tsx        # Footer
├── assets/              # Images, icons, PDFs
├── styles/              # Global and utility styles
├── App.tsx              # Main application component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites

- Node.js v20.11.1 or higher
- npm v10 or higher

### Installation

```bash
npm install
```

### Development

Start the development server at `http://localhost:5173`:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Customization

### Update Your Information

1. **Hero Section** - Edit `src/components/Hero.tsx`
   - Change title, subtitle, and CTA button text
   - Update the gradient background colors in `Hero.module.css`

2. **Featured Projects** - Edit `src/components/FeaturedProjects.tsx`
   - Replace placeholder projects with your actual work
   - Add project images to `src/assets/`
   - Update project descriptions and tags

3. **Skills** - Edit `src/components/Skills.tsx`
   - Customize skill categories and items
   - Modify categories in the `skillsData` array

4. **Contact** - Edit `src/components/Contact.tsx`
   - Update email and social media links
   - Change contact method handle/icon

5. **Navigation** - Edit `src/components/Navigation.tsx`
   - Update logo/branding text
   - Add or remove navigation links as needed

### Styling

The project uses **CSS Modules** for component scoping. Each component has a corresponding `.module.css` file:

- `Navigation.module.css` - Navigation styles
- `Hero.module.css` - Hero section styles
- `FeaturedProjects.module.css` - Projects grid and cards
- `Skills.module.css` - Skills display
- `Contact.module.css` - Contact section
- `Footer.module.css` - Footer styles
- `index.css` - Global styles

**Color Palette** (customize as needed):
- Primary Gradient: `#667eea` to `#764ba2`
- Text: `#1a1a1a`
- Secondary Text: `#666`
- Light Background: `#f8f9fa`
- Accent: `#0066cc`

### Adding Images

1. Add images to `src/assets/`
2. Import in your component: `import image from '../assets/image.png'`
3. Use in JSX: `<img src={image} alt="description" />`

## Performance Optimizations

- Lazy loading via code splitting (automatic with Vite)
- CSS module scoping prevents style conflicts
- Optimized production builds with gzip compression
- Smooth scroll behavior enabled by default

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Proper color contrast ratios
- Keyboard navigation support
- Responsive touch targets (min 48px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deploying

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repo to Vercel
3. Vercel automatically deploys on each commit

### Netlify

```bash
npm run build
# Drag and drop the `dist` folder to Netlify
```

### GitHub Pages

Update `vite.config.ts`:
```typescript
base: '/your-repo-name/'
```

Then:
```bash
npm run build
# Push dist folder to GitHub Pages
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)

## License

© 2026 Your Name. All rights reserved.

---

**Need help?** Start with editing the components and customizing the portfolio with your own content, images, and links.
