import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { closeRestoreWindow } from '../hooks/restore';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Once the reader moves to another page, later pages start fresh rather
    // than restoring positions saved from an earlier visit.
    closeRestoreWindow();
    // On the home page, HorizontalLayout handles hash-based navigation.
    // A project URL with a hash names a section, which the project layout
    // scrolls to itself. Otherwise scroll to top on route change.
    if (pathname !== '/' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
