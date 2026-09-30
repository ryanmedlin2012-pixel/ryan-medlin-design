// Where the reader is within a section, described by content rather than
// pixels: which text element (paragraph, heading, list item, strip nav) is
// at the top of their view, and how far into it. The side-by-side and
// stacked layouts arrange a section very differently, but the same text is
// in both — so this carries over when the layout swaps, where a pixel
// position wouldn't.

export interface ReadingAnchor {
  section: number;
  /** Index of the text element within the section, or -1 for its very start. */
  element: number;
  /** How far into that element (0 = its top, 1 = its bottom). */
  fraction: number;
}

// Marked in both layouts: [data-section-text] wraps a section's copy.
const TEXT_ELEMENTS = 'p, h3, h4, li, [data-strip-nav]';

/** A section's text elements, in reading order. */
export const sectionTextElements = (section: Element | null | undefined) =>
  section
    ? Array.from(section.querySelectorAll('[data-section-text]')).flatMap((text) =>
        Array.from(text.querySelectorAll<HTMLElement>(TEXT_ELEMENTS))
      )
    : [];

/** The text element at viewport height `line` within `section`. */
export const anchorAtLine = (
  section: Element,
  line: number
): Pick<ReadingAnchor, 'element' | 'fraction'> => {
  const elements = sectionTextElements(section);
  if (!elements.length || line <= elements[0].getBoundingClientRect().top) {
    return { element: -1, fraction: 0 };
  }
  for (let i = 0; i < elements.length; i++) {
    const rect = elements[i].getBoundingClientRect();
    if (rect.bottom > line) {
      return { element: i, fraction: Math.min(1, Math.max(0, (line - rect.top) / rect.height)) };
    }
  }
  // Past the text (e.g. in the images below it): the end of the last element.
  return { element: elements.length - 1, fraction: 1 };
};

/**
 * How far below viewport height `line` the anchored point currently sits in
 * `section` — scroll by this to bring it to the line. Null if the section
 * doesn't have that element.
 */
export const anchorOffsetFromLine = (
  section: Element,
  anchor: ReadingAnchor,
  line: number
): number | null => {
  const element = sectionTextElements(section)[anchor.element];
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return rect.top + anchor.fraction * rect.height - line;
};
