import { useEffect, useRef, useState } from 'react';
import { ArrowUp, BookOpenText, Check, CircleCheck, CircleX, Code2, Copy, HelpCircle, Play, Sparkles, X } from 'lucide-react';
import AiOrb from '../components/AiOrb';
import { FOLLOW_UPS, STARTERS, detectIntent, lectureTopic } from '../data/lectureAssistant';

/* ══════════════════════════════════════════════════════════════
   Lecture A.I. — chat inside the lecture player's right panel.
   Generative UI: each answer renders as the block that fits the
   request (article · quiz · runnable code), not as plain text.
   DEMO: answers come from data/lectureAssistant.js, not a model.
   ══════════════════════════════════════════════════════════════ */

/* While it works, the orb spins and a line steps through what it is doing */
const STAGES = {
  quiz: ['Thinking', 'Reading this lecture', 'Picking the key ideas', 'Writing your questions'],
  code: ['Thinking', 'Reading this lecture', 'Writing the code', 'Checking it runs'],
  article: ['Thinking', 'Reading this lecture', 'Finding the simple version', 'Putting it in plain English']
};
const STAGE_MS = 550;
const THINK_MS = STAGE_MS * 4;
const STARTER_ICON = { quiz: HelpCircle, code: Code2, article: BookOpenText };

/* Run a snippet in the page and collect what it logs (our own demo snippets) */
const runSnippet = (code) => {
  const out = [];
  const fmt = (v) => (typeof v === 'string' ? v : JSON.stringify(v));
  const log = (...a) => out.push({ type: 'log', text: a.map(fmt).join(' ') });
  const t0 = performance.now();
  try {
    new Function('console', code)({ log, info: log, warn: log, error: (...a) => out.push({ type: 'error', text: a.map(fmt).join(' ') }) });
  } catch (e) {
    out.push({ type: 'error', text: `${e.name}: ${e.message}` });
  }
  return { lines: out, ms: Math.max(1, Math.round(performance.now() - t0)) };
};

/* ── Blocks ── */
const ArticleBlock = ({ data }) => (
  <article className="dx-ai-article">
    <h4>{data.title}</h4>
    <p className="dx-ai-intro">{data.intro}</p>
    <ol>
      {data.sections.map((s) => (
        <li key={s.h}><strong>{s.h}</strong><span>{s.body}</span></li>
      ))}
    </ol>
    <p className="dx-ai-takeaway"><Sparkles size={13} /> {data.takeaway}</p>
  </article>
);

const QuizBlock = ({ data }) => {
  const [picks, setPicks] = useState({});
  const answered = Object.keys(picks).length;
  const score = data.filter((q, i) => picks[i] === q.answer).length;
  return (
    <div className="dx-ai-quiz">
      {data.map((q, qi) => {
        const pick = picks[qi];
        const shown = pick !== undefined;
        return (
          <div key={q.q} className="dx-ai-q">
            <p className="dx-ai-q-title"><span>Q{qi + 1}</span>{q.q}</p>
            <div className="dx-ai-opts">
              {q.options.map((o, oi) => {
                const state = !shown ? '' : oi === q.answer ? 'is-right' : oi === pick ? 'is-wrong' : 'is-dim';
                return (
                  <button key={o} type="button" className={`dx-ai-opt ${state}`} disabled={shown} onClick={() => setPicks((p) => ({ ...p, [qi]: oi }))}>
                    <span className="dx-ai-opt-key">{String.fromCharCode(65 + oi)}</span>
                    <span>{o}</span>
                    {shown && oi === q.answer && <CircleCheck size={15} />}
                    {shown && oi === pick && oi !== q.answer && <CircleX size={15} />}
                  </button>
                );
              })}
            </div>
            {shown && <p className={`dx-ai-why ${pick === q.answer ? 'is-right' : ''}`}>{pick === q.answer ? 'Correct. ' : 'Not quite. '}{q.why}</p>}
          </div>
        );
      })}
      <div className="dx-ai-score">
        {answered < data.length ? `${answered}/${data.length} answered` : `You scored ${score}/${data.length}`}
      </div>
    </div>
  );
};

const CodeBlock = ({ data }) => {
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(data.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }).catch(() => {});
  };
  return (
    <div className="dx-ai-code">
      <div className="dx-ai-code-bar">
        <span>{data.title}</span>
        <em>JavaScript</em>
        <button type="button" onClick={copy} aria-label="Copy code">{copied ? <Check size={14} /> : <Copy size={14} />}</button>
        <button type="button" className="dx-ai-run" onClick={() => setResult(runSnippet(data.code))}><Play size={13} /> Run</button>
      </div>
      <pre><code>{data.code}</code></pre>
      {result && (
        <div className="dx-ai-console" role="status">
          <div className="dx-ai-console-head"><span>Output</span><em>{result.ms} ms</em></div>
          {result.lines.length === 0 && <div className="dx-ai-line is-dim">(no output)</div>}
          {result.lines.map((l, i) => <div key={i} className={`dx-ai-line ${l.type === 'error' ? 'is-error' : ''}`}>{l.text}</div>)}
        </div>
      )}
    </div>
  );
};

