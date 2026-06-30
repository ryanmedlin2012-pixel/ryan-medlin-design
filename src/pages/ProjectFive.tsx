import scrollingArticleImg from '../assets/scrolling_article_card_800x400.png';
import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectFive = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Challenge',
        heading: 'Scrolling article for 10 foot experience',
        content: (
          <>
            <p data-role="subtitle">
              Reading &amp; scanning with focusable &amp; expandable elements
            </p>
            <p data-role="subtitle-small">
              <strong>Patented under:</strong>{' '}
              <a
                href="https://patents.google.com/patent/US12427412B2/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                US12427412b2: Systems and methods for presenting visual content
              </a>
            </p>
            <p>
              In order for parity with a vast estate of web based support content, an equivalent
              controller navigable &mdash; console / 10-foot experience &mdash; needed to include
              accordion style content expanders interspersed with potentially large sections of
              text/images.
            </p>
            <p>
              I knew from experience that scrollable textual content, and I would argue actually,
              all scrollable content, benefits from what in the print world is referred to as a
              baseline grid, therefore requiring a navigation pattern that incorporates vertical
              scroll, as well as focus jumping. The design also had to accommodate a wide range of
              content types &mdash; text, lists, embedded lists, images, tables, blockquotes etc.
              &mdash; while maintaining a consistent visual rhythm and clear focus states for remote
              navigation in order for the interaction model to hold up.
            </p>
          </>
        ),
        imageSlot: {
          type: 'carousel',
          images: [
            {
              src: scrollingArticleImg,
              alt: 'Scrolling article 10-foot experience overview',
            },
            { src: scrollingArticleImg, alt: 'Placeholder slide 2' },
            { src: scrollingArticleImg, alt: 'Placeholder slide 3' },
          ],
        },
      },
      {
        sectionLabel: '02 / Design System',
        heading: 'Article Elements & Vertical Rhythm',
        content: (
          <>
            <p>
              The foundation of the article experience on 10-foot and console is a component library
              built around a single governing principle: any element can follow any other element, and
              the vertical rhythm will hold. This principle is baked into the spacing system defined in
              the component spec, which accounts for the unique layout challenges of a 10-foot UI while
              supporting the dynamic, editorially-driven nature of article content.
            </p>
            <h3>Component Inventory</h3>
            <p>
              The spec covers the full range of article elements a content team might assemble: Header,
              Body copy, HR dividers, Blockquote, Side elements, Table (multiple variants), Content
              expander, Link buttons, Small buttons, Image (16:9), and Video image (16:9). Each component
              is documented with its own spacing anatomy before being shown in situ. This allows the spec
              to communicate not just how each element should be built, but how it should relate to other
              elements in the vertical flow of the article.
            </p>
            <h3>Vertical Rhythm as a Design Constraint</h3>
            <p>
              On a 10-foot display, inconsistent spacing compounds in ways that are far more visible than
              on web or mobile. At viewing distance, a miscalculated gap between a blockquote and a body
              paragraph, or an image that sits too tight against a table, reads as a layout error rather
              than a minor inconsistency. The spec addresses this by defining spacing not just within
              components but between them &mdash; ensuring that the margin logic of each element accounts
              for what might precede or follow it.
            </p>
            <p>
              The system is order-agnostic by design. Whether an editorial team places an image before a
              blockquote or a table before a content expander, the vertical intervals remain consistent in
              the spirit of an oldschool baseline grid. This is a meaningful production benefit: it removes
              layout QA burden from the content authoring process and means no combination of elements can
              produce a broken-looking page.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / System Details',
        heading: 'Focus States & Design Rationale',
        content: (
          <>
            <h3>Focus State Integration</h3>
            <p>
              Even at the element specification stage, focus states are baked in. The teal highlight
              overlays visible across interactive components &mdash; Link buttons, Content expanders,
              Small buttons &mdash; show how focus rendering interacts with each component's internal
              layout. On a console or 10-foot interface where the remote drives all navigation, a
              component's focused appearance is as fundamental to its spec as its default state, and
              the document treats it as such.
            </p>
            <h3>Design Rationale</h3>
            <p>
              Defining spacing at the component level rather than the layout level is the right call
              for a content-driven 10-foot experience. Article pages are assembled dynamically &mdash;
              the same component library serves dozens of article templates with different editorial
              structures. By building vertical rhythm into each element's own spacing contract, the
              system guarantees visual consistency without requiring per-template layout overrides. The
              result is a design system that scales with the content rather than fighting it.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Interaction Design',
        heading: 'Scroll Hint & Icon Switching',
        content: (
          <>
            <p>
              On a 10-foot display, communicating that a content-well is scrollable can't rely on hover
              states, visible scrollbars, or cursor proximity &mdash; motion has to do that work. The
              scroll hint component handles this through two related behaviors: a one-time burst animation
              on load, and a dynamic icon state system tied to content-well focus.
            </p>
            <h3>The Burst Animation</h3>
            <p>
              On article load, the scroll hint fires a micro-animation when no focusable element is
              present in the visible content-well. This condition matters on a 10-foot UI because focus
              is the primary interaction mode &mdash; if an element already holds focus on load, the
              burst doesn't compete with it. The animation renders above the scroll-bar on an elevated
              z-index and plays once per session only. In a lean-back context, repeated animations are
              significantly more disruptive than on smaller screens, so the session-scope constraint is
              load-bearing, not incidental.
            </p>
            <h3>Icon State Switching</h3>
            <p>
              The scroll hint icon has two states &mdash; rest and selected &mdash; driven by focus
              activity in the content-well. When any element holds focus, the icon is at rest. When the
              well is idle, it switches to selected, signaling to the remote/controller user that
              directional input will scroll rather than navigate between elements. This passive
              disambiguation is essential on a remote-driven interface, where users need a clear read on
              what their d-pad will do at any given moment. The teal accent color for the selected state
              is a deliberate legibility choice &mdash; it holds at viewing distance without relying on
              fine detail that wouldn't survive the 10-foot rendering environment.
            </p>
            <h3>Design Rationale</h3>
            <p>
              The scroll hint answers a single question &mdash; can I scroll this? &mdash; at the moment
              a user needs to ask it, then steps aside. The burst handles the first-load case; the icon
              switching maintains the answer throughout the session. Together they form a scroll affordance
              system that is present when needed and invisible when not, with no persistent UI chrome required.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '05 / Impact',
        heading: 'Results & Learnings',
        content: (
          <>
            <ul>
              <li>Course completion rates increased by 32%</li>
              <li>Student engagement metrics up by 48%</li>
              <li>Instructor satisfaction improved from 2.9 to 4.4 out of 5</li>
              <li>System adopted by 15 new institutions within 6 months</li>
            </ul>
            <p>
              Education is deeply personal, and different users have very different needs. Creating
              flexible designs that support diverse learning styles required careful consideration.
              Iterating with real users and being willing to pivot based on feedback was essential to
              the project's success.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
