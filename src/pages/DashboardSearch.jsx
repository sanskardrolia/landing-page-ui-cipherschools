import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CircleCheck, CirclePlay, ClipboardCheck, Clock, CornerDownLeft, FolderOpen, LayoutGrid, ListChecks, Lock,
  Mic, Search, Sparkles, X
} from 'lucide-react';
import ModuleIcon from '../components/ModuleIcon';
import {
  allLectures, moduleUnlocked, subjectExtended, subjectInterview, subjectLectures, subjectTests
} from '../data/learnerModules';
import { WORKSPACE_KINDS, practiceForUnit } from '../data/practiceBank';
import { stageTests } from '../data/testBank';
import { previewFree } from '../utils/previewAccess';

/* ══════════════════════════════════════════════════════════════
   Universal dashboard search (opens with Cmd/Ctrl + F).
   Searches everything the learner's plan includes, in the four
   pillars every module has: Content (lectures), Practice, Test and
   Mock interview. A module or section that matches the query gets a
   focus card with those four pillars; filters narrow to one pillar;
   when nothing matches, it suggests the closest words instead.
   ══════════════════════════════════════════════════════════════ */

const PILLARS = [
  { id: 'content', label: 'Lectures', tab: 'watch', Icon: CirclePlay },
  { id: 'practice', label: 'Practice', tab: 'practice', Icon: ListChecks },
  { id: 'test', label: 'Test', tab: 'test', Icon: ClipboardCheck },
  { id: 'mock', label: 'Mock', tab: 'interview', Icon: Mic }
];
const FILTERS = [{ id: 'all', label: 'All', Icon: LayoutGrid }, ...PILLARS];
const PILLAR_IDS = PILLARS.map((p) => p.id);
const PILLAR_NOUN = { content: ['lecture', 'lectures'], practice: ['item', 'items'], test: ['test', 'tests'], mock: ['round', 'rounds'] };
const plural = (n, [one, many]) => `${n} ${n === 1 ? one : many}`;
const GROUP_LABEL = { module: 'Modules', section: 'Sections', content: 'Lectures', practice: 'Practice', test: 'Tests', mock: 'Mock interviews' };
const GROUP_ORDER = ['module', 'section', 'content', 'practice', 'test', 'mock'];
const KIND_ICON = { section: FolderOpen, content: CirclePlay, practice: ListChecks, test: ClipboardCheck, mock: Mic };
const HINTS = ['arrays', 'os', 'sql joins'];

const RECENT_KEY = 'cs_dash_recent_search';
const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; } };
const saveRecent = (q) => {
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* storage blocked */ }
};

const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9+#\s]/g, ' ').replace(/\s+/g, ' ').trim();
const acronym = (title) => title.split(/[\s&/]+/).filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).join('').toLowerCase();

