import { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { MutableRefObject, ReactNode } from 'react';

export const SECTION_COUNT = 4;
export const SECTION_LABELS = ['Introduction', 'Projects', 'Skills', 'Contact'] as const;

export type WheelHandler = (direction: number) => boolean;

export interface LayoutContextType {
  currentSection: number;
  goToSection: (index: number) => void;
  setIsAnimating: (value: boolean) => void;
  isAnimating: boolean;
  sectionCount: number;
  wheelHandlersRef: MutableRefObject<Map<number, WheelHandler>>;
}

export const LayoutContext = createContext<LayoutContextType>({
  currentSection: 0,
  goToSection: () => {},
  setIsAnimating: () => {},
  isAnimating: false,
  sectionCount: SECTION_COUNT,
  wheelHandlersRef: { current: new Map() },
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimatingState] = useState(false);
  const isAnimatingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelHandlersRef = useRef<Map<number, WheelHandler>>(new Map());

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

  return (
    <LayoutContext.Provider
      value={{
        currentSection,
        goToSection,
        setIsAnimating,
        isAnimating,
        sectionCount: SECTION_COUNT,
        wheelHandlersRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
