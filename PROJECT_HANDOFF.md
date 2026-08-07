# Ryan Medlin Design Portfolio - Project Handoff

**Date:** 2026-07-15  
**From:** GitHub Copilot Chat  
**To:** Cline  

## Project Overview

React + TypeScript + Vite portfolio showcasing UI/UX and product design work for Xbox support experiences.

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5.4.21
- **Routing:** React Router with basename="/ryan-medlin-design/" for GitHub Pages
- **Styling:** CSS Modules + Tailwind CSS
- **Node Version:** v20.11.1+
- **Deployment:** GitHub Pages (ryanmedlin2012-pixel/ryan-medlin-design)

## Development Commands

```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Current Status: ✅ Working Locally (Not Pushed to GitHub)

Per user request: "going forward let's hold off on github commits and only push our iterations to our localhost"

Last GitHub commit: `c35cba8` - "feat: carouselNav align-self flex-start, gap 0.5rem — stable left alignment"

---

## Work Completed in This Session

### 1. Created 11 Xbox Case Study Pages

**Location:** `src/pages/ProjectOne.tsx` through `ProjectEleven.tsx`

All pages use `ProjectHorizontalLayout` component with 4-panel structure:
- Panel 1: Overview (problem, context, at-a-glance details)
- Panel 2: Problem/Research (metrics, failure modes, baseline data)
- Panel 3: Design (solution approach, interaction design, error states)
- Panel 4: Impact (results, metrics improvements)

**Projects:**
1. **ProjectOne** - Token Redemption Agent ⚠️ *FILE CORRUPTED*
2. **ProjectTwo** - SVA Escalation Flow
3. **ProjectThree** - Unrecognized Charge Flow
4. **ProjectFour** - Voice Chat UX
5. **ProjectFive** - Scrolling Article Experience
6. **ProjectSix** - SVA Settings & Preferences
7. **ProjectSeven** - Persistent Chat System
8. **ProjectEight** - Skylight → OCC Migration ⚠️ *FILE CORRUPTED*
9. **ProjectNine** - Asurion Card Replacement
10. **ProjectTen** - Floating SVA Prototype
11. **ProjectEleven** - Xbox Design System (XDS)

⚠️ **KNOWN ISSUE:** ProjectOne.tsx and ProjectEight.tsx have corrupted content from failed shell heredoc attempts. These files contain mangled JSX and need to be recreated cleanly.

---

### 2. Navigation System Fixes

**File:** `src/components/Navigation.tsx`

**Problem:** Navigation links (Home, Skills, Contact) and project dropdown didn't work from project pages due to incorrect hash routing with GitHub Pages basename.

**Solution:** Replaced hash links with React Router state navigation:

```typescript
const handleSectionLink = (e: React.MouseEvent, index: number) => {
  e.preventDefault();
  if (location.pathname === '/') {
    goToSection(index);
  } else {
    navigate('/', { state: { section: index } });
  }
};
```

**Current State:** Dropdown menu includes all 11 projects, navigation works from any page.

---

### 3. HomePage Section Navigation Fix

**File:** `src/App.tsx`

**Problem:** Navigation state wasn't being picked up on HomePage after cross-page navigation.

**Solution:** Added useEffect to read location.state and trigger section navigation after mount:

```typescript
useEffect(() => {
  const state = location.state as { section?: number };
  if (state?.section !== undefined && state.section > 0) {
    setTimeout(() => goToSection(state.section), 50);
  }
}, []);
```

---

### 4. LayoutContext isAnimating Deadlock Fix

**File:** `src/context/LayoutContext.tsx`

**Problem:** Clicking on the currently active section set `isAnimating` to true but never reset it (because no scroll occurred), permanently locking all navigation.

**Solution:** Added early return guard using `currentSectionRef`:

```typescript
const goToSection = (index: number) => {
  if (isAnimating || index === currentSectionRef.current) return;
  // ... rest of function
};
```

Also added 1.5s safety timer to reset `isAnimating` flag.

**Result:** Navigation works correctly on page load and prevents deadlock state.

---

### 5. Featured Projects Carousel Design Refinement

**File:** `src/components/FeaturedProjects.tsx` and `src/components/FeaturedProjects.module.css`

**Changes Made:**
1. Changed heading font to sans-serif stack
2. Stacked header elements vertically (heading, CardDots, CarouselNav)
3. Repositioned from center to top-left corner
4. Scaled heading down to 14px
5. Scaled nav buttons down to 28×28px
6. Fixed left alignment to always be 2.5rem from container edge across all breakpoints
7. Removed padding-left from carouselNav causing alignment gap

**Current CSS State:**

```css
.heading {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #333;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
               'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
               sans-serif;
}

.carouselHeader {
  position: absolute;
  top: 2rem;
  left: 2.5rem;  /* Single source of truth - no media query overrides */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  z-index: 10;
}

.carouselNav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;  /* Ensures left alignment with heading/dots */
}

.navButton {
  width: 28px;
  height: 28px;
  border: 1.5px solid #333;
  font-size: 0.75rem;
  /* ... */
}

