import React, { useId, useState } from 'react';
import styles from './MethodsPortrait.module.css';
import { DISCIPLINES, SKILLS } from './methodsData';
import type { Discipline, Skill } from './methodsData';

// Two portraits of the methods and tools (see methodsData):
//
// - Venn: the three disciplines as translucent circles, overlapping; each
//   method or tool a dot placed in the overlap it belongs to, sized by years
//   of use, darker the greater its mastery.
// - Ledger: the exact version — a row each, with a mastery bar, a years bar,
//   and where it's served.
//
// Both carry a table for screen readers, and a tooltip on hover.

const ORDER: Discipline[] = ['product', 'editorial', 'print'];
const MAX_YEARS = 26;

/** A dot's radius: its area grows with years (so a 26-year dot isn't 13
    times the area of a 2-year one). */
const radiusFor = (years: number) => 5 + 3.2 * Math.sqrt(years);
/** Its ink: lighter for less mastery, full for most (draft scores 7–10
    spread across the range). */
const inkFor = (mastery: number) => 0.25 + 0.75 * Math.max(0, Math.min(1, (mastery - 6) / 4));

// The Venn's geometry (in its viewBox): the three circles, and each dot's
// place, inside exactly the circles it belongs to.
const CIRCLES: Record<Discipline, { cx: number; cy: number; r: number }> = {
  product: { cx: 360, cy: 340, r: 290 },
  editorial: { cx: 700, cy: 340, r: 290 },
  print: { cx: 530, cy: 600, r: 200 },
};
const PLACES: Record<string, [number, number]> = {
  // Product only
  'Research and usability testing': [195, 235],
  Figma: [310, 185],
  'VS Code': [175, 355],
  Claude: [262, 300],
  ProtoPie: [250, 465],
  // Product and editorial
  'Wireframes to high fidelity': [530, 170],
  'Problem framing': [468, 245],
  Prototyping: [592, 245],
  'Content design': [468, 315],
  'Design systems': [592, 315],
  GitHub: [468, 380],
  'HTML, CSS and JavaScript': [592, 380],
  // All three
  'Spec and hand\u2011off': [482, 485],
  Photoshop: [580, 485],
  // Product and print; editorial and print
  Illustrator: [410, 595],
  InDesign: [650, 595],
};

/** Each circle's name, set in capitals along a curve just inside its edge
    (as type set on a path in print): an arc of the circle (radius, from
    and to angles in degrees, clockwise from 3 o'clock). Along the top, the
    arc runs clockwise and the letters stand outward from it, toward the
    edge; along the bottom, it runs anticlockwise and they stand inward —
    so both read upright, left to right. */
