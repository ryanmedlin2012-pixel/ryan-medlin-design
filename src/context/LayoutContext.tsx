import { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import { readRestored } from '../hooks/restore';

export const SECTION_COUNT = 4;
export const SECTION_LABELS = ['Introduction', 'Projects', 'Skills', 'Contact'] as const;

export type WheelHandler = (direction: number) => boolean;

export interface SubProgress {
  current: number;
  total: number;
}

export interface LayoutContextType {
  currentSection: number;
  goToSection: (index: number) => void;
  /** Record the section the reader has scrolled to, without animating there. */
  syncSection: (index: number) => void;
  setIsAnimating: (value: boolean) => void;
  isAnimating: boolean;
  sectionCount: number;
  wheelHandlersRef: MutableRefObject<Map<number, WheelHandler>>;
  projectProgress: SubProgress | null;
  setProjectProgress: (value: SubProgress | null) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  currentSection: 0,
  goToSection: () => {},
  syncSection: () => {},
  setIsAnimating: () => {},
  isAnimating: false,
  sectionCount: SECTION_COUNT,
  wheelHandlersRef: { current: new Map() },
  projectProgress: null,
  setProjectProgress: () => {},
});

export const useLayout = () => useContext(LayoutContext);

/** Home page section saved by HorizontalLayout, when this load is a refresh of it. */
export const HOME_SECTION_KEY = 'homeSection';
const restoredHomeSection = () => {
  const saved = readRestored<number>(HOME_SECTION_KEY);
  return typeof saved === 'number' && saved >= 0 && saved < SECTION_COUNT ? saved : 0;
};

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] = useState(restoredHomeSection);
  const [isAnimating, setIsAnimatingState] = useState(false);
  const isAnimatingRef = useRef(false);
  const currentSectionRef = useRef(currentSection);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelHandlersRef = useRef<Map<number, WheelHandler>>(new Map());
  const [projectProgress, setProjectProgress] = useState<SubProgress | null>(null);

  const setIsAnimating = useCallback((value: boolean) => {
    isAnimatingRef.current = value;
    setIsAnimatingState(value);
  }, []);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_COUNT) return;
    if (isAnimatingRef.current) return;
    // Guard: already at this section — calling setCurrentSection(same) produces
    // no state change, so the CSS transition never fires and isAnimating would
    // be permanently locked at true. Early-exit instead.
    if (index === currentSectionRef.current) return;

    // Clear any pending safety timer from a previous navigation
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    currentSectionRef.current = index;
    setCurrentSection(index);
    isAnimatingRef.current = true;
    setIsAnimatingState(true);

    // Safety net: if handleTransitionEnd never fires (e.g. reduced-motion,
    // snap-scroll path, or any edge case), reset isAnimating after the max
    // possible animation duration so navigation never stays permanently locked.
    safetyTimerRef.current = setTimeout(() => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        setIsAnimatingState(false);
      }
    }, 1500);
  }, []);

  // The stacked (phone) layout is a plain scroll: the reader moves between
  // sections themselves, so there's nothing to animate or lock.
  const syncSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_COUNT || index === currentSectionRef.current) return;
    currentSectionRef.current = index;
    setCurrentSection(index);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        currentSection,
        goToSection,
        syncSection,
        setIsAnimating,
        isAnimating,
        sectionCount: SECTION_COUNT,
        wheelHandlersRef,
        projectProgress,
        setProjectProgress,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