.navCounter {
  font-size: 0.7rem;
  min-width: 40px;
  /* ... */
}

/* Mobile: header goes horizontal with left alignment */
@media (max-width: 768px) {
  .carouselHeader {
    position: static;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 1.25rem 4rem;
    gap: 2rem;
  }
}
```

---

## Architecture Notes

### Custom Horizontal Scroll Layout

The portfolio uses a custom horizontal scroll system instead of traditional vertical pages:

- **LayoutContext** (`src/context/LayoutContext.tsx`) manages scroll state
- **HorizontalLayout** (`src/components/HorizontalLayout.tsx`) for homepage sections
- **ProjectHorizontalLayout** (`src/components/ProjectHorizontalLayout.tsx`) for case study pages
- **SectionDots** component for visual navigation indicators
- **ProgressBar** component for scroll progress

### Section Navigation Flow

1. User clicks navigation link
2. If on homepage → `goToSection()` scrolls to section
3. If on project page → `navigate('/', { state: { section: index } })`
4. HomePage useEffect reads state, calls `goToSection()` after 50ms delay

---

## Known Issues & Technical Debt

### Critical
1. **ProjectOne.tsx** - Corrupted content from failed shell heredoc write
2. **ProjectEight.tsx** - Corrupted content from failed shell heredoc write

Both files need to be recreated with clean content. The original intent was:
- ProjectOne: Token Redemption Agent (AI-assisted code redemption for damaged/illegible game codes)
- ProjectEight: Skylight → OCC Migration (platform migration handoff experience)

### Minor
- No actual images in project pages (all using placeholder slots)
- Footer component exists but may need content updates

---

## File Structure Reference

```
src/
  ├── App.tsx                    # Main app with routing
  ├── main.tsx                   # Entry point
  ├── components/
  │   ├── Navigation.tsx         # Top nav with project dropdown
  │   ├── Hero.tsx              # Landing section
  │   ├── FeaturedProjects.tsx  # Carousel (recently redesigned)
  │   ├── Skills.tsx            # Skills section
  │   ├── Contact.tsx           # Contact section
  │   ├── Footer.tsx            # Footer
  │   ├── HorizontalLayout.tsx  # Homepage scroll container
  │   ├── ProjectHorizontalLayout.tsx  # Project page scroll container
  │   ├── SectionDots.tsx       # Navigation dots
  │   ├── ProgressBar.tsx       # Scroll progress indicator
  │   └── [*.module.css]        # CSS Modules for each component
  ├── pages/
  │   ├── ProjectOne.tsx        # ⚠️ CORRUPTED
  │   ├── ProjectTwo.tsx        # ✅ Working
  │   ├── ProjectThree.tsx      # ✅ Working
  │   ├── ProjectFour.tsx       # ✅ Working
  │   ├── ProjectFive.tsx       # ✅ Working
  │   ├── ProjectSix.tsx        # ✅ Working
  │   ├── ProjectSeven.tsx      # ✅ Working
  │   ├── ProjectEight.tsx      # ⚠️ CORRUPTED
  │   ├── ProjectNine.tsx       # ✅ Working
  │   ├── ProjectTen.tsx        # ✅ Working
  │   └── ProjectEleven.tsx     # ✅ Working
  ├── context/
  │   └── LayoutContext.tsx     # Scroll state management
  ├── hooks/
  │   └── useMediaQuery.ts      # Responsive breakpoint hook
  └── styles/
      └── ProjectPage.module.css  # Shared project page styles
```

---

## Design System Notes

### Typography
- **Sans-serif stack** for UI elements: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...`
- **Serif font** for project content/body text

### Spacing
- Carousel header: 2.5rem from left edge (desktop), horizontal layout on mobile
- Consistent section padding and gaps

### Responsive Breakpoints
- Mobile: ≤768px
- Tablet: 769px - 1024px
- Desktop: >1024px

---

## Next Steps / User Intent

User wanted to switch from GitHub Copilot Chat to Cline to preserve GitHub Copilot credits, using their Claude API subscription instead.

### Immediate Tasks
1. Fix ProjectOne.tsx corrupted content
2. Fix ProjectEight.tsx corrupted content
3. Continue design iterations as needed

### Workflow Preference
- **Local development only** - no GitHub commits/pushes until user requests
- Test with `npm run build` and `npm run dev`

---

## Conversation Context

This session involved:
- Building out complete case study content across 11 project pages
- Debugging and fixing navigation system issues
- Iterative design refinement of Featured Projects carousel
- Multiple attempts at fixing isAnimating deadlock (finally resolved with currentSectionRef guard)
- Precise CSS positioning adjustments for carousel header alignment

The user is a designer/developer working on their portfolio, comfortable with technical details, and prefers incremental testing with clear explanations of changes.

---

## Questions to Ask User (via Cline)

1. Do you want to fix ProjectOne.tsx and ProjectEight.tsx first, or continue with other work?
2. Are there design changes you'd like to make to other sections?
3. Do you have actual project images ready to replace placeholder slots?
4. When do you want to do the next GitHub Pages deployment?

---

**End of Handoff Document**
