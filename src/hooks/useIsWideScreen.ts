import { useEffect, useState } from 'react';

const WIDE_BREAKPOINT = '(min-width: 768px)';

export function useIsWideScreen(): boolean {
  const [isWide, setIsWide] = useState(
    () => window.matchMedia(WIDE_BREAKPOINT).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(WIDE_BREAKPOINT);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isWide;
}
