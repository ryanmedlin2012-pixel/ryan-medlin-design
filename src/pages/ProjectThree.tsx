import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectThree = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Unrecognized charge agent',
        content: (
          <>
            <p data-role="subtitle">
              Creating a secure and intuitive financial app for everyday banking
            </p>
            <p>
              Led the complete redesign of a consumer banking mobile application serving 2+ million active users.
              The new design prioritizes security, simplicity, and accessibility while meeting strict regulatory
              requirements for financial institutions.
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
            Users found the previous app cluttered and difficult to navigate. Security concerns prevented some
            users from adopting mobile banking. The app needed to balance functionality with simplicity, and
            comply with banking regulations and accessibility standards.
          </p>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Solution',
        heading: 'The Solution',
        content: (
          <p>
            I conducted extensive user research with banking customers ranging from ages 18–75. Created a
            simplified information architecture, improved visual hierarchy, and implemented biometric authentication
            options. Special attention was paid to accessibility features for users with visual or motor impairments.
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
              <li>Mobile banking adoption increased by 55%</li>
              <li>Customer satisfaction increased from 3.5 to 4.7 out of 5</li>
              <li>Support tickets decreased by 38%</li>
              <li>Achieved WCAG AAA accessibility rating</li>
            </ul>
            <p>
              This project taught me the importance of designing for diverse user groups. Accessibility wasn't an
              afterthought but a core requirement from the start. Security and user trust are paramount in financial
              products and must be balanced with usability.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
