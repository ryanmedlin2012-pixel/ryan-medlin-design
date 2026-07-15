import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectOne = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Token Redemption Agent',
        content: (
          <>
            <p data-role="subtitle">
              Helping players get back to their games faster when codes fail
            </p>
            <p>
              Xbox redemption codes are 25-character alphanumeric tokens (5x5 format) used to unlock
              games, DLC, subscriptions, and currency. When a code is physically damaged, poorly
              photographed, or partially obscured, the standard redemption flow fails with no recovery
              path — sending players to live support for what is fundamentally a data-retrieval problem.
            </p>
            <p>
              I designed the Token Redemption Agent: an AI-assisted image upload flow embedded within
              the Xbox Self-Service Virtual Agent (SVA) that allows players to photograph or upload
              their damaged code for automated extraction and validation.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC), Mobile</li>
              <li>Timeline: 2023</li>
              <li>Partners: PM, Engineering, Data, Content</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'A solvable problem in the wrong channel',
        content: (
          <>
            <p>
              The 5x5 code format has zero tolerance for character error — a single misread (O for 0,
              I for 1, Q for 0) causes a hard failure with no indication of which character is wrong.
              Players had two options: attempt every likely substitution manually, or contact live
              support. For a player mid-session, neither was acceptable.
            </p>
            <p>
              Support queues were absorbing high-volume, repetitive contacts that had a clear
              self-service solution. Designing for this meant understanding not just the happy path —
              code parsed, issue resolved — but every degraded state where image quality, code damage,
              or prior redemption sent the flow sideways.
            </p>
            <h3>Design Constraints</h3>
            <ul>
              <li>Files: PNG, JPG up to 10 MB</li>
              <li>Handle partial reads, unreadable images, and already-redeemed codes distinctly</li>
              <li>Escalation path must pre-attach image context to eliminate agent re-collection</li>
              <li>WCAG 2.1 AA compliance across all upload and error states</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Upload flow, error states, and graceful degradation',
        content: (
          <>
            <p>
              The core flow moves through file selection, image preview, submission, async
              processing, then result. Guidance copy at the capture stage helps players frame the
              code correctly, reducing re-submission rate.
            </p>
            <h3>Three Distinct Error States</h3>
            <p>
              <strong>Partially readable:</strong> OCR confidence above minimum threshold — prompts
              player to retake with specific framing guidance tailored to the failure mode.
            </p>
            <p>
              <strong>Unreadable:</strong> OCR confidence below threshold — routes to assisted
              escalation with the image pre-attached for agent context, eliminating redundant data
              collection.
            </p>
            <p>
              <strong>Disabled or already redeemed:</strong> Distinct messaging with a resolution
              path scoped to that specific code state, not a generic error screen.
            </p>
            <h3>Trust and Transparency</h3>
            <p>
              File type and size constraints surface before upload, not after. All error states
              distinguish between user error and system limitation. The interface communicates what
              is happening and why at every step — critical for a high-stakes moment where a player
              is trying to access content they already paid for.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Fewer escalations, better outcomes in both directions',
        content: (
          <>
            <ul>
              <li>CSAT: 4.2 / 5 post-launch</li>
              <li>Live agent escalations avoided on this contact type: -11%</li>
              <li>Pre-attached image context on escalated cases reduces agent handle time</li>
              <li>Async resolution replaces real-time queue for this issue category</li>
            </ul>
            <p>
              The -11% escalation reduction is meaningful at Xbox's scale — millions of support
              interactions globally — but the more durable outcome is structural. By designing
              degraded states to pre-attach image context, even cases that cannot self-resolve
              become faster to close. The agent does not just deflect volume; it improves
              outcomes in both the self-serve and escalated paths simultaneously.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
