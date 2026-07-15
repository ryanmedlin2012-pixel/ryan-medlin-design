import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectNine = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Asurion Hardware Card',
        content: (
          <>
            <p data-role="subtitle">
              Right information, right time for hardware issues
            </p>
            <p>
              When an Xbox player contacts support with a hardware issue — a broken controller,
              a malfunctioning console, or a peripheral that will not connect — the resolution
              path frequently involves Asurion, Microsoft's device protection and repair partner.
              But players arriving at the Xbox SVA had no direct path to Asurion from within the
              support conversation, creating unnecessary handoff friction and misdirected contacts.
            </p>
            <p>
              I designed the Asurion Hardware Card: a contextual adaptive card that surfaces the
              Asurion contact path at the right moment in the support conversation — when hardware
              topics are detected — with a direct call action and appropriate framing copy.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC)</li>
              <li>Timeline: 2023</li>
              <li>Partners: PM, Engineering, Content, Asurion (CSIA approval)</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'A partner channel players could not find',
        content: (
          <>
            <p>
              Microsoft Complete, powered by Asurion, covers accidental damage, mechanical failure,
              and device replacement for enrolled Xbox hardware. For players with an active plan,
              Asurion is the correct — often only — resolution path for hardware claims. But the
              SVA had no awareness of this. Players with hardware issues who arrived at the SVA
              received generic troubleshooting content, not a path to the partner best positioned
              to actually help them.
            </p>
            <p>
              The gap created two problems: players who needed Asurion did not find it, and players
              who found it through other channels did not have the contextual framing to understand
              what the service was and why they were being routed there. Copy positioning and card
              design had to do both jobs simultaneously.
            </p>
            <h3>Design Requirements</h3>
            <ul>
              <li>CSIA (Asurion partner team) approval required on placement and copy</li>
              <li>Card must appear in context of hardware-topic conversations, not universally</li>
              <li>Direct call action with click-to-call support on mobile surfaces</li>
              <li>Copy must frame Asurion as a trusted partner, not a redirect</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'Contextual placement and trusted framing',
        content: (
          <>
            <p>
              The Asurion Hardware Card is an adaptive card that renders within the SVA conversation
              when hardware-related topics are detected. It presents a single primary action — a call
              button with the Asurion service number — alongside brief framing copy that establishes
              the partner relationship and sets expectations for the call.
            </p>
            <h3>Copy Model</h3>
            <p>
              The card copy reads: "Hardware issue? Contact Asurion, our repair partner." The
              language is direct, attributes the relationship explicitly ("our repair partner"),
              and avoids both the clinical language of a disclaimer and the promotional tone of
              an advertisement. The goal was trusted recommendation, not a handoff notice.
            </p>
            <h3>Placement Logic</h3>
            <p>
              The card surfaces near hardware-related SVA topics — not on every support contact.
              Contextual triggering ensures relevance and prevents the card from reading as an
              intrusive promotion in non-hardware conversations. CSIA-approved placement guidelines
              govern the specific topic triggers.
            </p>
            <h3>Call Action</h3>
            <p>
              The primary action is a click-to-call button rendering the Asurion service number.
              On mobile, this triggers the native dialer directly. On desktop, it surfaces the
              number with a copy affordance. Both states include the number as visible text for
              manual dialing.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'More connections, more successful calls',
        content: (
          <>
            <ul>
              <li>Click-through rate: +28%</li>
              <li>Successful call completions: +19%</li>
              <li>Players with hardware issues connecting to Asurion at higher rates</li>
              <li>Reduced misdirected contacts on hardware topics within Xbox SVA</li>
            </ul>
            <p>
              A +28% click-through rate on a contextually placed card indicates strong relevance
              signal — players with hardware issues recognized the card as directly applicable to
              their situation. The +19% successful call rate reflects that improved framing set
              appropriate expectations for the call, reducing incomplete interactions. The card
              demonstrates that the right partner channel, surfaced in context with trusted copy,
              outperforms generic troubleshooting for issues the SVA cannot resolve directly.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
