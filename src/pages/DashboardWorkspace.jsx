import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ChevronDown, ChevronLeft, ChevronUp, CircleCheck, Clock, Code, GripVertical, Lightbulb, Play, RotateCcw, Sparkles
} from 'lucide-react';
import { findModule, isExtendedPlan, moduleUnlocked } from '../data/learnerModules';
import { LANGUAGES, WORKSPACE_KINDS, findPracticeItem, starterCode } from '../data/practiceBank';
import { LevelBadge } from './DashboardModuleView';

/* ══════════════════════════════════════════════════════════════
   Coding workspace — /dashboard/m/:moduleId/practice/:itemId
   Problem (left) · editor + test cases (right), draggable divider.
   No judge is connected yet: Run shows the sample cases with their
   expected output, Submit records a demo submission and marks solved.
   ══════════════════════════════════════════════════════════════ */

const CODE_KEY = 'cs_demo_code';
const SUBS_KEY = 'cs_demo_submissions';
const readJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };

const KIND_TITLE = { coding: 'Problem', debugging: 'Debugging', vibe: 'Vibe Coding', sql: 'SQL' };

const DashboardWorkspace = ({ ctx }) => {
  const { moduleId, itemId } = useParams();
  const { planId, progress, set } = ctx;
  const mod = findModule(moduleId);
  const isExt = isExtendedPlan(planId) && mod?.tier !== 'core';
  const found = mod ? findPracticeItem(mod, itemId, isExt) : null;
  const item = found?.item;

  const langs = item?.kind === 'coding' ? LANGUAGES : [{ id: item?.language, label: (item?.language || '').toUpperCase() }];
  const [lang, setLang] = useState(langs[0]?.id);
  const codeKey = `${itemId}::${lang}`;
  const [code, setCode] = useState(() => (item ? readJSON(CODE_KEY)[codeKey] ?? starterCode(item, lang) : ''));
  const [leftTab, setLeftTab] = useState('problem');
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState('cases');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [subs, setSubs] = useState(() => readJSON(SUBS_KEY)[itemId] || []);
  const [leftPct, setLeftPct] = useState(44);

  const splitRef = useRef(null);
  const gutterRef = useRef(null);
  const taRef = useRef(null);

  // Persist code per problem + language
  useEffect(() => {
    if (!item) return;
    const all = readJSON(CODE_KEY);
    all[codeKey] = code;
    writeJSON(CODE_KEY, all);
  }, [code, codeKey, item]);

  /* ── draggable divider ── */
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    const box = splitRef.current?.getBoundingClientRect();
    if (!box) return;
    const move = (ev) => {
      const pct = ((ev.clientX - box.left) / box.width) * 100;
      setLeftPct(Math.min(70, Math.max(26, pct)));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.cursor = '';
    };
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, []);

  if (!mod) return <Navigate to="/dashboard" replace />;
  if (!moduleUnlocked(mod, planId, ctx.devTrack)) return <Navigate to={`/dashboard/m/${mod.id}`} replace />;
  if (!item || !WORKSPACE_KINDS.includes(item.kind)) return <Navigate to={`/dashboard/m/${mod.id}?tab=practice`} replace />;

  const solved = !!progress.practice[item.id];
  const lines = code.split('\n').length;
  const backTo = `/dashboard/m/${mod.id}?tab=practice`;

  const switchLang = (next) => {
    setLang(next);
    setCode(readJSON(CODE_KEY)[`${itemId}::${next}`] ?? starterCode(item, next));
    setResult(null);
  };

  const reset = () => { setCode(starterCode(item, lang)); setResult(null); };

  // Tab inserts 4 spaces instead of leaving the editor
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: en } = el;
    const next = `${code.slice(0, s)}    ${code.slice(en)}`;
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  const run = () => {
    setConsoleOpen(true);
    setConsoleTab('result');
    setResult({ type: 'run' });
  };

  const submit = () => {
    const entry = { at: new Date().toISOString(), lang, status: 'Submitted' };
    const next = [entry, ...subs].slice(0, 20);
    setSubs(next);
    const all = readJSON(SUBS_KEY);
    all[itemId] = next;
    writeJSON(SUBS_KEY, all);
    set('practice', item.id, true);
    setConsoleOpen(true);
    setConsoleTab('result');
    setResult({ type: 'submit' });
  };

  const examples = item.examples || [];

  return (
    <div className="dx-ws" ref={splitRef} style={{ '--ws-left': `${leftPct}%` }}>
      {/* ── Left: problem / submissions ── */}
      <section className="dx-ws-left">
        <div className="dx-ws-tabs">
          <Link to={backTo} className="dx-icon-btn" aria-label="Back to practice"><ChevronLeft size={18} /></Link>
          <button type="button" className={`dx-ws-tab ${leftTab === 'problem' ? 'active' : ''}`} onClick={() => setLeftTab('problem')}>
            <Code size={16} /> {KIND_TITLE[item.kind]}
          </button>
          <button type="button" className={`dx-ws-tab ${leftTab === 'subs' ? 'active' : ''}`} onClick={() => setLeftTab('subs')}>
            <Clock size={16} /> Submissions{subs.length > 0 && <span className="dx-count">{subs.length}</span>}
          </button>
        </div>

        <div className="dx-ws-scroll">
          {leftTab === 'problem' ? (
            <article className="dx-problem">
              <nav className="dx-crumbs" aria-label="Breadcrumb">
                <Link to="/dashboard">Dashboard</Link><span>/</span>
                <Link to={backTo}>{mod.title}</Link><span>/</span>
                <Link to={backTo}>{found.unit.title}</Link><span>/</span>
                <strong>{item.title}</strong>
              </nav>

              <div className="dx-problem-head">
                <h1>{item.title}</h1>
                <LevelBadge level={item.level} />
              </div>
              <div className="dx-tags dx-problem-tags">
                {solved && <span className="dx-tag dx-tag-ok"><CircleCheck size={13} /> Solved</span>}
                {(item.companies || []).map((c) => <span key={c} className="dx-tag">{c}</span>)}
              </div>

              <p className="dx-statement">{item.statement}</p>

              {item.kind === 'sql' && (
                <div className="dx-example">
                  <h3>Tables</h3>
                  <code className="dx-mono">{item.schema}</code>
                </div>
              )}

              {item.kind === 'vibe' && (
                <div className="dx-callout">
                  <Sparkles size={16} />
                  <span>Describe what you want, let the AI assistant draft it, then review and refine the code yourself. You're graded on the final result and how you steered it.</span>
                </div>
              )}

              {examples.map((exm, i) => (
                <div key={i} className="dx-example">
                  <h3>Example {i + 1}:</h3>
                  <div className="dx-example-box">
                    <p><strong>Input:</strong><br /><code className="dx-mono">{exm.input}</code></p>
                    <p><strong>Output:</strong><br /><code className="dx-mono">{exm.output}</code></p>
                    {exm.explanation && <p><strong>Explanation:</strong><br />{exm.explanation}</p>}
                  </div>
                </div>
              ))}

              {item.constraints?.length > 0 && (
                <div className="dx-example">
                  <h3>Constraints:</h3>
                  <ul className="dx-constraints">
                    {item.constraints.map((c) => <li key={c}><code className="dx-mono">{c}</code></li>)}
                  </ul>
                </div>
              )}

              {item.hint && (
                <div className="dx-example">
                  <button type="button" className="dx-hint-btn" onClick={() => setShowHint((v) => !v)}>
                    <Lightbulb size={15} /> {showHint ? 'Hide hint' : 'Show hint'}
                  </button>
                  {showHint && <p className="dx-hint">{item.hint}</p>}
                </div>
              )}
            </article>
          ) : (
            <div className="dx-subs">
              {subs.length === 0 ? (
                <p className="dx-muted">No submissions yet. Submit your code to see it here.</p>
              ) : (
                <table className="dx-ptable">
                  <thead><tr><th scope="col">Status</th><th scope="col">Language</th><th scope="col">Submitted</th></tr></thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.at}>
                        <td><span className="dx-tag dx-tag-ok"><CircleCheck size={13} /> {s.status}</span></td>
                        <td>{(LANGUAGES.find((l) => l.id === s.lang) || { label: s.lang.toUpperCase() }).label}</td>
                        <td className="dx-muted">{new Date(s.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div
        className="dx-ws-divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        tabIndex={0}
        onPointerDown={onDragStart}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setLeftPct((p) => Math.max(26, p - 3));
          if (e.key === 'ArrowRight') setLeftPct((p) => Math.min(70, p + 3));
        }}
      >
        <GripVertical size={14} />
      </div>

      {/* ── Right: editor ── */}
      <section className="dx-ws-right">
        <div className="dx-ws-toolbar">
          <div className="dx-select">
            <select value={lang} onChange={(e) => switchLang(e.target.value)} disabled={langs.length === 1} aria-label="Language">
              {langs.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            {langs.length > 1 && <ChevronDown size={15} />}
          </div>
          <span className="dx-spacer" />
          <button type="button" className="dx-icon-btn" onClick={reset} aria-label="Reset code" title="Reset to starter code"><RotateCcw size={16} /></button>
          <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={run}><Play size={14} /> Run Code</button>
          <button type="button" className="dx-btn dx-btn-primary dx-btn-sm" onClick={submit}>Submit</button>
        </div>

        <div className="dx-editor">
          <div className="dx-gutter" ref={gutterRef} aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          <textarea
            ref={taRef}
            className="dx-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop; }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Code editor"
          />
        </div>

        <div className={`dx-console ${consoleOpen ? 'open' : ''}`}>
          <div className="dx-console-head">
            <button type="button" className={`dx-console-tab ${consoleTab === 'cases' ? 'active' : ''}`} onClick={() => { setConsoleTab('cases'); setConsoleOpen(true); }}>Test Cases</button>
            <button type="button" className={`dx-console-tab ${consoleTab === 'result' ? 'active' : ''}`} onClick={() => { setConsoleTab('result'); setConsoleOpen(true); }}>Result</button>
            <span className="dx-spacer" />
            <button type="button" className="dx-icon-btn" onClick={() => setConsoleOpen((v) => !v)} aria-label={consoleOpen ? 'Collapse console' : 'Expand console'}>
              {consoleOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          {consoleOpen && (
            <div className="dx-console-body">
              {consoleTab === 'cases' ? (
                examples.length ? examples.map((exm, i) => (
                  <div key={i} className="dx-case">
                    <span className="dx-case-label">Case {i + 1}</span>
                    <code className="dx-mono">{exm.input}</code>
                  </div>
                )) : <p className="dx-muted dx-small">This task has no sample cases. Use Run to check your changes.</p>
              ) : !result ? (
                <p className="dx-muted dx-small">Run or submit your code to see the result here.</p>
              ) : (
                <>
                  <div className="dx-demo-note">
                    {result.type === 'run'
                      ? 'Code execution isn’t connected yet, so your code wasn’t run. Expected output for the sample cases:'
                      : 'Submission saved and marked as solved. Code isn’t judged yet in this demo.'}
                  </div>
                  {result.type === 'run' && examples.map((exm, i) => (
                    <div key={i} className="dx-case">
                      <span className="dx-case-label">Case {i + 1} · expected</span>
                      <code className="dx-mono">{exm.output}</code>
                    </div>
                  ))}
                  {result.type === 'submit' && (
                    <p className="dx-submit-ok"><CircleCheck size={16} /> Submitted · {(LANGUAGES.find((l) => l.id === lang) || { label: lang.toUpperCase() }).label}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardWorkspace;
