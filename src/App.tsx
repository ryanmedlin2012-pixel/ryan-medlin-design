import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import { LayoutProvider } from './context/LayoutContext'
import { useLayout } from './context/LayoutContext'
import { Navigation, SHOW_IN_PROGRESS, IN_PROGRESS_PATHS } from './components/Navigation'
import { ScrollToTop } from './components/ScrollToTop'
import { Colophon } from './components/Colophon'
import { HorizontalLayout } from './components/HorizontalLayout'
import { Hero } from './components/Hero'
import { FeaturedProjects, FeaturedVisualDesign } from './components/FeaturedProjects'
import { Skills } from './components/Skills'
import { About } from './components/About'
import { MethodsTools } from './components/MethodsTools'
import { Contact } from './components/Contact'
import { ProjectOne } from './pages/ProjectOne'
import { ProjectTwo } from './pages/ProjectTwo'
import { ProjectThree } from './pages/ProjectThree'
import { ProjectFour } from './pages/ProjectFour'
import { ProjectFive } from './pages/ProjectFive'
import { ProjectSix } from './pages/ProjectSix'
import { ProjectSeven } from './pages/ProjectSeven'
import { ProjectEight } from './pages/ProjectEight'
import { ProjectNine } from './pages/ProjectNine'
import { ProjectTen } from './pages/ProjectTen'
import { ProjectEleven } from './pages/ProjectEleven'
import { ProjectTwelve } from './pages/ProjectTwelve'
import { GraphicDesignPage, GALLERY_PAGES } from './pages/GraphicDesign'

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goToSection } = useLayout();

  // Arriving from another page at a section (the nav's section links pass
  // it along). It's a one-time instruction: cleared from this history entry
  // as soon as it's read, or a later refresh would read it again and jump
  // back to that section, wherever the reader had moved to since. (Where
  // they were is remembered separately, for refreshes and Back/Forward.)
  useEffect(() => {
    const state = location.state as { section?: number } | null;
    if (state?.section !== undefined) {
      navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { replace: true, state: null }
      );
    }
    if (state?.section !== undefined && state.section > 0) {
      const idx = state.section;
      // Defer until after HorizontalLayout has mounted and registered handlers
      const id = setTimeout(() => goToSection(idx), 50);
      return () => clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HorizontalLayout
      sections={[
        <Hero />,
        <FeaturedProjects />,
        <FeaturedVisualDesign />,
        <About />,
        <Skills />,
        <MethodsTools />,
        <Contact />,
      ]}
    />
  )
}

// The project pages. Those still in progress are left out of the live site.
const projectRoutes = ([
  ['/project/token-redemption-agent', <ProjectOne />],
  ['/project/support-escalation', <ProjectTwo />],
  ['/project/unrecognized-charge-agent', <ProjectThree />],
  ['/project/unrecognized-charge-lookup', <ProjectTwelve />],
  ['/project/voice-chat-reporting', <ProjectFour />],
  ['/project/scrolling-article-10-foot-experience', <ProjectFive />],
  ['/project/sva-settings-feedback', <ProjectSix />],
  ['/project/persistent-chat-occ', <ProjectSeven />],
  ['/project/skylight-occ-migration', <ProjectEight />],
  ['/project/asurion-hardware-card', <ProjectNine />],
  ['/project/floating-sva-front-door', <ProjectTen />],
  ['/project/xds-design-system', <ProjectEleven />],
] as const).filter(([path]) => SHOW_IN_PROGRESS || !IN_PROGRESS_PATHS.includes(path))

function App() {
  return (
    <LayoutProvider>
      <BrowserRouter basename="/ryan-medlin-design/">
        <Navigation />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {projectRoutes.map(([path, element]) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="/graphic-design/editorial" element={<GraphicDesignPage key="editorial" page={GALLERY_PAGES.editorial} />} />
          <Route path="/graphic-design/posters" element={<GraphicDesignPage key="posters" page={GALLERY_PAGES.posters} />} />
          <Route path="/graphic-design/ephemera" element={<GraphicDesignPage key="ephemera" page={GALLERY_PAGES.ephemera} />} />
          {/* Anything else, including a page left out of the live site: home. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Colophon />
      </BrowserRouter>
    </LayoutProvider>
  )
}

export default App
