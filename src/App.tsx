import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { LayoutProvider } from './context/LayoutContext'
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

function HomePage() {
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
        </Routes>
      </BrowserRouter>
    </LayoutProvider>
  )
}

export default App
