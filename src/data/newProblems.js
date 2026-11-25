import { practiceForUnit } from './practiceBank';

/* ══════════════════════════════════════════════════════════════
   "Newly added" problems in each module's Problem tab.
   DEMO rule: in every subject, the last problem of the 1st and 3rd
   units counts as newly added (so each module has a few). Replace
   with real "added" dates from the question bank when available.
   The same rule feeds the top-bar notifications, so counts match.
   ══════════════════════════════════════════════════════════════ */

export const NEW_PROBLEMS_ADDED = '2026-11-20';
const NEW_UNIT_POSITIONS = [0, 2];

/* ids of the newly added items among one unit's practice items */
export const newInUnit = (subject, unit, items) => {
  const pos = subject.units.indexOf(unit);
  if (!NEW_UNIT_POSITIONS.includes(pos) || !items.length) return new Set();
  return new Set([items[items.length - 1].id]);
};

/* how many newly added problems a module has (for this plan's view of it) */
export const newInModule = (mod, isExtFor = () => false) => mod.subjects.reduce((n, s) => (
  n + s.units.reduce((m, u) => m + newInUnit(s, u, practiceForUnit(mod, u, isExtFor(s))).size, 0)
), 0);
