import { Atom, Coffee, Layers, Plus } from 'lucide-react';
import { MODULE_ICONS } from '../data/moduleIcons';

/* ══════════════════════════════════════════════════════════════
   Module icon with an optional corner badge, so related modules
   share a base icon and the badge tells them apart:
   • DSA            → DSA icon
   • DSA Advanced   → DSA icon + "+"
   • MERN / JFS     → development icon + React atom / Java cup
   Used in the sidebar, module cards and module headers.
   ══════════════════════════════════════════════════════════════ */

const BADGES = {
  'dsa-advanced': { Icon: Plus, kind: 'plus', label: 'Advanced' },
  mern: { Icon: Atom, kind: 'mern', label: 'MERN' },
  jfs: { Icon: Coffee, kind: 'jfs', label: 'JFS' }
};

const ModuleIcon = ({ mod, size = 18 }) => {
  const Icon = MODULE_ICONS[mod.icon] || Layers;
  const badge = BADGES[mod.id];
  if (!badge) return <Icon size={size} />;
  const b = Math.max(7, Math.round(size * 0.42)); // badge glyph size; the circle is b + 4
  return (
    <span className="dx-micon" title={badge.label}>
      <Icon size={size} />
      <span className={`dx-micon-badge dx-micon-${badge.kind}`} style={{ '--b': `${b + 4}px` }} aria-hidden="true">
        <badge.Icon size={b} strokeWidth={badge.kind === 'plus' ? 3.5 : 2.5} />
      </span>
    </span>
  );
};

export default ModuleIcon;
