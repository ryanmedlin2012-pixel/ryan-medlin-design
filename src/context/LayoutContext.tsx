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
  const wheelHandlersRef = useRef<Map<number, WheelHandler>>(new Map());

  const setIsAnimating = useCallback((value: boolean) => {
    isAnimatingRef.current = value;
    setIsAnimatingState(value);
  }, []);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_COUNT) return;
    if (isAnimatingRef.current) return;
    setCurrentSection(index);
    isAnimatingRef.current = true;
    setIsAnimatingState(true);
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
