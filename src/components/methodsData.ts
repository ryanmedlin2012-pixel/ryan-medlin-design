// Methods and tools, as data for the Methods & tools portraits: how long
// I've used each (years, from the résumé's dates), where it's served (the
// three disciplines my work has spanned), and how well I'd say I know it.
//
// Mastery is a DRAFT score (1–10), estimated from the work — the case
// studies, the résumé and this site — not a measured fact. Ryan to confirm
// or correct each before it goes live.

/** The three disciplines: product & interaction (Centrify, Xbox, 2015–2026),
    web & editorial (the Chronicle, the Tribune, IDG, 2000–2014), print &
    graphic (the BA on: covers, posters, identity, teaching typography). */
export type Discipline = 'product' | 'editorial' | 'print';

export const DISCIPLINES: Record<Discipline, { label: string; color: string; span: string }> = {
  // (A validated categorical trio: distinct for red–green and blue–yellow
  // colour blindness, each pair — see the dataviz validator.)
  product: { label: 'Product & interaction', color: '#2f8f02', span: '2015–2026' },
  editorial: { label: 'Web & editorial', color: '#b0566e', span: '2000–2014' },
  print: { label: 'Print & graphic', color: '#3b6fb5', span: 'From the BA on' },
};

export interface Skill {
  name: string;
  /** A short name, for labels where space is tight. */
  short: string;
  kind: 'method' | 'tool';
  /** Years of use, roughly (from the résumé's dates). */
  years: number;
  /** Draft, 1–10 (see above). */
  mastery: number;
  /** Where it's served. */
  where: Discipline[];
}

export const SKILLS: Skill[] = [
  // Methods
  { name: 'Problem framing', short: 'Problem framing', kind: 'method', years: 20, mastery: 9, where: ['product', 'editorial'] },
  { name: 'Research and usability testing', short: 'Research', kind: 'method', years: 11, mastery: 8, where: ['product'] },
  { name: 'Wireframes to high fidelity', short: 'Wireframes', kind: 'method', years: 26, mastery: 10, where: ['product', 'editorial'] },
  { name: 'Prototyping', short: 'Prototyping', kind: 'method', years: 20, mastery: 9, where: ['product', 'editorial'] },
  { name: 'Content design', short: 'Content design', kind: 'method', years: 20, mastery: 8, where: ['product', 'editorial'] },
  { name: 'Design systems', short: 'Design systems', kind: 'method', years: 15, mastery: 8, where: ['product', 'editorial'] },
  { name: 'Spec and hand‑off', short: 'Spec & hand‑off', kind: 'method', years: 20, mastery: 9, where: ['product', 'editorial', 'print'] },
  // Tools
  { name: 'Figma', short: 'Figma', kind: 'tool', years: 8, mastery: 9, where: ['product'] },
  { name: 'ProtoPie', short: 'ProtoPie', kind: 'tool', years: 5, mastery: 7, where: ['product'] },
  { name: 'VS Code', short: 'VS Code', kind: 'tool', years: 8, mastery: 8, where: ['product'] },
  { name: 'Claude', short: 'Claude', kind: 'tool', years: 2, mastery: 8, where: ['product'] },
  { name: 'GitHub', short: 'GitHub', kind: 'tool', years: 10, mastery: 7, where: ['product', 'editorial'] },
  { name: 'HTML, CSS and JavaScript', short: 'HTML/CSS/JS', kind: 'tool', years: 26, mastery: 9, where: ['product', 'editorial'] },
  { name: 'InDesign', short: 'InDesign', kind: 'tool', years: 24, mastery: 9, where: ['editorial', 'print'] },
  { name: 'Photoshop', short: 'Photoshop', kind: 'tool', years: 26, mastery: 9, where: ['product', 'editorial', 'print'] },
  { name: 'Illustrator', short: 'Illustrator', kind: 'tool', years: 24, mastery: 8, where: ['product', 'print'] },
];
