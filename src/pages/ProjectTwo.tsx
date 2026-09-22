import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import layoutStyles from '../components/ProjectHorizontalLayout.module.css';
import escalationFlow from '../assets/Escalation_1400x1400_b.png';

export const ProjectTwo = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Improved Escalation to Assisted Support',
        content: (
          <>
            <p data-role="subtitle">
              Reducing steps, clarifying paths, and validating with users
            </p>
            <div className={layoutStyles.atAGlance}>
              <h3>At a glance <span aria-hidden="true">→</span></h3>
              <ul className={layoutStyles.inlineList}>
                <li><span>Role:</span> Senior UX Designer (Lead)</li>
                <li><span>Surface:</span> Web</li>
                <li><span>Timeline:</span> 2025</li>
                <li><span>Partners:</span> PM, Engineering, Data, Research, Content</li>
              </ul>
            </div>
            <p>
              Xbox's self-service virtual agent is the primary first-contact support mechanism
              for over 100 million players across Xbox.com. When
              self-service can't resolve an issue, players need a clear, fast path to a human agent.
              By early 2025, that path was broken: 4 clicks through cascading dropdowns, 31% abandonment, and
              frequent topic mismatches that re-routed players mid-conversation.
            </p>
            <p>
              But then, building on work I'd previously completed on the support LLM bot, I designed a conversation first approach that had some surpising revelations.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: escalationFlow,
          alt: 'SVA escalation flow diagram showing the redesigned path from self-service to assisted support, including a verbatim fishing match attempt and targeted topic match attempt',
        },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Four clicks to ask for help',
        content: (
          <>
            <p>
              Before this project, which folded the contact funnel into the LLM bot feature, the escalation path led players to a modal with cascading dropdown
              selections before they could initiate a live chat. Each dropdown introduced a decision
              point with potential for mismatch. As such, too many users who selected the wrong topic category were
              routed to the wrong agent queue, causing frustration all around. Many users restarted the flow entirely.
            </p>
            <p>
              Research confirmed a 37% abandonment rate and found that only 2 of the 5
              test participants independently discovered the "talk to a person" shortcut that already
              existed in the interface. The information architecture was actively obscuring options
              that would have served players better.
            </p>
            <h3>Baseline metrics</h3>
            <ul>
              <li><span>Steps to reach agent:</span> 4 clicks</li>
              <li><span>Abandonment rate:</span> 31% (37% in baseline study)</li>
              <li><span>CSAT (escalation flow):</span> 3.4 / 5</li>
              <li><span>Topic mismatches:</span> frequent, causing re-routing and frustration</li>
              <li><span>Average agent wait time:</span> 3 minutes — not surfaced to users</li>
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
              <span>Topic correction inline:</span> Rather than requiring topic selection before
              escalation, the system uses conversational context from the SVA session to pre-populate
              topic data, surfacing a confirmation step players can correct rather than a classification
              gate they must pass.
            </p>
            <p>
              <span>AI-generated greeting:</span> When an agent session opens, the handoff
              includes the player's display name and a conversational summary of their issue generated
              from the SVA transcript. This eliminates the "start over" dynamic where players re-explain
              to a human what they already told the bot.
            </p>
            <p>
              <span>Wait time transparency:</span> Average wait time is surfaced at the point of
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
              <li><span>Task success rate:</span> 91%</li>
              <li><span>Preferred over baseline design by 86% of participants</span></li>
              <li><span>Participant commentary:</span> "So much easier to find"</li>
            </ul>
            <h3>Production Results</h3>
            <ul>
              <li><span>Steps to reach agent:</span> 4 to 1-2 (approximately -75%)</li>
              <li><span>Abandonment rate:</span> 31% to 18% (-13pp / -38.7%)</li>
              <li><span>Successful escalations:</span> +16%</li>
              <li><span>CSAT (escalation flow):</span> 3.4 to 4.2 / 5 (+0.8)</li>
              <li><span>Self-service containment before escalation:</span> +11%</li>
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
