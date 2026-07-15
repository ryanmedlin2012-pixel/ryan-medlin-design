import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectEleven = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'XDS Design System Contributions',
        content: (
          <>
            <p data-role="subtitle">
              Building once, scaling everywhere
            </p>
            <p>
              Across a multi-year engagement designing Xbox Player Support Experiences, the most
              durable output is not any single feature — it is the shared component infrastructure
              that makes features consistent, accessible, and buildable at scale. My contributions
              to the Xbox Design System (XDS) formalized patterns developed in production into
              reusable, documented components that other teams could adopt without re-solving the
              same problems.
            </p>
            <p>
              This work spans responsive layout foundations, a component sizing model, and a library
              of support-surface UI patterns — built to the principle that a designer on a different
              team should be able to pick up any component and have it work correctly in their
              context without modification.
            </p>
            <h3>At a Glance</h3>
            <ul>
              <li>Role: Senior UX Designer</li>
              <li>Surface: Cross-platform (Web, Mobile, Console)</li>
              <li>Timeline: 2022 – 2025</li>
              <li>Partners: PM, Engineering, Design Systems Team, Accessibility</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Responsive Foundation',
        heading: 'A breakpoint system for the full Xbox surface range',
        content: (
          <>
            <p>
              Xbox support surfaces span an unusually wide range of display contexts — from a 360px
              mobile browser to a 1920px desktop OCC, with a 10-foot console experience at one end
              and a compact companion app at the other. Generic responsive frameworks designed for
              web-native products do not translate cleanly to this range.
            </p>
            <p>
              I contributed a four-tier breakpoint system: 360 / 768 / 1280 / 1920px. Each tier is
              defined not just by pixel width but by the interaction context it represents: mobile
              (360) is touch-first and space-constrained; tablet (768) is transitional; desktop (1280)
              is pointer-driven and information-dense; wide (1920) is large-screen optimized.
              Component behavior is specified at each tier, not just layout reflowing.
            </p>
            <h3>Breakpoint Tiers</h3>
            <ul>
              <li>360px: Mobile — touch-first, single-column, full-width actions</li>
              <li>768px: Tablet — transitional, two-column where space allows</li>
              <li>1280px: Desktop — pointer-driven, multi-column, expanded data density</li>
              <li>1920px: Wide — large-screen optimized with constrained max-widths</li>
            </ul>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Component System',
        heading: 'Sizing model and reusable support patterns',
        content: (
          <>
            <p>
              One of the most repeated design problems across Xbox support surfaces is panel sizing:
              how large should the SVA, the OCC widget, or the support card be in a given context?
              Without a system, every team made independent decisions that diverged over time.
            </p>
            <h3>S / M / L / XL Model</h3>
            <p>
              The four-size model (Small / Medium / Large / Extra Large) provides a shared vocabulary
              for deploying support components in any surface context. Each size is defined by its
              use case, not just its pixel dimensions — Small for ancillary contexts, XL for
              dedicated support hubs — and each maps to specific layout configurations in the
              breakpoint system.
            </p>
            <h3>Reusable Support Patterns</h3>
            <p>
              Beyond sizing, the system includes component-level patterns developed from production
              work: the adaptive card structure from the Unrecognized Charge Agent, the persistent
              floating surface architecture from the OCC Stacked Surface, the consistent experience
              header from the Floating SVA front door, and the upload flow components from the
              Token Redemption Agent. Each is documented with usage guidelines, accessibility
              requirements, and known edge cases.
            </p>
            <h3>Accessibility as a System Constraint</h3>
            <p>
              WCAG 2.1 AA compliance is embedded in component specifications, not treated as an
              audit step. Focus management, color contrast, touch target sizing, and ARIA labeling
              are defined at the component level so that teams building with the system do not need
              to audit their own work for these requirements separately.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Consistency that compounds',
        content: (
          <>
            <ul>
              <li>Responsive breakpoints adopted across Xbox support surfaces: 360 / 768 / 1280 / 1920</li>
              <li>S / M / L / XL sizing model deployed on all SVA surfaces</li>
              <li>Consistent experience header on 100% of Xbox support pages</li>
              <li>Entry engagement uplift attributable to consistency: +38%</li>
              <li>Component reuse across multiple independent product teams</li>
              <li>Accessibility requirements embedded in spec, not audited post-build</li>
            </ul>
            <p>
              Design system work is slow to show in metrics because its value is in what does not
              happen: the divergence that does not occur, the accessibility issue that is not
              introduced, the redesign that is not needed because the component was specced correctly
              the first time. The +38% entry engagement figure captures one outcome, but the more
              important one is that Xbox support now has a shared foundation that scales without
              proportional design investment — each new surface inherits consistency rather than
              rebuilding it.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
