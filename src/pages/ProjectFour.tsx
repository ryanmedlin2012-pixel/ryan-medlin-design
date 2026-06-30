import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';

export const ProjectFour = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Voice chat reporting',
        content: (
          <>
            <p data-role="subtitle">
              Simplifying patient-provider communication and medical records access
            </p>
            <p>
              Designed a new patient portal for a healthcare network serving 500,000+ patients. The platform allows
              patients to access medical records, schedule appointments, communicate with providers, and manage
              prescriptions in a HIPAA-compliant environment.
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
            Patients struggled with the previous portal, which had a steep learning curve and poor mobile experience.
            The design had to accommodate users with varying technical literacy and disabilities while maintaining
            strict privacy and security standards.
          </p>
        ),
        imageSlot: { type: 'placeholder' },
      },
      {
        sectionLabel: '03 / Solution',
        heading: 'The Solution',
        content: (
          <p>
            I worked closely with healthcare professionals, IT security teams, and patients to understand requirements.
            Created a clean, task-focused interface that guides users through common workflows. Implemented features like
            appointment reminders, telemedicine integration, and secure messaging with clear privacy controls.
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
              <li>Portal adoption increased from 12% to 48% of patients</li>
              <li>Administrative calls reduced by 25%</li>
              <li>Patient satisfaction scores improved from 2.8 to 4.3 out of 5</li>
              <li>Passed comprehensive security and HIPAA audits</li>
            </ul>
            <p>
              Working in healthcare taught me that clear communication and sensitivity to user anxiety is critical.
              Users are often stressed when accessing medical portals. Regulatory constraints are real but don't have
              to compromise user experience when approached thoughtfully.
            </p>
          </>
        ),
        imageSlot: { type: 'placeholder' },
      },
    ]}
  />
);
