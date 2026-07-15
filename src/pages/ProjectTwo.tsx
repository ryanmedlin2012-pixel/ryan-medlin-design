import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectTwo = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'SVA Improved Escalation to Assisted Support',
        content: (
          <>
            <p data-role="subtitle">
              Reducing steps, clarifying paths, and validating with users
            </p>
            <p>
              Xbox's Self-Service Virtual Agent (SVA) is the primary first-contact support mechanism
              for over 100 million players across Xbox.com and the Online Customer Center (OCC). When
              self-service cannot resolve an issue, players need a clear, fast path to a human agent.
              That path was broken — 4 clicks through cascading dropdowns, 31% abandonment, and
              frequent topic mismatches that re-routed players mid-conversation.
            </p>
            <p>
              I led UX across discovery, information architecture, interaction design, prototyping,
              accessibility, and validation studies (HITS studies 6 and 7).
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer (Lead)</li>
              <li>Surface: Web (OCC)</li>
              <li>Timeline: 2022 – 2023</li>
              <li>Partners: PM, Engineering, Data, Research, Content</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Four clicks to ask for help',
        content: (
          <>
            <p>
              The escalation path required players to navigate a contact card with cascading dropdown
              selections before they could initiate a live chat. Each dropdown introduced a decision
              point with potential for mismatch — players who selected the wrong topic category were
              routed to the wrong agent queue and had to restart the flow entirely.
            </p>
            <p>
              The HITS study 5 baseline confirmed a 37% abandonment rate and found that only 2 of the
              test participants independently discovered the "talk to a person" shortcut that already
              existed in the interface. The information architecture was actively obscuring options
              that would have served players better.
            </p>
            <h3>Baseline Metrics</h3>
            <ul>
              <li>Steps to reach agent: 4 clicks</li>
              <li>Abandonment rate: 31% (37% in baseline study)</li>
              <li>CSAT (escalation flow): 3.4 / 5</li>
              <li>Topic mismatches: frequent, causing re-routing and frustration</li>
              <li>Average agent wait time: 3 minutes — not surfaced to users</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'One action, smarter context',
        content: (
          <>
            <p>
              The redesign inverted the model from classification-first (player must categorize their
              issue to unlock escalation) to self-help-forward (best self-service option shown first,
              agent escalation always reachable in 1-2 actions). The four-dropdown sequence was
              collapsed into a single primary action: "Chat with an agent."
            </p>
            <h3>Key Design Decisions</h3>
            <p>
              <strong>Topic correction inline:</strong> Rather than requiring topic selection before
              escalation, the system uses conversational context from the SVA session to pre-populate
              topic data, surfacing a confirmation step players can correct — not a classification
              gate they must pass.
            </p>
            <p>
              <strong>AI-generated greeting:</strong> When an agent session opens, the handoff
              includes the player's display name and a conversational summary of their issue generated
              from the SVA transcript. This eliminates the "start over" dynamic where players re-explain
              to a human what they already told the bot.
            </p>
            <p>
              <strong>Wait time transparency:</strong> Average wait time is surfaced at the point of
              escalation, giving players an informed choice between waiting for an agent and trying
              additional self-service options. Previously, players had no signal until after committing.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Validation and Impact',
        heading: 'Validated by users, proven in production',
        content: (
          <>
            <h3>HITS Study 7 (Post-Design)</h3>
            <ul>
              <li>Task success rate: 91%</li>
              <li>Preferred over baseline design by 86% of participants</li>
              <li>Participant commentary: "So much easier to find"</li>
            </ul>
            <h3>Production Results</h3>
            <ul>
              <li>Steps to reach agent: 4 to 1-2 (approximately -75%)</li>
              <li>Abandonment rate: 31% to 18% (-13pp / -38.7%)</li>
              <li>Successful escalations: +16%</li>
              <li>CSAT (escalation flow): 3.4 to 4.2 / 5 (+0.8)</li>
              <li>Self-service containment before escalation: +11%</li>
            </ul>
            <p>
              The containment improvement (+11%) reflects a counterintuitive outcome: by making
              escalation easier to find, more players engaged with self-service options along the
              way, resulting in a higher share resolving without an agent. The friction in the old
              path was not protecting containment — it was creating abandonment.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
