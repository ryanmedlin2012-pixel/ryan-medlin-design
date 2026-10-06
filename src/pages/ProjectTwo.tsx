import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import layoutStyles from '../components/ProjectHorizontalLayout.module.css';
import escalationFlow from '../assets/Escalation_1400x1400_b.png';
// The same two bubbles, played once as an LLM chat: each rises in and types
// itself out letter by letter, growing to fit, then the assistant's next
// bubble rises in and stays typing. The PNG is its still.
import escalationChat from '../assets/Escalation_chat.svg';
import escalationPanels from '../assets/Escalation_panels_1400x1400.png';
import escalationContext from '../assets/Escalation_1400x1400_e.png';
import escalationFlowFull from '../assets/escalation_flow_full.png';
import escalationImpact from '../assets/Escalation_1400x1400_h.png';

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
              for over 100 million players across Xbox.com. When self-service can't resolve an
              issue, players need a clear, fast path to a human agent. By early 2025, that path
              was broken: 4 clicks through cascading dropdowns, 31% abandonment, and frequent
              topic mismatches that re-routed players mid-conversation.
            </p>
            <p>
              But then, building on work I'd previously completed on the support LLM bot, I
              designed a conversation first approach that had some surpising revelations.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: escalationChat,
          stillSrc: escalationFlow,
          replayOnView: true,
          maxSideCrop: 212,
          alt: 'Support virtual agent chat: the agent greets the player with "Hi there! How can I help you today?" and the player replies "Live agent", and the agent starts typing a response',
        },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Four clicks to ask for help',
        content: (
          <>
            <p>
              Before this project, which folded the contact funnel into a new LLM bot feature (also designed by me), the
              escalation path led players to a modal with cascading dropdown selections before
              they could initiate a live chat. Each dropdown introduced a decision point with
              potential for mismatch. As such, too many users who selected the wrong topic
              category were routed to the wrong agent queue, causing frustration all around.
              Many users restarted the flow entirely.
            </p>
            <p>
              Research confirmed a 37% abandonment rate and found that only 2 of the 5 test
              participants independently discovered the "talk to a person" shortcut that already
              existed in the interface. The information architecture was actively obscuring
              options that would have served players better.
            </p>
            <h3>Baseline metrics</h3>
            <ul>
              <li><span>Steps to reach agent:</span> 4 clicks</li>
              <li><span>Abandonment rate:</span> 31% (37% in baseline study)</li>
              <li><span>CSAT (escalation flow):</span> 3.4 / 5</li>
              <li><span>Topic mismatches:</span> frequent, causing re-routing and frustration</li>
              <li><span>Average agent wait time:</span> 3 minutes (not communicated to users)</li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: escalationPanels,
          alt: 'The legacy escalation modal, showing the cascading dropdown selections players had to work through before they could start a live chat',
          fit: 'contain',
          background: '#f9f8f5',
        },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'One action, smarter context',
        content: (
          <>
            <p>
              Rather than navigating a series of broad categories and subcategories to reach the relevant issue, the virtual agent carries forward details already shared in the conversation and users site browse history (high confidence). Then, the system identifies the information needed (if any) to determine the appropriate support path (low confidence).
            </p>
            
            <p>
              If a required detail is missing, the agent asks a targeted clarification about
              that specific data point. This replaces the old “choose the best-fitting category”
              process (which the user is likely to not know) with a focused question that helps route the player accurately without requiring them to understand the — let's face it — internally generated and beaurocracy clouded support taxonomy.
            </p>
            
          </>
        ),
        imageSlot: {
          type: 'image',
          src: escalationContext,
          alt: 'The redesigned escalation flow, where the virtual agent carries forward conversation context and asks a targeted clarification question before routing to live support',
          fullImage: {
            src: escalationFlowFull,
            alt: 'Full redesigned escalation flow diagram, showing how the virtual agent carries forward conversation context and asks targeted clarification questions before routing to live support',
          },
        },
      },
      {
        sectionLabel: '04 / Validation and Impact',
        heading: 'Validated by users, proven in production',
        content: (
          <>
            <h3>Internal research (post-design)</h3>
            <ul>
              <li><span>Task success rate:</span> 91%</li>
              <li><span>Preferred over baseline design by 86% of participants</span></li>
              <li><span>Participant commentary:</span> "So much easier to find"</li>
            </ul>
            <h3>Production results</h3>
            <ul>
              <li><span>Steps to reach agent:</span> 4 to 1-2 (approximately -75%)</li>
              <li><span>Abandonment rate:</span> 31% to 18% (-13pp / -38.7%)</li>
              <li><span>Successful escalations:</span> +16%</li>
              <li><span>CSAT (escalation flow):</span> 3.4 to 4.2 / 5 (+0.8)</li>
              <li><span>Self-service containment before escalation:</span> +11%</li>
            </ul>
            <p>
              The containment improvement (+11%) reflects a counterintuitive outcome: by making
              escalation easier to find, more players engaged with self-service options along
              the way, resulting in a higher share resolving without an agent. The friction in
              the old path wasn't protecting containment, but rather creating abandonment.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: escalationImpact,
          alt: 'Close-up of the redesigned support virtual agent offering support options: do it yourself, chat with us, or request a call with an estimated wait time',
          fit: 'contain',
          position: 'top',
          background: '#eae8e6',
        },
      },
    ]}
  />
);
