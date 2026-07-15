import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectSeven = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Persistent Chat and the OCC Floating Stacked Surface',
        content: (
          <>
            <p data-role="subtitle">
              Always accessible help, without losing context
            </p>
            <p>
              Players navigating the Xbox Online Customer Center (OCC) to resolve support issues
              frequently needed to consult account pages — billing history, subscriptions, device
              settings — while simultaneously working through a support conversation. The existing
              architecture forced a choice: stay in chat, or go find the information you need.
              Doing both meant losing your place in one or the other.
            </p>
            <p>
              I designed the OCC Floating Stacked Surface: a persistent, non-intrusive chat layer
              that travels with the player across OCC pages, maintains session context, and minimizes
              to a recoverable state without ending the conversation.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC)</li>
              <li>Timeline: 2022 – 2023</li>
              <li>Partners: PM, Engineering, Research</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Exploration',
        heading: 'Three models, one chosen',
        content: (
          <>
            <p>
              The design exploration evaluated three architectural models for persistent chat
              on an account management surface where screen real estate competes directly with
              functional page content.
            </p>
            <h3>Model A: Embedded Panel</h3>
            <p>
              Chat renders as a fixed column within the page layout. Always visible, but takes
              permanent real estate, compresses page content, and creates layout conflicts on
              pages with complex data tables or multi-column UI.
            </p>
            <h3>Model B: Side Rail</h3>
            <p>
              Chat expands from a fixed side rail trigger. Reduces layout conflict, but the
              expand/collapse interaction interrupts reading flow and the rail occupies space
              at all times — a persistent visual weight even when not in use.
            </p>
            <h3>Model C: Floating (Chosen)</h3>
            <p>
              Chat floats as an independent layer above page content, anchored to a consistent
              screen position. Minimizable to a compact recovery state without session loss.
              Travels across page navigation. Chosen because it respects page content without
              permanent layout cost and gives players explicit control over visibility.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Context persistence, minimize, and cross-page travel',
        content: (
          <>
            <p>
              The floating surface presented three core design challenges: how to maintain visual
              presence without competing with page content, how to allow minimization without
              losing session state, and how to preserve context as the player navigates across OCC pages.
            </p>
            <h3>Page Context Integration</h3>
            <p>
              When a player navigates to a new OCC page — billing, subscriptions, devices — the
              chat layer reads the page context and surfaces it in the next agent turn. A player
              who navigates to their billing page mid-conversation does not need to tell the agent
              they are looking at billing history; the system infers it. This reduces redundant
              player input and surfaces more relevant responses.
            </p>
            <h3>Minimize and Restore</h3>
            <p>
              The minimize interaction collapses the chat to a compact persistent indicator showing
              unread status. The session remains active. Restoring expands back to the full surface
              with full conversation history intact. The design avoids any state that implies the
              session has ended when it has not.
            </p>
            <h3>Focus and Accessibility</h3>
            <p>
              The floating layer is keyboard navigable and fully separated from page content in the
              focus order. Players can tab through the page without entering the chat layer
              unintentionally. Focus management on expand/collapse moves cleanly between contexts
              without disorientation.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Higher engagement, better containment',
        content: (
          <>
            <ul>
              <li>Chat entry engagement: 4.2% to 8.7% (+4.5pp / +107%)</li>
              <li>Sessions with page context utilized: 67% to 90% (+23pp)</li>
              <li>Minimize and hide usage: 18% (healthy player control signal)</li>
              <li>CSAT (floating experience): 3.7 to 4.4 / 5 (+0.7)</li>
            </ul>
            <p>
              Doubling chat entry engagement while simultaneously improving session quality
              (67% to 90% context utilization) demonstrates that the floating model did not just
              make chat easier to start — it made it more valuable to use. The 18% minimize rate
              is a healthy signal, not a negative one: it means players are actively using the
              session management controls and staying in conversations rather than abandoning them.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