/* ── Index: one entry per searchable thing, ids match the module pages ── */
const buildIndex = (ctx) => {
  const out = [];
  const mods = ctx.preview ? ctx.modules : ctx.modules.filter((m) => moduleUnlocked(m, ctx.planId, ctx.devTrack));
  const base = (m) => `/dashboard/m/${m.id}`;

  mods.forEach((mod) => {
    const modKeys = `${mod.title} ${mod.short} ${acronym(mod.title)}`;
    out.push({ key: `m:${mod.id}`, kind: 'module', mod, title: mod.title, sub: mod.short, to: base(mod), hay: norm(modKeys) });
    const seen = new Set();

    mod.subjects.forEach((subj) => {
      const many = mod.subjects.length > 1;
      const where = many ? `${mod.title} · ${subj.title}` : mod.title;
      const ctxKeys = norm(`${modKeys} ${many ? `${subj.title} ${acronym(subj.title)}` : ''}`);
      const q = `?subject=${subj.id}`;
      const isExt = subjectExtended(ctx.extended, mod, subj);
      const free = ctx.preview ? previewFree(mod, subj, isExt) : null;
      const locked = (id) => !!free && !free.has(id);
      // `unit` joins the search context, so "sql joins" finds the Joins lecture in the SQL unit
      const add = (e, unit = '') => { if (!seen.has(e.key)) { seen.add(e.key); out.push({ mod, subj, ...e, hay: norm(e.title), ctxHay: unit ? `${ctxKeys} ${norm(unit)}` : ctxKeys }); } };

      if (many) {
        out.push({ key: `s:${mod.id}:${subj.id}`, kind: 'section', mod, subj, title: subj.title, sub: mod.title, to: `${base(mod)}${q}`, hay: norm(`${subj.title} ${acronym(subj.title)} ${subj.short || ''}`), ctxHay: norm(modKeys) });
      }
      subj.units.forEach((u) => {
        u.lectures.forEach((l) => add({
          key: `l:${l.id}`, kind: 'content', title: l.title, sub: `${where} · ${u.title}`, meta: `${l.mins} min`,
          to: `${base(mod)}/watch/${l.id}`, doneKey: ['watched', l.id], locked: locked(l.id)
        }, u.title));
        practiceForUnit(mod, u, isExt).forEach((p) => add({
          key: `p:${p.id}`, kind: 'practice', title: p.title, sub: `${where} · ${u.title}`,
          meta: [p.level, ...(p.companies || []).slice(0, 2)].filter(Boolean).join(' · '),
          to: WORKSPACE_KINDS.includes(p.kind) ? `${base(mod)}/practice/${p.id}` : `${base(mod)}?tab=practice&subject=${subj.id}`,
          doneKey: ['practice', p.id], locked: locked(p.id)
        }, u.title));
      });
      stageTests(mod, subj).forEach((t) => add({
        key: `t:${t.id}`, kind: 'test', title: t.name, sub: where, meta: `${t.testType} · ${t.mins} min`,
        to: `${base(mod)}?tab=test&subject=${subj.id}`, locked: locked(t.id)
      }, t.unit?.title));
      subjectTests(mod, subj).forEach((t) => {
        const id = `${mod.id}:${t.kind}:${t.perSubject ? subj.id : 'module'}`;
        add({ key: `t:${id}`, kind: 'test', title: t.perSubject && many ? `${subj.title} · ${t.label}` : t.label, sub: where, meta: `${t.mins} min`, to: `${base(mod)}?tab=test&subject=${subj.id}`, locked: locked(id) });
      });
      const iv = subjectInterview(mod, subj);
      if (iv) {
        const scope = iv.perSubject ? subj.id : 'module';
        const rounds = isExt ? 2 : 1;
        for (let r = 1; r <= rounds; r++) {
          const id = `${mod.id}:interview:${scope}:${r}`;
          add({ key: `i:${id}`, kind: 'mock', title: `${iv.label}${rounds > 1 ? ` · Round ${r}` : ''}`, sub: iv.perSubject ? where : mod.title, meta: `${iv.mins} min`, to: `${base(mod)}?tab=interview&subject=${subj.id}`, locked: locked(id) });
        }
      }
    });
  });
  return out;
};

/* ── Scoring: every word must match the title or where it lives ── */
const isSubseq = (needle, hay) => { let i = 0; for (const c of hay) if (c === needle[i]) i++; return i === needle.length; };
const scoreEntry = (e, tokens) => {
  let total = 0;
  for (const t of tokens) {
    const words = e.hay.split(' ');
    let s = 0;
    if (e.hay.startsWith(t)) s = 30;
    else if (words.some((w) => w.startsWith(t))) s = 20;
    else if (e.hay.includes(t)) s = 12;
    else if (e.ctxHay && e.ctxHay.split(' ').some((w) => w.startsWith(t))) s = 7;
    // Loose match: the letters in order inside one word of similar length (e.g. "progrmming")
    else if (t.length >= 4 && words.some((w) => w.length <= t.length + 3 && isSubseq(t, w))) s = 3;
    if (!s) return 0;
    total += s;
  }
  const kindBoost = { module: 24, section: 16 }[e.kind] || 0;
  // A query that is exactly a name's abbreviation ("cn", "os", "dsa") points at that name
  const abbr = tokens.length === 1 && (e.kind === 'module' || e.kind === 'section') && acronym(e.title) === tokens[0] ? 30 : 0;
  return total + kindBoost + abbr - Math.min(10, e.title.length / 12);
};

/* ── "Did you mean": closest index word per typed word ── */
const lev = (a, b) => {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
};

