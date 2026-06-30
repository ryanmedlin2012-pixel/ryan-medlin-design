import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectOne = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Token redemption agent',
        content: (
          <>
            <p data-role="subtitle">
              Modernizing user experience for a legacy shopping platform
            </p>
            <p>
              This project involved redesigning a legacy e-commerce platform to improve user engagement,
              reduce cart abandonment, and modernize the visual design. The platform serves over 100,000
              monthly active users across desktop and mobile devices.
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
            The existing platform had a 35% cart abandonment rate and poor mobile experience. Users
            reported confusion during checkout and difficulty finding products. The design was over 5
            years old and needed a complete refresh.
          </p>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Solution',
        heading: 'The Solution',
        content: (
          <p>
            I led the redesign effort across four quarters, conducting user research with 40+ participants,
            creating wireframes and prototypes, and collaborating with engineering to implement changes.
            The new design features simplified navigation, improved checkout flow, and responsive mobile design.
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
              <li>Cart abandonment reduced from 35% to 18%</li>
              <li>Mobile conversion increased by 42%</li>
              <li>User satisfaction scores improved from 3.2 to 4.6 out of 5</li>
              <li>Page load time reduced by 30%</li>
            </ul>
            <p>
              This project reinforced the importance of user research in driving design decisions. By involving
              users early and often, we were able to identify pain points that weren't obvious from analytics alone.
              The cross-functional collaboration between design and engineering was critical to success.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