const NAME_ARCS: Record<Discipline, { r: number; from: number; to: number; clockwise: boolean }> = {
  product: { r: 262, from: -172, to: -78, clockwise: true },
  editorial: { r: 262, from: -102, to: -8, clockwise: true },
  print: { r: 180, from: 150, to: 30, clockwise: false },
};
const arcPath = (d: Discipline) => {
  const { cx, cy } = CIRCLES[d];
  const { r, from, to, clockwise } = NAME_ARCS[d];
  const at = (deg: number) => [
    (cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(1),
    (cy + r * Math.sin((deg * Math.PI) / 180)).toFixed(1),
  ];
  const [x1, y1] = at(from);
  const [x2, y2] = at(to);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 ${clockwise ? 1 : 0} ${x2} ${y2}`;
};

/** Where each dot's label sits: under it, or (in the crowded middle) out
    to its left or right, into the open space beside the overlap. */
const LABEL_SIDE: Record<string, 'left' | 'right'> = {
  'Wireframes to high fidelity': 'right',
  'Problem framing': 'left',
  Prototyping: 'right',
  'Content design': 'left',
  'Design systems': 'right',
  GitHub: 'left',
  'HTML, CSS and JavaScript': 'right',
  'Spec and hand\u2011off': 'left',
  Photoshop: 'right',
};

const whereText = (skill: Skill) =>
  skill.where.map((d) => DISCIPLINES[d].label).join(', ');

/** The data as a table, for screen readers (both portraits). */
const SrTable = () => (
  // (Hidden by a wrapper: a table won't shrink below its content's width,
  // so hidden itself it would still widen the page.)
  <div className={styles.srOnly}>
    <table>
      <caption>Methods and tools: mastery (draft, out of 10), years of use, and where applied</caption>
      <thead>
        <tr>
          <th scope="col">Method or tool</th>
          <th scope="col">Mastery</th>
          <th scope="col">Years</th>
          <th scope="col">Where</th>
        </tr>
      </thead>
      <tbody>
        {SKILLS.map((skill) => (
          <tr key={skill.name}>
            <th scope="row">{skill.name}</th>
            <td>{skill.mastery} of 10</td>
            <td>{skill.years}</td>
            <td>{whereText(skill)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Tooltip = ({ skill, x, y }: { skill: Skill; x: number; y: number }) => (
  <div className={styles.tooltip} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
    <strong>{skill.name}</strong>
    <span>
      Mastery {skill.mastery}/10 · {skill.years} {skill.years === 1 ? 'year' : 'years'}
    </span>
    <span className={styles.tooltipWhere}>{whereText(skill)}</span>
  </div>
);

export const VennPortrait = () => {
  const [hover, setHover] = useState<string | null>(null);
  // (Unique ids for the name arcs, should the portrait appear twice.)
  const baseId = useId().replace(/:/g, '');
  const W = 1060;
  const H = 830;
  const hovered = SKILLS.find((s) => s.name === hover);
  return (
    <figure className={styles.figure}>
      <div className={styles.venn}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
          {/* The disciplines: translucent, so their overlaps deepen. */}
          {ORDER.map((d) => (
            <circle
              key={d}
              cx={CIRCLES[d].cx}
              cy={CIRCLES[d].cy}
              r={CIRCLES[d].r}
              fill={DISCIPLINES[d].color}
              fillOpacity={0.13}
              stroke={DISCIPLINES[d].color}
              strokeOpacity={0.55}
              strokeWidth={2}
            />
          ))}
          {/* Their names, in capitals on a curve just inside each circle (in
              text ink: the circle they're set on says which they name). */}
          <defs>
            {ORDER.map((d) => (
              <path key={d} id={`${baseId}-arc-${d}`} d={arcPath(d)} />
            ))}
          </defs>
          <g className={styles.circleName}>
            {ORDER.map((d) => (
              <text key={d}>
                <textPath href={`#${baseId}-arc-${d}`} startOffset="50%" textAnchor="middle">
                  {DISCIPLINES[d].label.toUpperCase()}
                </textPath>
              </text>
            ))}
          </g>
          {/* The key, in the drawing (so its sizes are the dots' sizes, at any
              width): years, bottom left; mastery, bottom right. */}
          <g className={styles.keyText}>
            <text x={70} y={720} className={styles.keyHead}>
              Years of use
            </text>
            {[2, 10, 26].map((y, i) => {
              const cx = 92 + i * 78;
              return (
                <g key={y}>
                  <circle
                    cx={cx}
                    cy={772 - radiusFor(y)}
                    r={radiusFor(y)}
                    fill="none"
                    stroke="#362828"
                    strokeWidth={2}
                  />
                  <text x={cx} y={806} textAnchor="middle">
                    {y}
                  </text>
                </g>
              );
            })}
            <text x={990} y={720} className={styles.keyHead} textAnchor="end">
              Mastery (draft)
            </text>
            {[7, 8, 9, 10].map((m, i) => {
              const cx = 770 + i * 62;
              return (
                <g key={m}>
                  <circle cx={cx} cy={757} r={15} fill="#362828" fillOpacity={inkFor(m)} />
                  <text x={cx} y={806} textAnchor="middle">
                    {m}
                  </text>
                </g>
              );
            })}
          </g>
          {/* The methods and tools. */}
          {SKILLS.map((skill) => {
            const [x, y] = PLACES[skill.name];
            const r = radiusFor(skill.years);
            const dim = hover !== null && hover !== skill.name;
            return (
              <g
                key={skill.name}
                className={styles.dot}
                style={{ opacity: dim ? 0.35 : 1 }}
                onMouseEnter={() => setHover(skill.name)}
                onMouseLeave={() => setHover(null)}
              >
                {/* (A larger, invisible target for the pointer.) */}
                <circle cx={x} cy={y} r={Math.max(r, 14) + 8} fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="#362828"
                  fillOpacity={inkFor(skill.mastery)}
                  stroke="#fbfaf9"
                  strokeWidth={2}
                />
                {LABEL_SIDE[skill.name] ? (
                  <text
                    x={LABEL_SIDE[skill.name] === 'left' ? x - r - 8 : x + r + 8}
                    y={y + 6}
                    className={styles.dotLabel}
                    textAnchor={LABEL_SIDE[skill.name] === 'left' ? 'end' : 'start'}
                  >
                    {skill.short}
                  </text>
                ) : (
                  <text x={x} y={y + r + 20} className={styles.dotLabel} textAnchor="middle">
                    {skill.short}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hovered && (
          <Tooltip
            skill={hovered}
            x={(PLACES[hovered.name][0] / W) * 100}
            y={((PLACES[hovered.name][1] - radiusFor(hovered.years) - 8) / H) * 100}
          />
        )}
      </div>
      <SrTable />
    </figure>
  );
};

export const LedgerPortrait = () => {
  const [hover, setHover] = useState<string | null>(null);
  const groups: Array<{ label: string; kind: Skill['kind'] }> = [
    { label: 'Methods', kind: 'method' },
    { label: 'Tools', kind: 'tool' },
  ];
  return (
    <figure className={styles.figure}>
      <div className={styles.ledger} aria-hidden="true">
        <div className={`${styles.row} ${styles.headRow}`}>
          <span />
          <span>Mastery (draft, of 10)</span>
          <span>Years of use</span>
          <span className={styles.whereHead}>
            {ORDER.map((d) => (
              <span key={d} className={styles.whereKey}>
                <span className={styles.swatch} style={{ background: DISCIPLINES[d].color }} />
                {DISCIPLINES[d].label}
              </span>
            ))}
          </span>
        </div>
        {groups.map((group) => (
          <React.Fragment key={group.kind}>
            <div className={styles.groupLabel}>{group.label}</div>
            {SKILLS.filter((s) => s.kind === group.kind).map((skill) => (
              <div
                key={skill.name}
                className={`${styles.row} ${hover === skill.name ? styles.rowHover : ''}`}
                onMouseEnter={() => setHover(skill.name)}
                onMouseLeave={() => setHover(null)}
              >
                <span className={styles.name}>{skill.name}</span>
                <span className={styles.barCell}>
                  <span className={styles.track}>
                    <span
                      className={styles.bar}
                      style={{ width: `${(skill.mastery / 10) * 100}%` }}
                    />
                  </span>
                  <span className={styles.value}>{skill.mastery}</span>
                </span>
                <span className={styles.barCell}>
                  <span className={styles.track}>
                    <span
                      className={`${styles.bar} ${styles.barYears}`}
                      style={{ width: `${(skill.years / MAX_YEARS) * 100}%` }}
                    />
                  </span>
                  <span className={styles.value}>{skill.years}</span>
                </span>
                <span className={styles.whereCell}>
                  {ORDER.map((d) => {
                    const on = skill.where.includes(d);
                    return (
                      <span
                        key={d}
                        className={styles.whereDot}
                        title={on ? DISCIPLINES[d].label : undefined}
                        style={
                          on
                            ? { background: DISCIPLINES[d].color, borderColor: DISCIPLINES[d].color }
                            : undefined
                        }
                      />
                    );
                  })}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
        <div className={styles.phoneKey}>
          {ORDER.map((d) => (
            <span key={d} className={styles.whereKey}>
              <span className={styles.swatch} style={{ background: DISCIPLINES[d].color }} />
              {DISCIPLINES[d].label}
            </span>
          ))}
        </div>
      </div>
      <SrTable />
    </figure>
  );
};
