import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectThree = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Unrecognized Charge Agent',
        content: (
          <>
            <p data-role="subtitle">
              From MVP text links to rich adaptive cards — doubling self-service resolution
            </p>
            <p>
              An unrecognized charge is one of the highest-stress support contacts a player can
              initiate. The stakes are real — potential fraud, disputed purchases, or billing errors —
              and the time pressure is acute. When players arrived at the Unrecognized Charge Agent
              in the Xbox SVA, the MVP experience gave them a list of plain text links. Click-through
              rate was 12.2%, and self-service resolution sat at 18.7%.
            </p>
            <p>
              I redesigned the charge agent using rich adaptive cards — contextual, action-oriented
              components that replaced generic links with specific, clearly labeled resolution paths.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC)</li>
              <li>Timeline: 2023</li>
              <li>Partners: PM, Engineering</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / MVP Analysis',
        heading: 'Phase 1: What the text link model revealed',
        content: (
          <>
            <p>
              The MVP launched with a plain-text response pattern: "We couldn't recognize this
              charge. Here are some things you can try:" followed by three text links — Check your
              order history, Dispute a charge, Contact your bank. The content was accurate.
              The presentation was inadequate.
            </p>
            <p>
              Text links in a conversational chat interface carry no visual weight. In a moment of
              financial stress, players needed immediate confidence that the system understood their
              situation and was offering specific, relevant actions — not a generic list. Analytics
              confirmed the pattern: most players either re-engaged the agent with follow-up
              questions or escalated to live support.
            </p>
            <h3>MVP Metrics</h3>
            <ul>
              <li>Click-through rate: 12.2%</li>
              <li>Self-service resolution rate: 18.7%</li>
              <li>CSAT (flow): 3.2 / 5</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Phase 2: Adaptive cards with contextual actions',
        content: (
          <>
            <p>
              Adaptive cards are structured, visually distinct components that surface a title,
              a brief description, and a primary action in a single scannable unit. For the charge
              agent, each card maps to a specific resolution path — with an icon, a clear action
              label, and enough supporting copy to let players self-triage without reading a wall
              of text.
            </p>
            <h3>Card Architecture</h3>
            <p>
              <strong>Check your order history:</strong> Links directly to purchase history
              filtered by the relevant billing period, not the generic order history page.
            </p>
            <p>
              <strong>Dispute a charge:</strong> Deep-links to the dispute initiation flow with
              transaction context pre-populated where available.
            </p>
            <p>
              <strong>Contact your bank:</strong> Surfaces guidance on what information to have
              ready, framed as a confident next step rather than a fallback of last resort.
            </p>
            <h3>Design Rationale</h3>
            <p>
              The card format communicates specificity. A player who sees "Dispute a charge" as a
              clearly labeled, visually distinct card understands immediately that this is a real
              action, not a search result. The visual hierarchy does work that prose links cannot —
              especially in a high-stakes, low-trust moment like a billing dispute.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Over 2x improvement in self-service resolution',
        content: (
          <>
            <h3>MVP vs. Phase 2 (Adaptive Cards)</h3>
            <ul>
              <li>Click-through rate: 12.2% to 24.6% (+12.4pp / +102%)</li>
              <li>Self-service resolution: 18.7% to 31.2% (+12.5pp / +66.8%)</li>
              <li>CSAT (flow): 3.2 to 4.1 / 5 (+0.9)</li>
            </ul>
            <p>
              Doubling click-through rate while improving CSAT by nearly a full point demonstrates
              that the card format was not just more clickable — it was more trustworthy. Players
              who engaged with the adaptive cards resolved their issues at a meaningfully higher
              rate, with fewer escalations to live support.
            </p>
            <p>
              The case study underscores a principle that applies broadly to conversational UI:
              when the stakes are high, visual structure is not decoration. It is the mechanism
              by which a player decides whether to trust the system's answer.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
