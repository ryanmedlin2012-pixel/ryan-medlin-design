// The section's graphic, animated (the PNG is its finished still, for reduced motion).
import tokenCodeScan from '../assets/Token_code_scan.svg';
import tokenCodeScanStill from '../assets/Token_code_scan_still.png';
// A real damaged card: the problem, in hand.
import tokenRedemptionCard from '../assets/token_redemption_1400x1400.png';
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
              Xbox redemption codes are 25-character alphanumeric tokens (5x5 format) used to
              unlock games, DLC, subscriptions, and currency. When a code is physically damaged,
              poorly photographed, or partially obscured, the standard redemption flow fails
              with no recovery path — sending players to live support for what is fundamentally
              a data-retrieval problem.
            </p>
            <p>
              I led the design that turned that data-retrieval problem into a self-service one:
              the <em>Token Redemption Agent</em>, an AI-assisted flow inside the Xbox Self-Service
              Virtual Agent that lets users photograph and upload a damaged code for automatic
              extraction and validation.
            </p>
            <h3>At a glance</h3>
            <ul>
              <li><span>Role:</span> Senior UX Designer</li>
              <li><span>Surface:</span> Web (OCC), Mobile</li>
              <li><span>Timeline:</span> 2023</li>
              <li><span>Partners:</span> PM, Engineering, Data, Content</li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: tokenCodeScan,
          stillSrc: tokenCodeScanStill,
          replayOnView: true,
          maxSideCrop: 212,
          alt: 'An Xbox gift card being scanned: its damaged code is read character by character, the doubtful characters checked one by one, and resolved into a valid code',
        },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'A solvable problem in the wrong channel',
        content: (
          <>
            <p>
              The 5x5 code format has zero tolerance for character error — a single misread (O
              for 0, I for 1, Q for 0) causes a hard failure with no indication of which
              character is wrong. Players had two options: attempt every likely substitution
              manually, or contact live support. For a player mid-session, neither was
              acceptable.
            </p>
            <p>
              Support queues were absorbing a high volume of repetitive contacts that had a clear
              self-service solution. Designing for this meant understanding not just the happy
              path — code parsed, issue resolved — but every degraded state where image quality,
              code damage, or prior redemption sent the flow sideways.
            </p>
            <h3>Design Constraints</h3>
            <ul>
              <li><span>Files:</span> PNG, JPG up to 10 MB</li>
              <li>Handle partial reads, unreadable images, and already-redeemed codes distinctly</li>
              <li>Escalation path must pre-attach image context to eliminate agent re-collection</li>
              <li>WCAG 2.1 AA compliance across all upload and error states</li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: tokenRedemptionCard,
          alt: 'The back of a real Xbox gift card whose scratch-off code is scuffed and smeared, leaving several characters unreadable',
          fit: 'contain',
          background: '#989d9d',
        },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Upload flow, error states, and graceful degradation',
        content: (
          <>
            <p>
              The core flow moves through file selection, image preview, submission, async
              processing, then result. Guidance copy at the capture stage helps players frame
              the code correctly, reducing re-submission rate.
            </p>
            <h3>Three Distinct Error States</h3>
            <p>
              <span>Partially readable:</span> OCR confidence above minimum threshold — prompts
              player to retake with specific framing guidance tailored to the failure mode.
            </p>
            <p>
              <span>Unreadable:</span> OCR confidence below threshold — routes to assisted
              escalation with the image pre-attached for agent context, eliminating redundant
              data collection.
            </p>
            <p>
              <span>Disabled or already redeemed:</span> Distinct messaging with a resolution
              path scoped to that specific code state, not a generic error screen.
            </p>
            <h3>Trust and Transparency</h3>
            <p>
              File type and size constraints surface before upload, not after. All error states
              distinguish between user error and system limitation. The interface communicates
              what is happening and why at every step — critical for a high-stakes moment where
              a player is trying to access content they already paid for.
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
              <li><span>CSAT:</span> 4.2 / 5 post-launch</li>
              <li><span>Live agent escalations avoided on this contact type:</span> -11%</li>
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
