import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectSix = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'SVA Settings, Feedback and Agent Appearance',
        content: (
          <>
            <p data-role="subtitle">
              Control, transparency, and humanized AI
            </p>
            <p>
              As Xbox's Self-Service Virtual Agent (SVA) matured from a functional tool to a primary
              support surface used by millions of players, two gaps became clear: players had no way
              to personalize or control the experience, and the agent itself had no visible identity.
              Both gaps eroded trust. Players who encountered a frustrating interaction had no
              recourse. And a faceless bot inspired less confidence than one that felt deliberately designed.
            </p>
            <p>
              This project introduced a settings panel, an inline feedback model, and a humanized
              agent appearance — three interconnected systems that together made the SVA feel
              controllable, responsive, and intentional.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC)</li>
              <li>Timeline: 2023</li>
              <li>Partners: PM, Engineering, Content, Research</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'An opaque experience players could not shape',
        content: (
          <>
            <p>
              Before this project, the SVA offered no user controls. Players could not adjust language
              preferences, opt out of audio feedback, clear a session mid-conversation, or provide
              feedback on individual responses. The thumbs up/down mechanism existed in name only —
              it was not surfaced in a way that players engaged with, and the data it generated was
              too sparse to calibrate the model meaningfully.
            </p>
            <p>
              The agent appearance was similarly underdeveloped. There was no avatar, no persona
              consistency, and no visual signal distinguishing the AI from a generic chat widget.
              On a platform where player identity is richly expressed through gamertags, avatars,
              and achievement cards, an anonymous support bot felt out of place.
            </p>
            <h3>Baseline Metrics</h3>
            <ul>
              <li>Feedback rate: 2.1%</li>
              <li>Audio feedback usage: 0.3%</li>
              <li>Session restarts (user-initiated): 5.4%</li>
              <li>CSAT: 3.5 / 5</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Settings, feedback, and a face for the agent',
        content: (
          <>
            <h3>Settings Panel</h3>
            <p>
              The settings panel exposes four controls: language selection, audio feedback toggle,
              privacy options, and a "Clear conversation" action. Each control is explained inline —
              not as help text, but as part of the label — so players understand what they are
              changing without leaving the panel. The panel is accessible from a persistent icon
              in the chat header, not buried in a menu.
            </p>
            <h3>Inline Feedback</h3>
            <p>
              Thumbs up and down were redesigned to appear inline within individual agent responses,
              not at the end of a session. This contextualizes the feedback to a specific message
              rather than the entire conversation, generating higher-fidelity calibration data.
              Post-thumbs-down, a micro-prompt asks what was unhelpful — free text or categorized —
              without interrupting the conversation flow.
            </p>
            <h3>Agent Appearance</h3>
            <p>
              The agent received a named persona and avatar aligned with Xbox's visual identity.
              The avatar appears in the chat header and on agent messages. Collapsible controls
              reduce visual noise while keeping settings accessible. The net effect is an agent
              that looks like a deliberate product decision, not a plugged-in widget.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Players engaging with a system they can shape',
        content: (
          <>
            <ul>
              <li>Feedback rate: 2.1% to 7.8% (+5.7pp / +171%)</li>
              <li>Audio feedback usage: 0.3% to 7.6% (+7.3pp)</li>
              <li>Session restarts (user-initiated): 5.4% to 6.1% (+0.7pp / +13%)</li>
              <li>CSAT: 3.5 to 4.2 / 5 (+0.7)</li>
            </ul>
            <p>
              A 171% increase in feedback rate reflects both better placement (inline) and better
              design (clear affordance). The audio feedback usage jump from 0.3% to 7.6% suggests
              that this feature had latent demand that was invisible before the settings panel made
              it discoverable. The CSAT improvement (+0.7) in the same period suggests that giving
              players control of the experience meaningfully improves their perception of it —
              not just their ability to use it.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
