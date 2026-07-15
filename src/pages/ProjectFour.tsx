import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectFour = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Voice Chat Reporting and Voice Safety',
        content: (
          <>
            <p data-role="subtitle">
              Safer communities through evidence-first reporting
            </p>
            <p>
              Voice harassment is one of the most difficult problems in online gaming to address —
              it is ephemeral, contextual, and historically hard to prove. Xbox Live's voice
              reporting system existed, but low player confidence, thin evidence collection, and
              poor report submission rates meant that violations were systematically under-reported
              and under-actioned. Players who experienced harassment often did not report at all.
            </p>
            <p>
              I redesigned the voice report flow to be evidence-first: structured, low-friction,
              and designed to gather the context agents need to act — without burdening the player.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC), Game Bar, Player Profile</li>
              <li>Timeline: 2022 – 2023</li>
              <li>Partners: PM, Engineering, Research, Content, Trust and Safety</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Reporting that players did not trust',
        content: (
          <>
            <p>
              The existing reporting flow was designed for compliance, not confidence. Players who
              submitted reports had no signal that anything would happen. The form collected minimal
              evidence, offered no guidance on what to include, and returned players to gameplay
              with no acknowledgment. Post-session reports could be submitted from three surfaces —
              Game Bar, Player Profile, and Message — but the experience was inconsistent across all three.
            </p>
            <p>
              Low player confidence in the system created a compounding problem: fewer reports meant
              less data for Trust and Safety teams to act on, which meant less visible enforcement,
              which further eroded player confidence. The goal was to break this cycle.
            </p>
            <h3>Baseline Pain Points</h3>
            <ul>
              <li>Players lacked confidence that reports would be acted on</li>
              <li>Evidence collection was thin — no attachment support, no structured context</li>
              <li>Report flow inconsistent across Game Bar, Profile, and Message surfaces</li>
              <li>Action rates on submitted reports were low due to insufficient context</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Evidence-first, confidence-building',
        content: (
          <>
            <p>
              The redesigned flow centers the player's experience of the violation — what happened,
              when, and with whom — as the primary input, rather than asking them to navigate a
              category taxonomy. Evidence attachment (clips, screenshots) was elevated from an
              optional afterthought to a primary step with clear guidance on what is useful and why.
            </p>
            <h3>Key Design Decisions</h3>
            <p>
              <strong>Evidence attachment as a first-class step:</strong> Players are guided to
              attach clips or screenshots at the start of the flow, not buried at the end. The
              interface explains what makes evidence effective, reducing friction for players who
              want to help but are not sure what to submit.
            </p>
            <p>
              <strong>Consistency across surfaces:</strong> The report flow was standardized across
              Game Bar, Player Profile, and Message to ensure players had the same experience
              regardless of where they encountered the issue. This also enabled cross-surface
              analytics for the Trust and Safety team.
            </p>
            <p>
              <strong>Confidence signals:</strong> Post-submission confirmation was redesigned to
              communicate that the report was received, reviewed, and that action policies exist —
              without making commitments the system could not keep.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Reports that lead to action',
        content: (
          <>
            <ul>
              <li>Negative voice chat experiences: -5%</li>
              <li>Player confidence in voice safety: +10%</li>
              <li>Quiet accuracy (Flight Queue): +18%</li>
              <li>Player report submission rate: +21%</li>
              <li>Evidence attachments per report: +60%</li>
              <li>Action rate on agent violators: +43%</li>
            </ul>
            <p>
              The +43% improvement in action rate on violators is the metric that matters most.
              It means the redesign did not just increase report volume — it improved report quality
              enough that Trust and Safety teams could act on a meaningfully higher share of incoming
              cases. More evidence per report, combined with structured context, closed the loop
              that player confidence depends on: report, action, safer community.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
