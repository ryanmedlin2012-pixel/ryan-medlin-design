// Which of a stacked page's sections the reader is on: the last one whose top
// has crossed a line 30% down the screen. At the very bottom of the page it's
// always the last section — a short final section (like Contact) may never
// reach that line, however far the reader scrolls.
export const readingSectionIndex = (sections: (Element | null | undefined)[]) => {
  const atBottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) {
    for (let i = sections.length - 1; i >= 0; i--) if (sections[i]) return i;
  }
  const line = window.innerHeight * 0.3;
  let index = 0;
  sections.forEach((section, i) => {
    if (section && section.getBoundingClientRect().top <= line) index = i;
  });
  return index;
};

/** Calls `onScroll` at most once a frame while the window scrolls. */
export const onWindowScrollFrame = (onScroll: () => void) => {
  let frame = 0;
  const handle = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(onScroll);
  };
  window.addEventListener('scroll', handle, { passive: true });
  return () => {
    window.removeEventListener('scroll', handle);
    cancelAnimationFrame(frame);
  };
};
