// The section's graphic, animated (the PNG is its finished still, for reduced motion).
import scrollingArticleFocus from '../assets/Scrolling_article_focus.svg';
import scrollingArticleFocusStill from '../assets/Scrolling_article_focus_still.png';
// From the design file: the template's grid and gradients, the article elements with
// their spacing and the screen reader landmarks.
import templateDiagram from '../assets/Scrolling_article_template.png';
import elementSpacing from '../assets/Scrolling_article_spacing.png';
// The scroll hint, animated after the spec's "Icon + scroll bar indicator and
// track" (the PNG is its finished still).
import scrollHint from '../assets/Scrolling_article_scroll_hint.svg';
import scrollHintStill from '../assets/Scrolling_article_scroll_hint_still.png';
import landmarks from '../assets/Scrolling_article_landmarks.png';
// The granted patent: its cover page and the drawing sheet with FIG. 4-1 and 4-2.
import patentSpread from '../assets/Scrolling_article_patent.png';
import patentSpreadFull from '../assets/Scrolling_article_patent_full.jpg';
import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import { ImageStripNav } from '../components/ImageStrip';
import type { StripImage } from '../components/ImageStrip';
import key01 from '../assets/Scrolling_article_k01.jpg';
import key02 from '../assets/Scrolling_article_k02.jpg';
import key03 from '../assets/Scrolling_article_k03.jpg';
import key04 from '../assets/Scrolling_article_k04.jpg';
import key09 from '../assets/Scrolling_article_k09.jpg';
import key10 from '../assets/Scrolling_article_k10.jpg';
import key11 from '../assets/Scrolling_article_k11.jpg';
import key15 from '../assets/Scrolling_article_k15.jpg';
import key16 from '../assets/Scrolling_article_k16.jpg';
import key19 from '../assets/Scrolling_article_k19.jpg';

// Section 02: key frames from the motion spec, a player pressing down on the left stick
// from the top of an article to the end.
const keyFrames: StripImage[] = [
  {
    src: key01,
    label: 'Load',
    alt: 'An article on the TV loads with its first content expander focused, outlined in teal',
    caption: 'The first focusable element in view loads with focus.',
  },
  {
    src: key02,
    label: 'Focus jump',
    alt: 'Focus has moved to the next content expander; the article has not moved',
    caption: 'The next element is already on screen, so focus jumps to it. Nothing scrolls.',
  },
  {
    src: key03,
    label: 'Into the gradient',
    alt: 'Focus lands on a content expander partly hidden by the gradient at the bottom of the screen',
    caption: 'Focus can land on an element the bottom gradient half hides…',
  },
  {
    src: key04,
    label: 'Scroll-snap',
    alt: 'The article has moved up so the focused expander is fully visible above the bottom gradient',
    caption:
      '…which then snaps into full view, its bottom edge 24px above the gradient, in 0.2 seconds.',
  },
  {
    src: key09,
    label: 'Smooth scroll',
    alt: 'The article mid-scroll through body text, lists and a block quote, with nothing focused',
    caption:
      'With no focusable element ahead, the stick scrolls the text instead, at 250px a second.',
  },
  {
    src: key10,
    label: 'Next element',
    alt: 'A content expander rises into view from the bottom of the screen and takes focus',
    caption: 'An expander rises into view and takes focus as it meets the bottom gradient.',
  },
  {
    src: key11,
    label: 'Snap again',
    alt: 'The newly focused expander snapped fully into view',
    caption: 'It snaps into full view, like the one before.',
  },
  {
    src: key15,
    label: 'Focus let go',
    alt: 'The focused expander has scrolled up into the top gradient and lost focus; the scroll hint icon is filled teal',
    caption:
      'Scrolled up past the top gradient, it lets go of focus, and the scroll hint turns teal: the stick now scrolls.',
  },
  {
    src: key16,
    label: 'Focus again',
    alt: 'Another expander enters from the bottom and takes focus; the scroll hint icon returns to its outline',
    caption: 'The next expander takes focus, and the scroll hint returns to rest.',
  },
  {
    src: key19,
    label: 'End of article',
    alt: 'The last element of the article, an image, rests above the bottom gradient; the scroll bar is at the bottom of its track',
    caption:
      'The end: the last element’s spacing meets the bottom gradient as the scroll bar reaches the end of its track.',
  },
];

