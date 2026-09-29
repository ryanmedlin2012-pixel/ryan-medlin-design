import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import vcrClip from '../assets/VCR_1400x1400.png';
import vcrWho from '../assets/VCR_1400x1400_a.png';
import vcrDesign from '../assets/VCR_1400x1400_b.png';
import vcrConfirm from '../assets/VCR_1400x1400_c.png';
import { ImageStripNav } from '../components/ImageStrip';
import type { StripImage } from '../components/ImageStrip';
import flowWho from '../assets/Voice chat report_ who.png';
import flowWhat from '../assets/Voice chat report_ what.png';
import flowVerbatim from '../assets/Voice chat report_ verbatim.png';
import flowSummary from '../assets/Voice chat report_ summary.png';
import flowThanks from '../assets/Voice chat report_ thanks.png';

// Section 05 walkthrough, in the order the report flow runs.
const flowScreens: StripImage[] = [
  {
    src: flowWho,
    label: 'Who',
    alt: 'Step 1, "Who are you reporting?": recent players from Fortnite, choose up to three, with a "Watch voice clip" preview',
    caption:
      "Recent players from the session are listed up front, so players pick who was involved instead of hunting for a gamertag. The captured voice clip is one tap away if they need to check.",
  },
  {
    src: flowWhat,
    label: 'What',
    alt: 'Step 2, "What are you reporting?": select the best reason, such as harassment, with examples of what it might look like',
    caption:
      "Players choose a reason in their own terms, with examples of what each one looks like, rather than navigating a policy taxonomy.",
  },
  {
    src: flowVerbatim,
    label: 'In your own words',
    alt: 'Step 3, "In your own words": an optional text box to describe the experience',
    caption:
      "An optional note gives agents context the clip alone can't carry, without making it a barrier to submitting.",
  },
  {
    src: flowSummary,
    label: 'Summary',
    alt: 'Step 4, "Summary": who is being reported, the reason and description, and the captured voice clip, with a Submit report button',
    caption:
      "Everything is shown back before sending: who, what, and exactly what was captured, so players know what agents will review.",
  },
  {
    src: flowThanks,
    label: 'Thanks',
    alt: 'Step 5, "Thanks for speaking up": the report is uploading and the player will be notified when it is complete',
    caption:
      "Confirmation that the report was received, with clear next steps, so speaking up doesn't feel like shouting into the void.",
  },
];

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
              Voice harassment is one of the most difficult problems in online gaming to address.
              It's ephemeral, contextual, and historically hard to prove. Xbox's voice
              reporting system existed, but low player confidence, thin evidence collection, and
              poor report submission rates meant that violations were systematically
              under-reported and under-actioned. Players who experienced harassment often did
              not report at all.
            </p>
            <p>
              I redesigned the voice report flow to be evidence-first: structured, low-friction,
              and designed to gather the context needed to act, all without burdening the
              player.
            </p>
            <h3>At a glance</h3>
            <ul>
              <li><span>Role:</span> Senior UX Designer</li>
              <li><span>Surface:</span> Console (10 foot)</li>
              <li><span>Timeline:</span> 2022 – 2023</li>
              <li><span>Partners:</span> PM, Engineering, Research, Content, Trust and Safety</li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrWho,
          alt: 'Xbox report flow screen asking "Who are you reporting?", listing recent players from Fortnite with an option to choose up to three people, search for players, or get help if they cannot be found',
        },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'Reporting that players don’t trust',
        content: (
          <>
            <p>
              The existing reporting flow was pretty disjointed. Players
              who submitted reports had no signal that anything would happen. The form collected
              minimal evidence, offered no guidance on what to include, and returned players to
              gameplay with no acknowledgment. Post-session reports could be submitted from
              three surfaces — Game Bar, Player Profile, and Message — but the experience was
              inconsistent across all three.
            </p>
            <p>
              Low player confidence in the system created a compounding problem: fewer reports
              meant less data for Trust and Safety teams to act on, which meant less visible
              enforcement, which further eroded player confidence. Quite a downward spiral. The goal was to break this
              cycle.
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
        imageSlot: {
          type: 'image',
          src: vcrClip,
          alt: 'In-game view of a multiplayer match with an Xbox notification reading "Preparing your voice clip", shown while a voice chat report is being captured',
        },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Evidence-first, confidence-building',
        content: (
          <>
            <p>
              The redesigned flow centers the player's experience of the violation — what
              happened, when, and with whom — as the primary input, rather than asking them to
              navigate a category taxonomy. Evidence attachment (clips, screenshots) was
              elevated from an optional afterthought to a primary step with clear guidance on
              what is useful and why.
            </p>
            <h3>Key Design Decisions</h3>
            <p>
              <span>Evidence attachment as a first-class step:</span> Players are guided to
              attach clips or screenshots at the start of the flow, not buried at the end. The
              interface explains what makes evidence effective, reducing friction for players
              who want to help but are not sure what to submit.
            </p>
            <p>
              <span>Consistency across surfaces:</span> The report flow was standardized across
              Game Bar, Player Profile, and Message to ensure players had the same experience
              regardless of where they encountered the issue. This also enabled cross-surface
              analytics for the Trust and Safety team.
            </p>
            <p>
              <span>Confidence signals:</span> Post-submission confirmation was redesigned to
              communicate that the report was received, reviewed, and that action policies exist
              — without making commitments the system could not keep.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrDesign,
          alt: 'Xbox report flow screen asking "Who are you reporting?", listing recent players from Fortnite with an option to choose up to three people, search for players, or get help if they cannot be found',
          link: {
            href: 'https://www.figma.com/design/TwFIqNdNgBrjmZCNcJaGng/Voice-Chat-Reporting-2301?node-id=419-29384&t=qqlbOC2QbJEzA8cA-1',
            label: 'See Figma',
          },
        },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Reports that lead to action',
        content: (
          <>
            <ul>
              <li><span>Negative voice chat experiences:</span> -5%</li>
              <li><span>Player confidence in voice safety:</span> +10%</li>
              <li><span>Quiet accuracy (Flight Queue):</span> +18%</li>
              <li><span>Player report submission rate:</span> +21%</li>
              <li><span>Evidence attachments per report:</span> +60%</li>
              <li><span>Action rate on agent violators:</span> +43%</li>
            </ul>
            <p>
              The +43% improvement in action rate on violators is the metric that matters most.
              It means the redesign did not just increase report volume — it improved report
              quality enough that Trust and Safety teams could act on a meaningfully higher
              share of incoming cases. More evidence per report, combined with structured
              context, closed the loop that player confidence depends on: report, action, safer
              community.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrConfirm,
          alt: 'Xbox report confirmation screen reading "Thanks for speaking up. Your action helps make Xbox a safer place.", explaining that the report is uploading and the player will be notified when it is complete',
          link: {
            href: 'https://www.figma.com/design/TwFIqNdNgBrjmZCNcJaGng/Voice-Chat-Reporting-2301?node-id=419-29384&t=qqlbOC2QbJEzA8cA-1',
            label: 'See Figma',
          },
        },
      },
      {
        sectionLabel: '05 / Flow',
        heading: 'The report flow, step by step',
        content: (
          <>
            <p>
              Five screens take a player from noticing a problem to a confirmed report. Step
              through them here, or scroll the screens sideways.
            </p>
            <ImageStripNav id="vcr-flow" images={flowScreens} />
          </>
        ),
        imageSlot: { type: 'strip', id: 'vcr-flow', images: flowScreens },
        layout: 'mediaBelow',
      },
      {
        sectionLabel: '06 / Impact',
        heading: 'Reports that lead to action',
        content: (
          <>
            <ul>
              <li><span>Negative voice chat experiences:</span> -5%</li>
              <li><span>Player confidence in voice safety:</span> +10%</li>
              <li><span>Quiet accuracy (Flight Queue):</span> +18%</li>
              <li><span>Player report submission rate:</span> +21%</li>
              <li><span>Evidence attachments per report:</span> +60%</li>
              <li><span>Action rate on agent violators:</span> +43%</li>
            </ul>
            <p>
              The +43% improvement in action rate on violators is the metric that matters most.
              It means the redesign did not just increase report volume — it improved report
              quality enough that Trust and Safety teams could act on a meaningfully higher
              share of incoming cases. More evidence per report, combined with structured
              context, closed the loop that player confidence depends on: report, action, safer
              community.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrConfirm,
          alt: 'Xbox report confirmation screen reading "Thanks for speaking up. Your action helps make Xbox a safer place.", explaining that the report is uploading and the player will be notified when it is complete',
          link: {
            href: 'https://www.figma.com/design/TwFIqNdNgBrjmZCNcJaGng/Voice-Chat-Reporting-2301?node-id=419-29384&t=qqlbOC2QbJEzA8cA-1',
            label: 'See Figma',
          },
        },
      },
      {
        sectionLabel: '07 / Impact',
        heading: 'Reports that lead to action',
        content: (
          <>
            <ul>
              <li><span>Negative voice chat experiences:</span> -5%</li>
              <li><span>Player confidence in voice safety:</span> +10%</li>
              <li><span>Quiet accuracy (Flight Queue):</span> +18%</li>
              <li><span>Player report submission rate:</span> +21%</li>
              <li><span>Evidence attachments per report:</span> +60%</li>
              <li><span>Action rate on agent violators:</span> +43%</li>
            </ul>
            <p>
              The +43% improvement in action rate on violators is the metric that matters most.
              It means the redesign did not just increase report volume — it improved report
              quality enough that Trust and Safety teams could act on a meaningfully higher
              share of incoming cases. More evidence per report, combined with structured
              context, closed the loop that player confidence depends on: report, action, safer
              community.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrConfirm,
          alt: 'Xbox report confirmation screen reading "Thanks for speaking up. Your action helps make Xbox a safer place.", explaining that the report is uploading and the player will be notified when it is complete',
          link: {
            href: 'https://www.figma.com/design/TwFIqNdNgBrjmZCNcJaGng/Voice-Chat-Reporting-2301?node-id=419-29384&t=qqlbOC2QbJEzA8cA-1',
            label: 'See Figma',
          },
        },
      },
      {
        sectionLabel: '08 / Impact',
        heading: 'Reports that lead to action',
        content: (
          <>
            <ul>
              <li><span>Negative voice chat experiences:</span> -5%</li>
              <li><span>Player confidence in voice safety:</span> +10%</li>
              <li><span>Quiet accuracy (Flight Queue):</span> +18%</li>
              <li><span>Player report submission rate:</span> +21%</li>
              <li><span>Evidence attachments per report:</span> +60%</li>
              <li><span>Action rate on agent violators:</span> +43%</li>
            </ul>
            <p>
              The +43% improvement in action rate on violators is the metric that matters most.
              It means the redesign did not just increase report volume — it improved report
              quality enough that Trust and Safety teams could act on a meaningfully higher
              share of incoming cases. More evidence per report, combined with structured
              context, closed the loop that player confidence depends on: report, action, safer
              community.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: vcrConfirm,
          alt: 'Xbox report confirmation screen reading "Thanks for speaking up. Your action helps make Xbox a safer place.", explaining that the report is uploading and the player will be notified when it is complete',
          link: {
            href: 'https://www.figma.com/design/TwFIqNdNgBrjmZCNcJaGng/Voice-Chat-Reporting-2301?node-id=419-29384&t=qqlbOC2QbJEzA8cA-1',
            label: 'See Figma',
          },
        },
      },
    ]}
  />
);
