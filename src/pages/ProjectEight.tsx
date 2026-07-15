import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectEight = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Skylight to OCC Migration',
        content: (
          <>
            <p data-role="subtitle">
              A smoother handoff with transparency and trust
            </p>
            <p>
              Xbox's support infrastructure ran on two platforms simultaneously during a multi-year
              transition: Skylight (the legacy system) and the OCC (Online Customer Center, the new
              platform). Players who initiated support sessions on Skylight were handed off to OCC
              mid-conversation — a transfer that was invisible, jarring, and frequently failed.
              Migration success rate sat at 94.1%, with 5.9% of sessions dropping off during the
              transfer entirely.
            </p>
            <p>
              I designed the migration handoff experience to make the platform transition transparent,
              controllable, and trustworthy — so players understood what was happening and why, rather
              than experiencing an unexplained change of interface with no context.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web</li>
              <li>Timeline: 2022</li>
              <li>Partners: PM, Engineering, Research</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Invisible transitions that felt like failures',
        content: (
          <>
            <p>
              When a player's session was migrated from Skylight to OCC, the transfer happened without
              notice. From the player's perspective, the interface changed unexpectedly, context was
              sometimes lost, and error states appeared with no explanation of cause or next steps.
              A 5.9% drop-off rate at the moment of transfer was a direct consequence of players
              interpreting the change as a system failure and closing their session.
            </p>
            <p>
              The problem was compounded by a 2.4% page error report rate post-migration — players who
              completed the transfer but encountered rendering or session issues on the OCC side. This
              data indicated the migration was arriving players in states the OCC was not fully prepared
              to handle, adding both user friction and support volume from the migration itself.
            </p>
            <h3>Baseline Metrics</h3>
            <ul>
              <li>Migration success rate: 94.1%</li>
              <li>Drop-offs during transfer: 5.9%</li>
              <li>Page error reports (post-migration): 2.4%</li>
              <li>CSAT (handoff experience): 3.7 / 5</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Three interventions for a transparent handoff',
        content: (
          <>
            <p>
              The redesign addressed the handoff through three distinct interaction points, each
              targeting a different failure mode in the original flow.
            </p>
            <h3>1. Close Confirmation</h3>
            <p>
              Before a migration transfer, players receive an explicit confirmation step — a clear
              explanation that they are moving to a new platform, what will carry over (session
              context, conversation history), and a primary action to proceed. This reframes the
              transfer from an invisible system event to a player-initiated decision.
            </p>
            <h3>2. Leading Experience</h3>
            <p>
              The OCC landing state after migration was redesigned to acknowledge the handoff
              explicitly — welcoming the player in context of where they came from and confirming
              that their session information is intact. This eliminates the blank-slate experience
              that previously read as session loss.
            </p>
            <h3>3. Tab and Site Accessibility</h3>
            <p>
              Focus management across the migration transfer was audited and corrected. On transfer,
              focus lands on the first meaningful interactive element in the OCC rather than the
              document root, ensuring keyboard and assistive technology users have a coherent
              post-migration experience without disorientation.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Near-perfect migration with dramatically fewer errors',
        content: (
          <>
            <ul>
              <li>Migration success rate: 94.1% to 99.2% (+5.1pp)</li>
              <li>Drop-offs during transfer: 5.9% to 0.8% (down 86%)</li>
              <li>Page error reports post-migration: 2.4% to 0.3% (down 87.5%)</li>
              <li>CSAT (handoff experience): 3.7 to 4.5 / 5 (+0.8)</li>
            </ul>
            <p>
              An 86% reduction in transfer drop-offs is the core result: by making the migration
              transparent and controllable, players stopped abandoning sessions they thought were
              broken. The 87.5% reduction in post-migration error reports reflects improvements to
              the arrival state on OCC — ensuring that migrated sessions land in valid, well-formed
              states rather than edge-case configurations the platform could not handle cleanly.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
