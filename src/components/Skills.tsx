import React from 'react';
import styles from './Skills.module.css';

interface SkillItem {
  name: string;
  level: number; // 1–5
}

interface Skill {
  category: string;
  items: SkillItem[];
}

const skillsData: Skill[] = [
  {
    category: 'Design',
    items: [
      { name: 'UI/UX Design', level: 5 },
      { name: 'Product Design', level: 5 },
      { name: 'Interaction Design', level: 5 },
      { name: 'Design Systems', level: 4 },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Figma', level: 5 },
      { name: 'Adobe XD', level: 4 },
      { name: 'Sketch', level: 3 },
      { name: 'Protopie', level: 4 },
    ],
  },
  {
    category: 'Methods',
    items: [
      { name: 'User Research', level: 4 },
      { name: 'Wireframing', level: 5 },
      { name: 'Prototyping', level: 5 },
      { name: 'Usability Testing', level: 4 },
    ],
  },
  {
    category: 'Other',
    items: [
      { name: 'HTML/CSS', level: 3 },
      { name: 'Accessibility', level: 4 },
      { name: 'Information Architecture', level: 4 },
      { name: 'Design Strategy', level: 4 },
    ],
  },
];

const DOTS = [1, 2, 3, 4, 5];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>What I Bring</span>
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
                  <li key={item.name} className={styles.skillRow}>
                    <span className={styles.skillName}>{item.name}</span>
                    <span
                      className={styles.skillDots}
                      role="img"
                      aria-label={`${item.name}: ${item.level} out of 5`}
                    >
                      {DOTS.map((n) => (
                        <span
                          key={n}
                          className={`${styles.dot} ${n <= item.level ? styles.dotFilled : ''}`}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
