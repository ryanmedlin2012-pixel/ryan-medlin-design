// The section's graphic, animated (the PNG is its finished still, for reduced motion).
import tokenCodeScan from '../assets/Token_code_scan.svg';
import tokenCodeScanStill from '../assets/Token_code_scan_still.png';
// A real damaged card: the problem, in hand.
import tokenRedemptionCard from '../assets/token_redemption_1400x1400.png';
// The upload flow and its error states, from the design file.
import tokenRedemptionFlow from '../assets/token_redemption_a_1400x1400.png';
import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import { ImageStripNav } from '../components/ImageStrip';
import type { StripImage } from '../components/ImageStrip';
import tokenFlow1 from '../assets/Group 2018777272.png';
import tokenFlow2 from '../assets/Group 2018777273.png';
import tokenFlow3 from '../assets/Group 2018777271.png';
import tokenFlow4 from '../assets/Group 2018777274.png';
import tokenFlow5 from '../assets/Group 2018777264.png';
import tokenFlow6 from '../assets/Group 2018777564.png';
import tokenFlow7 from '../assets/Group 2018777266.png';
import tokenFlow8 from '../assets/Group 2018777267.png';
import tokenFlow9 from '../assets/Group 2018777268.png';
import tokenFlow10 from '../assets/Frame 2018776642.png';
import tokenFlow11 from '../assets/Group 2018777565.png';

