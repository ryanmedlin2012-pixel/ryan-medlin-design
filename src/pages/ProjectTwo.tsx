import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectTwo = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Support escalation',
        content: (
          <>
            <p data-role="subtitle">
              Building a scalable design system for enterprise software
            </p>
            <p>
              Developed a comprehensive design system for a B2B SaaS analytics platform used by over 5,000
              companies. The system includes 60+ components, detailed documentation, and Figma libraries to
              enable consistent product experiences across web and mobile applications.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '02 / Challenge',
        heading: 'The Challenge',
        content: (
          <p>
            The product had grown organically without design standards, resulting in inconsistent UI patterns,
            accessibility issues, and slow feature development. The engineering team struggled with inconsistent
            component implementations across different codebases.
          </p>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Solution',
        heading: 'The Solution',
        content: (
          <p>
            I conducted a comprehensive audit of all existing UI patterns and created a unified design system.
            This included creating atomic components, establishing design tokens, writing accessibility guidelines,
            and creating extensive documentation. I also built Figma libraries to match the coded components.
          </p>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '04 / Impact',
        heading: 'Results & Learnings',
        content: (
          <>
            <ul>
              <li>Component library implementations reduced by 40%</li>
              <li>Design-to-development time cut in half</li>
              <li>Accessibility violations reduced from 120 to 8</li>
              <li>Design system adopted across 3 product teams</li>
            </ul>
            <p>
              Creating a design system requires buy-in from multiple stakeholders. By involving engineering early
              and making the system easy to use, we increased adoption significantly. Ongoing maintenance and
              regular updates were essential to keep the system relevant.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
