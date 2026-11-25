/* Segmented pillar progress (Lectures · Problem · Test …): one short bar per pillar
   plus a coloured legend. Same look as the module page header (.dx-pp styles). */
const PillarBar = ({ parts, overall, compact = false }) => (
  <div className={`dx-pp ${compact ? 'dx-pp-compact' : ''}`} aria-label={`Overall ${overall}%: ${parts.map((x) => `${x.label} ${x.done} of ${x.total}`).join(', ')}`}>
    <span className="dx-pp-overall">{overall}%</span>
    <div className="dx-pp-bar" aria-hidden="true">
      {parts.map((x) => (
        <span key={x.key} className={`dx-pp-seg is-${x.key}`} title={`${x.label}: ${x.done}/${x.total}`}><i style={{ width: `${x.pct}%` }} /></span>
      ))}
    </div>
    <div className="dx-pp-legend" aria-hidden="true">
      {parts.map((x) => (
        <span key={x.key} className={`is-${x.key}`}><b />{x.label} {x.done}/{x.total}</span>
      ))}
    </div>
  </div>
);

export default PillarBar;
