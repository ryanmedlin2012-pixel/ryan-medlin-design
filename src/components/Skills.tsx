import React from 'react';
import styles from './Skills.module.css';

interface Skill {
  category: string;
  items: string[];
}

const skillsData: Skill[] = [
  {
    category: 'Design',
    items: ['UI/UX Design', 'Product Design', 'Interaction Design', 'Design Systems'],
  },
  {
    category: 'Tools',
    items: ['Figma', 'Adobe XD', 'Sketch', 'Protopie'],
  },
  {
    category: 'Methods',
    items: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
  },
  {
    category: 'Other',
    items: ['HTML/CSS', 'Accessibility', 'Information Architecture', 'Design Strategy'],
  },
];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <h2
          className={styles.heading}
          data-section-heading="true"
          tabIndex={-1}
        >
          Skills & Expertise
        </h2>
        <div className={styles.grid}>
          {skillsData.map((skillGroup) => (
            <div key={skillGroup.category} className={styles.skillGroup}>
              <h3 className={styles.categoryTitle}>{skillGroup.category}</h3>
              <ul className={styles.itemsList}>
                {skillGroup.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
