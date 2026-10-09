import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import { LayoutProvider } from './context/LayoutContext'
import { useLayout } from './context/LayoutContext'
import { Navigation } from './components/Navigation'
import { ScrollToTop } from './components/ScrollToTop'
import { HorizontalLayout } from './components/HorizontalLayout'
import { Hero } from './components/Hero'
import { FeaturedProjects } from './components/FeaturedProjects'
import { Skills } from './components/Skills'
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
        <Skills />,
        <Contact />,
      ]}
    />
  )
}

function App() {
  return (
    <LayoutProvider>
      <BrowserRouter basename="/ryan-medlin-design/">
        <Navigation />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/token-redemption-agent" element={<ProjectOne />} />
          <Route path="/project/support-escalation" element={<ProjectTwo />} />
          <Route path="/project/unrecognized-charge-agent" element={<ProjectThree />} />
          <Route path="/project/voice-chat-reporting" element={<ProjectFour />} />
          <Route path="/project/scrolling-article-10-foot-experience" element={<ProjectFive />} />
          <Route path="/project/sva-settings-feedback" element={<ProjectSix />} />
          <Route path="/project/persistent-chat-occ" element={<ProjectSeven />} />
          <Route path="/project/skylight-occ-migration" element={<ProjectEight />} />
          <Route path="/project/asurion-hardware-card" element={<ProjectNine />} />
          <Route path="/project/floating-sva-front-door" element={<ProjectTen />} />
          <Route path="/project/xds-design-system" element={<ProjectEleven />} />
          <Route path="/graphic-design/editorial" element={<GraphicDesignPage key="editorial" page={GALLERY_PAGES.editorial} />} />
          <Route path="/graphic-design/posters" element={<GraphicDesignPage key="posters" page={GALLERY_PAGES.posters} />} />
          <Route path="/graphic-design/ephemera" element={<GraphicDesignPage key="ephemera" page={GALLERY_PAGES.ephemera} />} />
        </Routes>
      </BrowserRouter>
    </LayoutProvider>
  )
}

export default App
