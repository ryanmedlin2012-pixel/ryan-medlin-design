import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // On the home page, HorizontalLayout handles hash-based navigation.
    // For all other pages, scroll to top on route change.
    if (pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
