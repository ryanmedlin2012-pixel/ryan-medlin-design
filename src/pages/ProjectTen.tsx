import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectTen = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Floating SVA and the Front Door',
        content: (
          <>
            <p data-role="subtitle">
              Building once. Many ways to get help.
            </p>
            <p>
              Xbox's support entry point — the way players first access help — was fragmented. The
              Self-Service Virtual Agent (SVA) existed in multiple configurations across different
              Xbox surfaces, with inconsistent entry points, varying sizing, and no shared design
              language between full-page and embedded variants. Players encountered different-looking
              help experiences depending on where they landed.
            </p>
            <p>
              The Floating SVA project unified the entry point architecture. A single Floating Action
              Button (FAB) model became the consistent front door to Xbox support across the full
              surface estate — deployable on any page, available in any size, and backed by a single
              shared design system.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Web (OCC), Xbox.com, Support pages</li>
              <li>Timeline: 2023 – 2024</li>
              <li>Partners: PM, Engineering, Content, Platform</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Problem',
        heading: 'A fragmented entry point at scale',
        content: (
          <>
            <p>
              At Xbox's scale — 100M+ players, dozens of support surfaces, multiple engineering teams
              — the SVA entry point had diverged across contexts. Some pages had the full SVA
              experience. Others had a link. Others had nothing. Players who knew to seek help found
              different-looking, differently-behaved starting points depending on where they were on
              Xbox.com or the OCC.
            </p>
            <p>
              The fragmentation had two consequences. For players, it undermined the sense that Xbox
              support was a coherent, trustworthy system. For the platform team, it meant that
              improvements to the SVA required updates across multiple independent implementations —
              there was no single front door to update.
            </p>
            <h3>Model Sizing Challenge</h3>
            <p>
              The SVA needed to be deployable in radically different surface contexts: a compact widget
              on a device setup page, a mid-size assistant on a subscription page, a full-screen
              experience on the dedicated support hub. A single rigid layout could not serve all contexts.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Design',
        heading: 'A FAB entry point with four-size model',
        content: (
          <>
            <p>
              The core design decision was to separate the entry point (the FAB) from the experience
              surface (the SVA panel) and give the panel a four-size model — Small, Medium, Large, and
              Extra Large — that could be instantiated contextually based on available surface area and
              the complexity of the expected support task.
            </p>
            <h3>FAB Entry Point</h3>
            <p>
              The Floating Action Button is the universal entry to the SVA across all surfaces. It is
              consistent in position, appearance, and behavior — bottom-right anchored, Xbox brand-aligned,
              accessible via keyboard and touch. Its consistency makes it predictable: wherever a player
              is on Xbox.com or the OCC, the help entry point looks and behaves the same way.
            </p>
            <h3>Size Model: S / M / L / XL</h3>
            <p>
              Each size variant is designed for a specific deployment context. Small serves ancillary
              pages where help is available but not primary. Medium serves account and subscription
              management. Large serves primary support contexts. XL is the full-screen variant for
              dedicated support hub surfaces. All four share the same component system, ensuring
              visual consistency across all sizes.
            </p>
            <h3>Consistent Experience Header</h3>
            <p>
              Across all sizes, a consistent header component anchors the SVA with Xbox brand identity,
              navigation controls, and minimize affordance in the same relative positions. Players
              switching between sizes encounter the same spatial logic throughout the support journey.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'One entry point, everywhere',
        content: (
          <>
            <ul>
              <li>Entry engagement: +38%</li>
              <li>FAB deployed on 38% of Xbox support surfaces (on-demand)</li>
              <li>Full-screen variant deployed on 100% of support pages</li>
              <li>Consistent experience header on 100% of support surfaces</li>
              <li>Full-screen deprecated per platform roadmap (SLA 5/19/26)</li>
            </ul>
            <p>
              A +38% engagement increase on entry reflects the impact of making the front door
              consistent and discoverable. The deployment numbers tell a parallel story: 100%
              consistent experience header coverage means the platform achieved what fragmentation
              had prevented — a single, updatable support entry point across the Xbox surface estate.
              Updates to the front door now propagate everywhere simultaneously.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
