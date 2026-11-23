import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bot, Check, ChevronDown, ChevronRight, CircleCheck, Clock, FileCode2, FileText, Files, GitBranch,
  Info, Moon, Play, RotateCw, SquareCheck, Terminal, X
} from 'lucide-react';
import './CodingTestDemo.css';

/* ══════════════════════════════════════════════════════════════
   Home › Beyond lectures › "Vibe coding test": a compact,
   working mock of the test IDE. Task on the left, holds.js in the
   editor, AI Assistant / Preview / Test Cases on the right.
   Flow the visitor can click through:
     Send the prompt → the assistant drafts an edit → Insert →
     Run tests → 5/5 visible tests pass.
   Running before inserting shows the honest failure (501s).
   Auto-plays with a cursor once in view (loops); the first real
   click inside the mock hands control to the visitor.
   ══════════════════════════════════════════════════════════════ */

const STUB = [
  "import { HttpError } from '../errors.js';",
  '',
  'export const HOLD_DAYS = 3;',
  '',
  '/** A member places a hold on a book that has no copy to lend. */',
  'export async function placeHold(_db, _now, _user, _bookId) {',
  "  throw new HttpError(501, 'Holds are not implemented yet');",
  '}',
  '',
  '/** A member cancels their own waiting hold. */',
  'export async function cancelHold(_db, _user, _holdId) {',
  "  throw new HttpError(501, 'Holds are not implemented yet');",
  '}',
  '',
  "/** The signed-in member's waiting and ready holds, oldest first. */",
  'export async function myHolds(_db, _user) {',
  "  throw new HttpError(501, 'Holds are not implemented yet');",
  '}'
];

const DONE = [
  "import { HttpError } from '../errors.js';",
  '',
  'export const HOLD_DAYS = 3;',
  '',
  '/** A member places a hold on a book that has no copy to lend. */',
  'export async function placeHold(db, now, user, bookId) {',
  '  const book = await db.books.find(bookId);',
  "  if (!book) throw new HttpError(404, 'Book not found');",
  "  if (book.available > 0) throw new HttpError(409, 'A copy is on the shelf');",
  '  const mine = await db.holds.active(user.id, bookId);',
  "  if (mine) throw new HttpError(409, 'You already hold this book');",
  "  return db.holds.create({ userId: user.id, bookId, status: 'waiting', createdAt: now });",
  '}',
  '',
  '/** A member cancels their own waiting hold. */',
  'export async function cancelHold(db, user, holdId) {',
  '  const hold = await db.holds.find(holdId);',
  "  if (!hold || hold.userId !== user.id) throw new HttpError(404, 'Hold not found');",
  "  return db.holds.update(holdId, { status: 'cancelled' });",
  '}',
  '',
  "/** The signed-in member's waiting and ready holds, oldest first. */",
  'export async function myHolds(db, user) {',
  "  return db.holds.list({ userId: user.id, status: ['waiting', 'ready'], orderBy: 'createdAt' });",
  '}'
];
const CHANGED = new Set([5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23]);

const TESTS = [
  ['R1', 'POST /api/books/:id/holds places a hold'],
  ['R2', 'second hold on the same book is 409'],
  ['R3', 'queue position counts only active holds'],
  ['R4', "DELETE someone else's hold is 404"],
  ['R5', 'GET /api/me/holds, oldest first']
];

const PROMPT = 'Hold only when no copy is available (else 409), one active hold per member, queue by createdAt. Cancel only your own hold.';