export const ProjectFive = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Scrolling Article — 10-Foot Experience',
        content: (
          <>
            <p data-role="subtitle">
              Reading and acting on long articles with a controller, on a TV
            </p>
            <p data-role="subtitle-small">
              Patented under:{' '}
              <a
                href="https://patents.google.com/patent/US12427412B2/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                US12427412B2: Systems and methods for presenting visual content
              </a>
            </p>
            <p>
              Xbox support articles on the web mix long passages of text and images with
              interactive pieces: accordion-style content expanders, links and buttons. To bring
              them to the console, every one of them had to work with a controller from across
              the room.
            </p>
            <p>
              That’s harder than it sounds. A console’s focus model moves from one interactive
              element to the next, and text isn’t interactive, so focus alone skips the reading.
              Plain scrolling reads well but gives the player nothing to act on. An article needs
              both, from the same stick. I designed a navigation pattern that combines the two:
              focus jumps between elements that are on screen, and the article scrolls smoothly
              when there are none. That pattern became a Microsoft patent.
            </p>
            <h3>At a glance</h3>
            <ul>
              <li>
                <span>Role:</span> Interaction and visual design
              </li>
              <li>
                <span>Surface:</span> Xbox console (10-foot)
              </li>
              <li>
                <span>Timeline:</span> 2022 (patent granted 2025)
              </li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: scrollingArticleFocus,
          stillSrc: scrollingArticleFocusStill,
          replayOnView: true,
          maxSideCrop: 212,
          alt: 'An article on a TV, with a left stick and an A button beneath it. Each press of the stick moves focus to the next expander in view; one half hidden at the bottom of the screen snaps into view. Holding the stick scrolls the text, and the scroll hint fills once nothing is focused. The next expander takes focus as it rises into view; pressing A turns its chevron and opens it, and holding the stick again scrolls through its contents, more text and an image, to the end of the article.',
        },
      },
      {
        sectionLabel: '02 / Interaction',
        heading: 'Jump when you can, scroll when you can’t',
        content: (
          <>
            <p>
              One rule decides what pressing down does. If another focusable element is in view,
              focus jumps to it. If none is, the article scrolls until one appears. Step through
              the motion spec’s key frames, or scroll the screens sideways.
            </p>
            <ImageStripNav id="article-keys" images={keyFrames} matchScreens dragHint />
          </>
        ),
        imageSlot: {
          type: 'strip',
          id: 'article-keys',
          images: keyFrames,
          flowArrows: true,
          outlined: true,
        },
        layout: 'mediaBelow',
      },
      {
        sectionLabel: '03 / Template',
        heading: 'The viewport and its gradients',
        content: (
          <>
            <p>
              The article sits in a content well eight columns wide, 1136 × 692px visible, with
              the scroll bar in the next column and a right column of actions beside it. Every
              rule in the interaction is measured against this frame.
            </p>
            <p>
              <span>Gradients as edges.</span> At the top and bottom of the well, a solid band
              and a fade hide the content that passes under them. Their edges do real work:
              focus is gained when an element meets the bottom gradient and lost when it passes
              into the top one, and scroll-snap places a focused element 24px clear of them.
            </p>
            <p>
              <span>Hiding the glow.</span> Both gradients run 20px past each side of the well,
              so a focused element’s glow disappears completely beneath them, never cut off
              half-way.
            </p>
            <p>
              <span>A taller fade below.</span> The bottom fade is 52px against the top’s 36px.
              More of the next element shows through it, which tells the player there is more to
              come without any extra UI.
            </p>
            <p>
              <span>Images that always fit.</span> Images and video are fixed at 992px wide, so
              they can never be taller than the visible area.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: templateDiagram,
          alt: 'The article template below the navigation: the content well, 8 columns and 1136 × 692px; a one-column scroll bar; a three-column right column; and the occlusion bands and linear gradients at the top and bottom of the well, with their sizes',
          fit: 'contain',
          background: '#d5d5d5',
        },
      },
      {
        sectionLabel: '04 / Elements',
        heading: 'Any element can follow any other',
        content: (
          <>
            <p>
              Scrollable text, and I’d argue all scrollable content, benefits from what print
              designers call a baseline grid. On a TV the stakes are higher: from across the room,
              an uneven gap between a block quote and a paragraph reads as a broken layout.
            </p>
            <p>
              <span>Spacing built into each element.</span> The spec covers every element an
              article can use: headers, body text, lists, block quotes, link and small buttons,
              content expanders, tables, images and video. Each one carries its own spacing, so
              editors can put them in any order and the rhythm holds without any layout checks.
            </p>
            <p>
              <span>Rules for the edge cases.</span> Nested lists step in by 48px. The last item
              in a list adds 32px below. An array of buttons gets 16px beneath it, except inside a
              list. An open expander has 24px above its content to leave room for the focus glow,
              and takes its bottom spacing from whatever it holds last. Expanders were shaved by
              2px to sit on the grid.
            </p>
            <p>
              <span>Built for reading at a distance.</span> Nested expanders are narrower and set
              in a lighter weight. Long expander titles are cut off with an ellipsis after about 95
              characters. A two-column table drops its header column, so it reads side by side
              rather than as a grid.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: elementSpacing,
          alt: 'The same stretch of an article twice: on the left as players see it, with lists, buttons, a block quote and content expanders; on the right with the spacing built into each element shown as coloured bands',
          fit: 'contain',
          background: '#121212',
        },
      },
      {
        sectionLabel: '05 / Scroll Hint',
        heading: 'Always showing what the stick will do',
        content: (
          <>
            <p>
              With no cursor or hover state, nothing tells the player whether pressing down will
              move focus or scroll. So a small left-stick icon sits at the top of the scroll bar
              and shows which one it will do.
            </p>
            <p>
              <span>Two states.</span> When something in the article has focus, the icon is an
              outline at rest: the stick moves focus. When nothing has focus, it fills teal: the
              stick scrolls. Between the focus glow and this icon, something on screen always shows
              the current mode. The patent claims it too: once scrolling starts, the scroll bar
              carries the indicator.
            </p>
            <p>
              <span>A burst, but just once.</span> When an article opens with nothing focusable in view,
              the icon swells to twice its size half a second after load (0.12 seconds up, 0.58
              down), above the scroll bar. It happens once per article, because an animation that
              repeats on a TV quickly becomes something to ignore.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: scrollHint,
          stillSrc: scrollHintStill,
          replayOnView: true,
          alt: 'The scroll hint on its track: the teal left-stick icon bursts to twice its size and back on load, then rides the white scroll indicator down the track; it turns to a white outline at rest while something has focus, and back to teal when focus lets go',
          fit: 'contain',
          background: '#1f1f1f',
        },
      },
      {
        sectionLabel: '06 / Accessibility',
        heading: 'Labels written to be heard in context',
        content: (
          <>
            <p>
              <span>Five named regions.</span> The page is split into labeled landmarks: Breadcrumb,
              Status and search, Support content, More actions and Feedback. Each uses the words on
              screen.
            </p>
            <p>
              <span>Written for what comes before.</span> When focus enters a region, the screen
              reader says its header before the element’s own label, so labels were written to be
              heard after their header. “Yes” and “No” mean nothing alone; after “Feedback. Did
              this resolve your issue?” they complete the question. Labels never repeat their
              header, and expanders use their heading, so moving through them reads like the
              article’s outline.
            </p>
            <p>
              <span>A rule for content and design.</span> Every label has to make sense right after
              the header before it, and every group of focusable elements has a header directly
              above it.
            </p>
            <p>
              <span>Where focus starts.</span> On the first focusable element in the article, or
              the breadcrumb if there is none. The first utterance ends with “Use scan mode to
              navigate article text”, because focus skips text.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: landmarks,
          alt: 'The article template with its landmarks outlined and labelled: Navigation, Breadcrumb, and Navigation, Status and search, across the top; Main, Support content, around the article; and in the right column Region, More actions, around three buttons, and Region, Feedback, around “Did this resolve your issue?” with Yes and No buttons, Yes focused',
          fit: 'contain',
          background: '#f4f4f4',
        },
      },
      {
        sectionLabel: '07 / Hand-off',
        heading: 'From spec to patent',
        content: (
          <>
            <p>
              The article elements went to engineering in February 2022. Over the next four months
              the spec grew to cover the whole experience: the template, tables, nested lists,
              link and small buttons, notifications, the right column, a light theme and the
              screen reader. A motion spec with prototype videos covered six scenes, from the
              scroll hint to an expander opening.
            </p>
            <p>
              Microsoft filed the patent in September 2022, and it was granted in September 2025
              as US12427412B2, with me among its seven inventors. The claims cover the core of
              this design: focus jumps when the next focusable element is in view, the article
              scrolls when it isn’t, and an indicator on the scroll bar shows when the player is
              scrolling.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: patentSpread,
          alt: 'Two pages of US patent 12,427,412 B2: the cover page, with the title Systems and methods for presenting visual content, the inventors, the abstract and the method flowchart; and drawing sheet 3, FIG. 4-1 and FIG. 4-2, showing a viewport of stacked elements with a focusable element indicated, a navigation direction and a game controller',
          fit: 'contain',
          background: '#ecebe9',
          fullImage: {
            src: patentSpreadFull,
            alt: 'US patent 12,427,412 B2: the cover page and drawing sheet 3, full size',
            label: 'See the patent pages',
          },
        },
      },
    ]}
  />
);