// Section 04 walkthrough: a player recovering a damaged code, in the order the flow runs.
const flowScreens: StripImage[] = [
  {
    src: tokenFlow1,
    label: 'Upload prompt',
    alt: 'The agent asks for the front and back of the gift card and proof of purchase, with example thumbnails, and an Upload images button',
    aspect: 440 / 929,
    caption:
      'The agent asks for what it needs up front — both sides of the card and proof of purchase — shown as thumbnails.',
  },
  {
    src: tokenFlow2,
    label: 'Photo library',
    alt: 'The phone photo picker opens over the chat, showing the photo library',
    aspect: 440 / 929,
    caption:
      'Uploading opens the phone’s own photo picker, so players choose from photos they already have.',
  },
  {
    src: tokenFlow3,
    label: 'Choose photos',
    alt: 'The photo picker with the gift card front and back chosen',
    aspect: 440 / 929,
    caption: 'Players pick the front and back of the card in one go.',
  },
  {
    src: tokenFlow4,
    label: 'Uploading',
    alt: 'The chat with an Uploading progress bar and a Stop uploading option',
    aspect: 440 / 929,
    caption: 'Progress is visible, and the upload can be stopped.',
  },
  {
    src: tokenFlow5,
    label: 'Analyzing',
    alt: 'The two card images shown in the chat, uploaded, with the status Analyzing',
    aspect: 440 / 929,
    caption: 'The images appear in the chat as they’re checked, so players see what was sent.',
  },
  {
    src: tokenFlow6,
    label: 'Images legible',
    alt: 'Both card images marked Uploaded and Images legible, and the agent asking next for a photo of the proof of purchase',
    aspect: 440 / 929,
    caption: 'A clear success state, then straight on to the next thing the agent needs.',
  },
  {
    src: tokenFlow7,
    label: 'Proof of purchase',
    alt: 'The agent asks for a photo of the proof of purchase, with an Upload image button',
    aspect: 440 / 1031,
    caption: 'One item at a time: the proof of purchase is asked for on its own.',
  },
  {
    src: tokenFlow8,
    label: 'Uploading proof',
    alt: 'The proof of purchase uploading, with a progress bar',
    aspect: 440 / 1031,
    caption: 'The same upload pattern, repeated, so nothing new has to be learned.',
  },
  {
    src: tokenFlow9,
    label: 'Analyzing proof',
    alt: 'The receipt photo shown in the chat, uploaded, with the status Analyzing image',
    aspect: 440 / 1181,
    caption: 'The receipt is checked in view, like the card was.',
  },
  {
    src: tokenFlow10,
    label: 'Proof legible',
    alt: 'The receipt marked Uploaded and Image legible',
    aspect: 440 / 1198,
    caption: 'Every item is confirmed before the agent moves on.',
  },
  {
    src: tokenFlow11,
    label: 'Code delivered',
    alt: 'The agent confirms the gift card is active and valid and gives the code, with a Redeem code now link and feedback buttons',
    aspect: 440 / 1435,
    caption: 'Resolved: a valid code and a one-tap way to redeem it, with no live agent needed.',
  },
];

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
              photographed, or partially obscured, the standard redemption flow fails with no
              recovery path — sending players to live support for what is fundamentally a
              data-retrieval problem.
            </p>
            <p>
              I led the design that turned that data-retrieval problem into a self-service one: the{' '}
              <em>Token Redemption Agent</em>, an AI-assisted flow inside the Xbox Self-Service
              Virtual Agent that lets users photograph and upload a damaged code for automatic
              extraction and validation.
            </p>
            <h3>At a glance</h3>
            <ul>
              <li>
                <span>Role:</span> Senior UX Designer
              </li>
              <li>
                <span>Surface:</span> Web (OCC), Mobile
              </li>
              <li>
                <span>Timeline:</span> 2023
              </li>
              <li>
                <span>Partners:</span> PM, Engineering, Data, Content
              </li>
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
              The 5x5 code format has zero tolerance for character error — a single misread (O for
              0, I for 1, Q for 0) causes a hard failure with no indication of which character is
              wrong. Players had two options: attempt every likely substitution manually, or contact
              live support. For a player mid-session, neither was acceptable.
            </p>
            <p>
              Support queues were absorbing a high volume of repetitive contacts that had a clear
              self-service solution. Designing for this meant understanding not just the happy path
              — code parsed, issue resolved — but every degraded state where image quality, code
              damage, or prior redemption sent the flow sideways.
            </p>
            <h3>Design Constraints</h3>
            <ul>
              <li>
                <span>Files:</span> PNG, JPG up to 10 MB
              </li>
              <li>
                Handle partial reads, unreadable images, and already-redeemed codes distinctly
              </li>
              <li>
                Escalation path must pre-attach image context to eliminate agent re-collection
              </li>
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
              processing, then result. Guidance copy at the capture stage helps players frame the
              code correctly, reducing re-submission rate.
            </p>
            <h3>Three Distinct Error States</h3>
            <p>
              <span>Partially readable:</span> OCR confidence above minimum threshold — prompts
              player to retake with specific framing guidance tailored to the failure mode.
            </p>
            <p>
              <span>Unreadable:</span> OCR confidence below threshold — routes to assisted
              escalation with the image pre-attached for agent context, eliminating redundant data
              collection.
            </p>
            <p>
              <span>Disabled or already redeemed:</span> Distinct messaging with a resolution path
              scoped to that specific code state, not a generic error screen.
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
        imageSlot: {
          type: 'image',
          src: tokenRedemptionFlow,
          alt: 'Part of the upload flow in the chat: the agent asks for the front and back of the gift card and proof of purchase; uploads with problems return an "Issue detected" card listing each issue (unsupported file, too large, blurry, cropped) with a prompt to upload again',
        },
      },
      {
        sectionLabel: '04 / Flow',
        heading: 'Recovering a code, step by step',
        content: (
          <>
            <p>
              Eleven screens take a player from a damaged card to a working code, without a live
              agent. Step through them here, or scroll the screens sideways.
            </p>
            <ImageStripNav id="token-flow" images={flowScreens} matchScreens dragHint />
          </>
        ),
        imageSlot: {
          type: 'strip',
          id: 'token-flow',
          images: flowScreens,
          flowArrows: true,
          uniformWidth: true,
          outlined: true,
        },
        layout: 'mediaBelow',
      },
      {
        sectionLabel: '05 / Impact',
        heading: 'Fewer escalations, better outcomes in both directions',
        content: (
          <>
            <ul>
              <li>
                <span>CSAT:</span> 4.2 / 5 post-launch
              </li>
              <li>
                <span>Live agent escalations avoided on this contact type:</span> -11%
              </li>
              <li>Pre-attached image context on escalated cases reduces agent handle time</li>
              <li>Async resolution replaces real-time queue for this issue category</li>
            </ul>
            <p>
              The -11% escalation reduction is meaningful at Xbox's scale — millions of support
              interactions globally — but the more durable outcome is structural. By designing
              degraded states to pre-attach image context, even cases that cannot self-resolve
              become faster to close. The agent does not just deflect volume; it improves outcomes
              in both the self-serve and escalated paths simultaneously.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