/* tiny highlighter: comments, strings, keywords, numbers */
const KW = /^(import|from|export|const|async|function|throw|new|await|return|if)$/;
const tokens = (line) => {
  if (/^\s*\/\*\*/.test(line)) return [['cm', line]];
  const out = [];
  line.split(/('[^']*'|\b\d+\b|\b[A-Za-z_]+\b)/).forEach((t) => {
    if (!t) return;
    if (t.startsWith("'")) out.push(['str', t]);
    else if (/^\d+$/.test(t)) out.push(['num', t]);
    else if (KW.test(t)) out.push(['kw', t]);
    else if (/^[A-Z][A-Za-z]+$/.test(t)) out.push(['ty', t]);
    else out.push(['', t]);
  });
  return out;
};

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const CodingTestDemo = ({ compact = false }) => {
  const [left, setLeft] = useState('task');
  const [right, setRight] = useState('ai');
  const [chat, setChat] = useState('idle'); // idle → thinking → reply → inserted
  const [code, setCode] = useState('stub');
  const [run, setRun] = useState('none');   // none | running | fail | pass
  const [bottom, setBottom] = useState('terminal');
  const [secs, setSecs] = useState(59 * 60 + 27);
  const timers = useRef([]);
  const codeRef = useRef('stub');
  const boxRef = useRef(null);
  const runId = useRef(0);
  const [cursor, setCursor] = useState({ x: 70, y: 110, down: false, on: false });
  const [auto, setAuto] = useState(true);
  const chatRef = useRef(null);
  // keep the newest chat message in view
  useEffect(() => { const el = chatRef.current; if (el) el.scrollTop = el.scrollHeight; }, [chat, right]);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    const list = timers.current;
    return () => { clearInterval(t); list.forEach(clearTimeout); };
  }, []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const send = () => {
    setChat('thinking');
    later(() => setChat('reply'), 1300);
  };
  const insert = () => { codeRef.current = 'done'; setCode('done'); setChat('inserted'); setRun('none'); };
  const runTests = () => {
    setRun('running'); setRight('tests'); setBottom('output');
    later(() => setRun(codeRef.current === 'done' ? 'pass' : 'fail'), 1500);
  };
  const reset = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    codeRef.current = 'stub';
    setChat('idle'); setCode('stub'); setRun('none'); setRight('ai'); setBottom('terminal'); setLeft('task');
  };

  /* ── auto-play: a cursor sends, inserts and runs, then loops ── */
  const play = useCallback(async () => {
    const id = ++runId.current;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms)).then(() => runId.current === id);
    const box = boxRef.current;
    const goTo = async (sel) => {
      const el = box?.querySelector(sel);
      if (!el) return runId.current === id;
      const b = box.getBoundingClientRect(); const r = el.getBoundingClientRect();
      setCursor({ x: ((r.left + r.width * 0.55 - b.left) / b.width) * 100, y: ((r.top + r.height * 0.6 - b.top) / b.height) * 100, down: false, on: true });
      return wait(900);
    };
    const click = async (fn) => {
      setCursor((c) => ({ ...c, down: true })); if (!(await wait(160))) return false;
      fn(); setCursor((c) => ({ ...c, down: false })); return wait(200);
    };
    while (runId.current === id) {
      reset(); setCursor({ x: 60, y: 104, down: false, on: true });
      if (!(await wait(1400))) return;
      if (!(await goTo('[data-cur="send"]')) || !(await click(send)) || !(await wait(1700))) return;
      if (!(await goTo('[data-cur="insert"]')) || !(await click(insert)) || !(await wait(1300))) return;
      if (!(await goTo('[data-cur="run"]')) || !(await click(runTests)) || !(await wait(4600))) return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start when the mock scrolls into view; stop for good once the visitor takes over
  useEffect(() => {
    const el = boxRef.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!auto || !el || reduce) return undefined;
    let started = false;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; play(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); runId.current += 1; };
  }, [auto, play]);
  const takeOver = (e) => {
    if (!auto || !e.isTrusted) return;
    runId.current += 1; setAuto(false); setCursor((c) => ({ ...c, on: false }));
  };

  const lines = code === 'done' ? DONE : STUB;
  const passed = run === 'pass' ? 5 : 0;
  const nextHint = chat === 'idle' ? 'send' : chat === 'reply' ? 'insert' : code === 'done' && run !== 'pass' && run !== 'running' ? 'run' : '';

  return (
    <div className={`ctd ${compact ? 'is-compact' : ''}`} ref={boxRef} onPointerDownCapture={takeOver} aria-label="Vibe coding test, interactive mock">
      {/* top bar */}
      <div className="ctd-top">
        <span className="ctd-brand">Vibe Coding Test</span>
        <span className="ctd-timer"><Clock size={13} /> <span className="ctd-tl">Time left</span> <b>00:{fmt(secs)}</b></span>
        <span className="ctd-task">Task 1 of 1 · #CF-00236</span>
        <span className="ctd-gap" />
        <span className="ctd-conn"><i /> Connected</span>
        <span className="ctd-icon" aria-hidden="true"><Moon size={14} /></span>
        <button type="button" data-cur="run" className={`ctd-run ${nextHint === 'run' ? 'is-hint' : ''}`} onClick={() => run !== 'running' && runTests()}><Play size={12} /> Run Tests</button>
        <button type="button" className="ctd-save" onClick={reset} title="Start the demo again">Save &amp; Proceed</button>
      </div>

      <div className="ctd-main">
        {/* rail + left panel */}
        <nav className="ctd-rail" aria-hidden="true">
          <span className={left === 'task' ? 'is-on' : ''}><FileText size={15} /></span>
          <span className={left === 'files' ? 'is-on' : ''}><Files size={15} /></span>
          <span><GitBranch size={15} /></span>
          <span><SquareCheck size={15} /></span>
          <span><Terminal size={15} /></span>
        </nav>
        <aside className="ctd-left">
          <div className="ctd-tabs">
            {[['task', 'Task'], ['files', 'Files']].map(([k, l]) => (
              <button key={k} type="button" className={left === k ? 'is-on' : ''} onClick={() => setLeft(k)}>{l}</button>
            ))}
            <button type="button" disabled>Changes{code === 'done' && <em>1</em>}</button>
          </div>
          {left === 'task' ? (
            <div className="ctd-scroll ctd-taskbody">
              <h4>Place a hold on a checked-out book</h4>
              <span className="ctd-pill">Medium</span>
              <p><b>Ticket:</b> BL-210 · Priority: Medium</p>
              <p><b>Story:</b> As a member, I want to hold a book that&apos;s out so I&apos;m first in line when it comes back.</p>
              <p className="ctd-req-h">Requirements</p>
              <ul>
                <li><b>R1:</b> <code>POST /api/books/:id/holds</code> only when no copy is free; else 409.</li>
                <li><b>R2:</b> One active hold per member per book.</li>
                <li><b>R3:</b> Queue position counts active holds, first come first served.</li>
                <li><b>R4:</b> <code>DELETE /api/holds/:id</code> cancels your own hold; else 404.</li>
                <li><b>R5:</b> <code>GET /api/me/holds</code> lists your holds, oldest first.</li>
              </ul>
            </div>
          ) : (
            <div className="ctd-scroll ctd-tree">
              <p className="ctd-tree-h">Explorer</p>
              {[
                [0, 'dir', 'backend'], [1, 'dir', 'src'], [2, 'dir', 'controllers'], [3, 'js', 'holdsController.js'],
                [2, 'dir', 'repositories'], [3, 'js', 'books.js'], [3, 'js', 'holds.js'], [2, 'dir', 'services'],
                [3, 'js', 'holds.js', true], [3, 'js', 'loans.js'], [2, 'dir', 'routes'], [3, 'js', 'index.js'], [0, 'dir', 'frontend']
              ].map(([d, t, n, on], i) => (
                <span key={i} className={`ctd-file ${on ? 'is-on' : ''}`} style={{ '--d': d }}>
                  {t === 'dir' ? <ChevronDown size={12} /> : <em>JS</em>} {n}
                </span>
              ))}
            </div>
          )}
        </aside>

        {/* editor + terminal */}
        <section className="ctd-editor">
          <div className="ctd-filetab"><FileCode2 size={13} /> holds.js {code === 'done' && <i className="ctd-dirty" title="Changed" />}<X size={12} /></div>
          <div className="ctd-code ctd-scroll">
            {lines.map((l, i) => (
              <div key={`${code}-${i}`} className={`ctd-line ${code === 'done' && CHANGED.has(i) ? 'is-new' : ''}`} style={{ '--i': i }}>
                <span className="ctd-ln">{i + 1}</span>
                <code>{tokens(l).map(([c, t], k) => <span key={k} className={c ? `t-${c}` : undefined}>{t}</span>)}</code>
              </div>
            ))}
          </div>
          <div className="ctd-term">
            <div className="ctd-term-tabs">
              <button type="button" className={bottom === 'terminal' ? 'is-on' : ''} onClick={() => setBottom('terminal')}><Terminal size={12} /> Terminal</button>
              <span>Node</span><span>Client</span><span>Ports</span>
              <button type="button" className={bottom === 'output' ? 'is-on' : ''} onClick={() => setBottom('output')}>Test output</button>
              <RotateCw size={12} className="ctd-term-r" />
            </div>
            <pre className="ctd-term-body">
              {bottom === 'terminal' || run === 'none'
                ? 'candidate@207bfb79:/workspace$ '
                : run === 'running'
                  ? '$ node --test tests/visible\n▸ running 5 tests…'
                  : run === 'pass'
                    ? '$ node --test tests/visible\n✔ 5 passed  ✖ 0 failed  (1.2s)'
                    : '$ node --test tests/visible\n✖ 5 failed — 501 Holds are not implemented yet'}
            </pre>
          </div>
        </section>

        {/* right panel */}
        <aside className="ctd-right">
          <div className="ctd-tabs">
            {[['ai', 'AI Assistant'], ['preview', 'Preview'], ['tests', 'Test Cases']].map(([k, l]) => (
              <button key={k} type="button" className={right === k ? 'is-on' : ''} onClick={() => setRight(k)}>{l}</button>
            ))}
          </div>

          {right === 'ai' && (
            <div className="ctd-ai">
              <div className="ctd-usage"><Info size={12} /> AI usage <i><b style={{ width: chat === 'idle' ? '100%' : '88%' }} /></i> {chat === 'idle' ? '100' : '88'}% left</div>
              <div className="ctd-scroll ctd-chat" ref={chatRef}>
                <div className="ctd-note">
                  <b>How the assistant works here</b>
                  <p>You lead the design; it writes the code for your approach as an edit you review and insert. Your prompts and reviews are scored.</p>
                </div>
                {chat !== 'idle' && <div className="ctd-msg is-me">{PROMPT}</div>}
                {chat === 'thinking' && <div className="ctd-msg is-bot"><span className="ctd-dots"><i /><i /><i /></span></div>}
                {(chat === 'reply' || chat === 'inserted') && (
                  <div className="ctd-msg is-bot">
                    <p>Here&apos;s <code>services/holds.js</code> for that approach: availability check, one hold per member, queue by <code>createdAt</code>.</p>
                    <div className="ctd-edit">
                      <span><FileCode2 size={13} /> holds.js</span>
                      <em className="is-add">+15</em><em className="is-del">−6</em>
                      {chat === 'reply'
                        ? <button type="button" data-cur="insert" className="is-hint" onClick={insert}>Insert</button>
                        : <span className="ctd-ok"><Check size={12} /> Inserted</span>}
                    </div>
                  </div>
                )}
              </div>
              <div className="ctd-compose">
                <div className="ctd-chips"><span>Project structure</span><span>Request flow</span><span>The ticket</span></div>
                <div className={`ctd-input ${chat === 'idle' ? '' : 'is-sent'}`}>
                  <p>{chat === 'idle' ? PROMPT : 'Describe how it should work, or ask about the code…'}</p>
                  <div><span>+ Add file</span><em>{chat === 'idle' ? `${PROMPT.length}/650` : '0/650'}</em>
                    <button type="button" data-cur="send" className={nextHint === 'send' ? 'is-hint' : ''} onClick={() => chat === 'idle' && send()} disabled={chat !== 'idle'}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {right === 'preview' && (
            <div className="ctd-preview">
              <div className="ctd-url"><RotateCw size={12} /> <span>…e607981-5173.preview/</span><em>LIVE</em></div>
              <div className="ctd-app">
                <p className="ctd-app-logo">Shelf<span>Wise</span></p>
                <p className="ctd-app-sub">Sign in to borrow, renew and manage loans.</p>
                <label>Email<span /></label>
                <label>Password<span /></label>
                <span className="ctd-app-btn">Sign in</span>
              </div>
            </div>
          )}

          {right === 'tests' && (
            <div className="ctd-tests">
              <div className="ctd-tests-head">
                <div><b>{run === 'none' ? 'No run yet' : run === 'running' ? 'Running…' : `${passed}/5 passed`}</b><small>isolated runner · node:test</small></div>
                <button type="button" onClick={() => run !== 'running' && runTests()}><Play size={11} /> Run</button>
              </div>
              {run === 'none' ? (
                <p className="ctd-tests-note">These are the tests you can see. Hidden ones run too, so a fix that only satisfies this list may still lose marks.</p>
              ) : (
                <ul className="ctd-scroll">
                  {TESTS.map(([k, t], i) => (
                    <li key={k} className={run === 'running' ? 'is-wait' : run === 'pass' ? 'is-pass' : 'is-fail'} style={{ '--i': i }}>
                      <span className="ctd-tdot">{run === 'pass' ? <Check size={11} strokeWidth={3} /> : run === 'fail' ? <X size={11} strokeWidth={3} /> : null}</span>
                      <b>{k}</b><span>{t}</span>
                      {run === 'fail' && <em>501</em>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className={`ctd-status is-${run}`}>
        <span>
          {run === 'none' && (code === 'done' ? 'Code changed · tests not run yet' : 'Tests not run yet')}
          {run === 'running' && 'Running visible tests…'}
          {run === 'fail' && '0/5 visible tests passed'}
          {run === 'pass' && <><CircleCheck size={13} /> 5/5 visible tests passed · hidden tests run on submit</>}
        </span>
        <span className="ctd-status-r">
          {nextHint && <em className="ctd-step"><ChevronRight size={12} /> {nextHint === 'send' ? 'Send the prompt' : nextHint === 'insert' ? 'Insert the edit' : 'Run tests'}</em>}
          JavaScript
        </span>
      </div>
      <span className="ctd-bot" aria-hidden="true"><Bot size={18} /></span>
      {auto && cursor.on && (
        <span className={`ctd-cursor ${cursor.down ? 'is-down' : ''}`} style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true">
          <svg width="18" height="20" viewBox="0 0 18 20"><path d="M1.5 1.5 16 9.2l-6.4 1.6-3 6.7z" fill="#111827" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          <em>You</em>
        </span>
      )}
    </div>
  );
};

export default CodingTestDemo;