const INTRO = { article: 'Here is the simple version:', quiz: 'Three quick questions. Tap an answer to check it.', code: 'Here is a snippet you can run right here:' };

/* ── Chat ── */
const LectureAI = ({ lecture, unitTitle, onClose, height = null }) => {
  const topic = lectureTopic(lecture.title, unitTitle);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(null); // the kind being prepared, or null
  const [stage, setStage] = useState(0);
  const scrollRef = useRef(null);
  const timer = useRef(null);
  const stepper = useRef(null);
  const round = useRef(0);

  useEffect(() => () => { clearTimeout(timer.current); clearInterval(stepper.current); }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  const ask = (label, kind = detectIntent(label)) => {
    if (busy || !label.trim()) return;
    setMsgs((m) => [...m, { id: `u${Date.now()}`, role: 'user', text: label.trim() }]);
    setText('');
    setBusy(kind);
    setStage(0);
    clearInterval(stepper.current);
    stepper.current = setInterval(() => setStage((n) => Math.min(n + 1, 3)), STAGE_MS);
    timer.current = setTimeout(() => {
      clearInterval(stepper.current);
      round.current += 1;
      // "Another quiz" starts from a different question each time
      const quiz = kind === 'quiz' ? topic.quiz.map((_, i, a) => a[(i + round.current) % a.length]) : null;
      setMsgs((m) => [...m, { id: `a${Date.now()}`, role: 'ai', kind, data: kind === 'quiz' ? quiz : topic[kind] }]);
      setBusy(null);
    }, THINK_MS);
  };

  const last = msgs[msgs.length - 1];

  return (
    <section className={`dx-ai ${height ? 'is-sized' : ''}`} style={height ? { flexBasis: `${height}px` } : undefined} aria-label="Ask Buddy A.I. about this lecture">
      <header className="dx-ai-head">
        <AiOrb size={30} thinking={!!busy} />
        <div>
          <strong>Ask Buddy A.I.</strong>
          <small>About “{lecture.title}”</small>
        </div>
        <button type="button" className="dx-ai-x" onClick={onClose} aria-label="Close Buddy A.I. chat"><X size={16} /></button>
      </header>

      <div className="dx-ai-scroll" ref={scrollRef}>
        {msgs.length === 0 && (
          <div className="dx-ai-bot dx-ai-hello">
            <AiOrb size={22} className="dx-ai-avatar" />
            <p>Hi! I&apos;m Buddy. I can quiz you, write code or explain this lecture simply. Pick a suggestion below or ask anything.</p>
          </div>
        )}

        {msgs.map((m) => (m.role === 'user' ? (
          <div key={m.id} className="dx-ai-user">{m.text}</div>
        ) : (
          <div key={m.id} className="dx-ai-bot">
            <AiOrb size={22} className="dx-ai-avatar" />
            <div className="dx-ai-bot-body">
              <p className="dx-ai-lead">{INTRO[m.kind]}</p>
              {m.kind === 'article' && <ArticleBlock data={m.data} />}
              {m.kind === 'quiz' && <QuizBlock data={m.data} />}
              {m.kind === 'code' && <CodeBlock data={m.data} />}
            </div>
          </div>
        )))}

        {busy && (
          <div className="dx-ai-thinking" role="status" aria-live="polite">
            <AiOrb size={22} thinking className="dx-ai-avatar" />
            <div className="dx-ai-think-body">
              <span key={stage} className="dx-ai-think-line">{STAGES[busy][stage]}<span className="dx-ai-dots"><i /><i /><i /></span></span>
              <span className="dx-ai-think-steps" aria-hidden="true">
                {STAGES[busy].map((st, i) => <i key={st} className={i < stage ? 'is-done' : i === stage ? 'is-now' : ''} />)}
              </span>
              <span className="dx-ai-skel" aria-hidden="true"><i /><i /><i /></span>
            </div>
          </div>
        )}

      </div>

      {/* Suggestions sit right above the input: the starters first, then follow-ups after each answer */}
      {!busy && (msgs.length === 0 || last?.role === 'ai') && (
        <div className="dx-ai-suggest" role="group" aria-label="Suggestions">
          {msgs.length === 0
            ? STARTERS.map((st) => {
              const Icon = STARTER_ICON[st.kind];
              return <button key={st.kind} type="button" onClick={() => ask(st.label, st.kind)}><Icon size={14} /> {st.label}</button>;
            })
            : FOLLOW_UPS[last.kind].map((f) => {
              const Icon = STARTER_ICON[f.kind];
              return <button key={f.label} type="button" onClick={() => ask(f.label, f.kind)}><Icon size={14} /> {f.label}</button>;
            })}
        </div>
      )}

      <form className="dx-ai-input" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything about this lecture" aria-label="Ask about this lecture" />
        <button type="submit" disabled={!text.trim() || !!busy} aria-label="Send"><ArrowUp size={16} /></button>
      </form>
    </section>
  );
};

export default LectureAI;
