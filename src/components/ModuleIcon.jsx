import { Layers } from 'lucide-react';
import { MODULE_ICONS } from '../data/moduleIcons';

/* ══════════════════════════════════════════════════════════════
   A dashboard module's icon (sidebar, module cards, module header).
   Sub-sections such as DSA Basics / Advanced or the MERN / JFS
   tracks of Development live inside their module, so no badges.
   ══════════════════════════════════════════════════════════════ */

const ModuleIcon = ({ mod, size = 18 }) => {
  const Icon = MODULE_ICONS[mod.icon] || Layers;
  return <Icon size={size} />;
};

export default ModuleIcon;