const Highlight = ({ text, tokens }) => {
  if (!tokens.length) return text;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>));
};

const DashboardSearch = ({ ctx, onClose, initialQuery = '' }) => {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState(readRecent);
  // A new query or filter starts the highlight at the top again
  const setQuery = (v) => { setQ(v); setActive(0); };
  const chooseFilter = (f) => { setFilter(f); setActive(0); };
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Built once per opening (the dashboard context is a new object every render)
  const [index] = useState(() => buildIndex(ctx));
  const vocab = useMemo(() => {
    const words = new Set();
    index.forEach((e) => e.hay.split(' ').forEach((w) => { if (w.length >= 3) words.add(w); }));
    index.filter((e) => e.kind === 'module').forEach((e) => words.add(acronym(e.title)));
    return [...words];
  }, [index]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const tokens = useMemo(() => norm(q).split(' ').filter(Boolean), [q]);

  /* Results + focus (a module or section the whole query points at) */
  const view = useMemo(() => {
    if (!tokens.length) return { mode: 'empty' };
    const scored = index
      .map((e) => ({ e, s: scoreEntry(e, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);

    const top = scored[0]?.e;
    const container = top && (top.kind === 'module' || top.kind === 'section')
      && tokens.every((t) => `${top.hay} ${top.ctxHay || ''}`.split(' ').some((w) => w.startsWith(t)))
      ? top : null;

    if (container) {
      const inScope = (e) => e.mod.id === container.mod.id && (!container.subj || e.subj?.id === container.subj.id);
      const items = index.filter((e) => PILLAR_IDS.includes(e.kind) && inScope(e) && (filter === 'all' || e.kind === filter));
      const counts = Object.fromEntries(PILLARS.map((p) => [p.id, index.filter((e) => e.kind === p.id && inScope(e)).length]));
      return { mode: 'focus', focus: container, counts, items, related: scored.filter((x) => x.e !== container && (x.e.kind === 'module' || x.e.kind === 'section')).slice(0, 3).map((x) => x.e) };
    }

    const list = scored.map((x) => x.e).filter((e) => filter === 'all' || e.kind === filter);
    if (!list.length) {
      // Smart suggestion: swap each word for the closest word in the catalogue
      const fixed = tokens.map((t) => {
        if (vocab.includes(t)) return t;
        let best = t;
        let bestD = Math.max(1, Math.floor(t.length / 3)) + 1;
        vocab.forEach((w) => {
          if (Math.abs(w.length - t.length) > 3) return;
          const d = lev(t, w);
          if (d < bestD) { bestD = d; best = w; }
        });
        return best;
      });
      const didYouMean = fixed.join(' ') !== tokens.join(' ') ? fixed.join(' ') : null;
      const elsewhere = filter !== 'all' ? scored.length : 0;
      return { mode: 'none', didYouMean, elsewhere };
    }
    return { mode: 'results', list };
  }, [tokens, index, filter, vocab]);

  /* Groups as rendered, and the flat list keyboard navigation walks */
  const groups = useMemo(() => {
    if (view.mode === 'focus') {
      return PILLARS.map((p) => ({ kind: p.id, items: view.items.filter((e) => e.kind === p.id).slice(0, filter === 'all' ? 3 : 40) }))
        .filter((g) => g.items.length);
    }
    if (view.mode !== 'results') return [];
    return GROUP_ORDER.map((kind) => {
      const all = view.list.filter((e) => e.kind === kind);
      return { kind, items: all.slice(0, filter === 'all' ? 5 : 50), more: filter === 'all' ? Math.max(0, all.length - 5) : 0 };
    }).filter((g) => g.items.length);
  }, [view, filter]);
  const flat = useMemo(() => [
    ...(view.mode === 'focus' ? [view.focus] : []),
    ...groups.flatMap((g) => g.items),
    ...(view.mode === 'focus' ? view.related : [])
  ], [view, groups]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (e) => {
    if (!e) return;
    if (q.trim()) saveRecent(q.trim());
    onClose();
    if (e.locked) { ctx.lockedTap({ ...e.mod, tier: e.subj?.tier || e.mod.tier, track: e.subj?.track }); return; }
    navigate(e.to);
  };
  const goPillar = (focus, pillar) => {
    if (q.trim()) saveRecent(q.trim());
    onClose();
    navigate(`/dashboard/m/${focus.mod.id}?tab=${pillar.tab}${focus.subj ? `&subject=${focus.subj.id}` : ''}`);
  };

  const onKeyDown = (ev) => {
    if (ev.key === 'Escape') { ev.preventDefault(); onClose(); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); go(flat[active]); }
    else if (ev.key === 'Tab' && tokens.length) { // filters only show while typing
      ev.preventDefault();
      const i = FILTERS.findIndex((f) => f.id === filter);
      chooseFilter(FILTERS[(i + (ev.shiftKey ? -1 : 1) + FILTERS.length) % FILTERS.length].id);
    }
  };

  const done = (e) => e.doneKey && !!ctx.progress[e.doneKey[0]]?.[e.doneKey[1]];
  const idxOf = (e) => flat.indexOf(e);

  const Row = ({ e }) => {
    const Icon = KIND_ICON[e.kind];
    const i = idxOf(e);
    return (
      <li>
        <button
          type="button"
          data-idx={i}
          className={`dx-sr-item ${i === active ? 'is-active' : ''} ${e.locked ? 'is-locked' : ''}`}
          onMouseMove={() => setActive(i)}
          onClick={() => go(e)}
        >
          <span className={`dx-sr-icon dx-sr-${e.kind}`}>{e.kind === 'module' ? <ModuleIcon mod={e.mod} size={16} /> : <Icon size={15} />}</span>
          <span className="dx-sr-text">
            <span className="dx-sr-title"><Highlight text={e.title} tokens={tokens} /></span>
            <span className="dx-sr-sub">{e.sub}</span>
          </span>
          {e.meta && <span className="dx-sr-meta">{e.meta}</span>}
          {done(e) && <CircleCheck size={15} className="dx-sr-done" aria-label="Done" />}
          {e.locked ? <Lock size={14} className="dx-sr-lock" aria-label="Locked" /> : <CornerDownLeft size={14} className="dx-sr-enter" aria-hidden="true" />}
        </button>
      </li>
    );
  };

  const modules = index.filter((e) => e.kind === 'module');

  return (
    <div className="dx-sr-backdrop" onMouseDown={onClose} data-free>
      <div className="dx-cmd" role="dialog" aria-modal="true" aria-label="Search the dashboard" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="dx-sr-head">
          <Search size={18} className="dx-sr-glass" />
          <input
            ref={inputRef}
            className="dx-sr-input"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, lectures, practice, tests, mock interviews…"
            aria-label="Search"
            spellCheck={false}
            autoComplete="off"
          />
          {q && <button type="button" className="dx-sr-clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear"><X size={15} /></button>}
          <kbd className="dx-sr-esc">Esc</kbd>
        </div>

        {/* Pillar filters only once there's something to filter */}
        {tokens.length > 0 && (
        <div className="dx-sr-filters" role="tablist" aria-label="Filter by pillar">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className={filter === f.id ? 'active' : ''} onClick={() => { chooseFilter(f.id); inputRef.current?.focus(); }}>
              <f.Icon size={14} /> {f.label}
            </button>
          ))}
        </div>
        )}

        <div className="dx-sr-body" ref={listRef}>
          {/* Before typing: just a few light shortcuts */}
          {view.mode === 'empty' && (
            <div className="dx-sr-start">
              {recent.length > 0 && (
                <section className="dx-sr-group">
                  <h3>Recent <button type="button" className="dx-sr-link" onClick={() => { try { localStorage.removeItem(RECENT_KEY); } catch { /* blocked */ } setRecent([]); }}>Clear</button></h3>
                  <ul className="dx-sr-list">
                    {recent.slice(0, 3).map((r) => (
                      <li key={r}>
                        <button type="button" className="dx-sr-item dx-sr-recent" onClick={() => setQuery(r)}>
                          <Clock size={14} className="dx-sr-recent-icon" />
                          <span className="dx-sr-title">{r}</span>
                          <CornerDownLeft size={13} className="dx-sr-enter" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="dx-sr-group">
                <h3>Modules</h3>
                <div className="dx-sr-chips">
                  {modules.map((m) => (
                    <button key={m.key} type="button" className="dx-sr-chip dx-sr-modchip" onClick={() => setQuery(m.title)}>
                      <ModuleIcon mod={m.mod} size={13} /> {m.title}
                    </button>
                  ))}
                </div>
              </section>
              <p className="dx-sr-hint">
                Try {HINTS.map((h, i) => (
                  <Fragment key={h}>
                    <button type="button" onClick={() => setQuery(h)}>{h}</button>{i < HINTS.length - 2 ? ', ' : i === HINTS.length - 2 ? ' or ' : ''}
                  </Fragment>
                ))}
                . Search finds lectures, practice, tests and mock interviews.
              </p>
            </div>
          )}

          {view.mode === 'focus' && (
            <>
              <button
                type="button"
                data-idx={0}
                className={`dx-sr-focus ${active === 0 ? 'is-active' : ''}`}
                onMouseMove={() => setActive(0)}
                onClick={() => go(view.focus)}
              >
                <span className="dx-sr-focus-icon"><ModuleIcon mod={view.focus.mod} size={22} /></span>
                <span className="dx-sr-text">
                  <span className="dx-sr-kicker">{view.focus.kind === 'section' ? `Section of ${view.focus.mod.title}` : 'Module'}</span>
                  <span className="dx-sr-focus-title"><Highlight text={view.focus.title} tokens={tokens} /></span>
                  <span className="dx-sr-sub">
                    {view.focus.kind === 'section'
                      ? `${view.focus.subj.units.length} units · ${subjectLectures(view.focus.subj).length} lectures`
                      : `${view.focus.mod.short} · ${allLectures(view.focus.mod).length} lectures`}
                  </span>
                </span>
                <span className="dx-sr-open">Open <ArrowRight size={14} /></span>
              </button>
              <div className="dx-sr-pillars">
                {PILLARS.map((p) => (
                  <button key={p.id} type="button" className={`dx-sr-pillar dx-sr-${p.id}`} onClick={() => goPillar(view.focus, p)}>
                    <span className="dx-sr-pillar-icon"><p.Icon size={18} /></span>
                    <strong>{p.label}</strong>
                    <span>{plural(view.counts[p.id], PILLAR_NOUN[p.id])}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {groups.map((g) => (
            <section key={g.kind} className="dx-sr-group">
              <h3>
                {GROUP_LABEL[g.kind]}
                {g.more > 0 && <button type="button" className="dx-sr-link" onClick={() => chooseFilter(g.kind)}>Show all {g.items.length + g.more}</button>}
              </h3>
              <ul className="dx-sr-list">{g.items.map((e) => <Row key={e.key} e={e} />)}</ul>
            </section>
          ))}

          {view.mode === 'focus' && view.related.length > 0 && (
            <section className="dx-sr-group">
              <h3>Also matches</h3>
              <ul className="dx-sr-list">{view.related.map((e) => <Row key={e.key} e={e} />)}</ul>
            </section>
          )}

          {view.mode === 'none' && (
            <div className="dx-sr-empty">
              <Search size={22} />
              <p>No results for <strong>“{q.trim()}”</strong>{filter !== 'all' && <> in {FILTERS.find((f) => f.id === filter).label}</>}.</p>
              {view.didYouMean && (
                <button type="button" className="dx-sr-dym" onClick={() => setQuery(view.didYouMean)}>
                  <Sparkles size={14} /> Did you mean <strong>{view.didYouMean}</strong>?
                </button>
              )}
              {view.elsewhere > 0 && (
                <button type="button" className="dx-sr-link" onClick={() => chooseFilter('all')}>See {view.elsewhere} result{view.elsewhere === 1 ? '' : 's'} in All</button>
              )}
              <div className="dx-sr-chips dx-sr-chips-center">
                {modules.slice(0, 4).map((m) => <button key={m.key} type="button" className="dx-sr-chip" onClick={() => setQuery(m.title)}>{m.title}</button>)}
              </div>
            </div>
          )}
        </div>

        <footer className="dx-sr-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          {tokens.length > 0 && <span><kbd>Tab</kbd> filter</span>}
          <span><kbd>Esc</kbd> close</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardSearch;
