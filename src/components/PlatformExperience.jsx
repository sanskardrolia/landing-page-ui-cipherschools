import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Award, BookOpen, Bot, Building2, CalendarCheck, Cpu, Layers, Network, Sparkles, Workflow, Check, CirclePlay, Code2, Coins, FileText, Flame, ListChecks, Mic, Pause, Play,
  Target
} from 'lucide-react';
import AiOrb from './AiOrb';
import './PlatformExperience.css';

/* ══════════════════════════════════════════════════════════════
   Home › Platform experience — "how it feels to use CipherSchools".
   Feature tabs (Curriculum, Practice, Buddy A.I., A.I. Interview, CipherCoins). Each tab is a
   small product canvas (fixed 760×460 design space) and a list of
   steps. Each step plays like a screen recording: the camera zooms
   out, the cursor travels to the feature, the camera zooms in on it,
   the cursor clicks and the feature reacts. Then the next step.
   After the last step it moves to the next tab. Clicking a tab or a
   step jumps there and keeps playing from it. Starts when in view.
   ══════════════════════════════════════════════════════════════ */

const W = 760;
const H = 460;
const STEP_MS = 4600;

/* ── Canvas 1 · Curriculum ── */
const SUBJECTS = [
  { name: 'Computer Fundamentals', note: 'OS · CN · OOPs', Icon: Cpu, state: 'done' },
  { name: 'DSA', note: 'Unit 3 of 9 · Recursion', Icon: Workflow, state: 'now' },
  { name: 'Development', note: 'MERN or Java Full Stack', Icon: Layers },
  { name: 'System Design', note: 'HLD & LLD', Icon: Network },
  { name: 'Generative AI', note: 'LLMs, RAG & agents', Icon: Sparkles }
];
const DSA_UNITS = [['Arrays', 'done'], ['Strings', 'done'], ['Recursion', 'now']];
const CurriculumCanvas = ({ done }) => (
  <>
    <section className="pe-panel" style={{ left: 20, top: 20, width: 250, height: 420 }}>
      <p className="pe-ph"><BookOpen size={14} /> Your curriculum</p>
      <ol className="pe-subjects">
        {SUBJECTS.map((x) => (
          <li key={x.name} className={x.state ? `is-${x.state}` : ''}>
            <span className="pe-subj-ico">{x.state === 'done' ? <Check size={12} strokeWidth={3} /> : <x.Icon size={13} />}</span>
            <span className="pe-subj-txt"><b>{x.name}</b><small>{x.note}</small></span>
            {x.state === 'now' && done[0] && (
              <span className="pe-subj-units">
                {DSA_UNITS.map(([u, st]) => <i key={u} className={`is-${st}`}>{st === 'done' && <Check size={9} strokeWidth={3} />}{u}</i>)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>

    {/* lecture panel: Video | Article */}
    <section className="pe-panel pe-video" style={{ left: 290, top: 20, width: 450, height: 220 }}>
      <div className="pe-vtabs">
        <span className={done[2] ? '' : 'is-on'}><CirclePlay size={13} /> Video</span>
        <span className={done[2] ? 'is-on' : ''} data-pe="article"><FileText size={13} /> Article</span>
        <em>{done[2] ? '6 min read' : done[1] ? 'Now playing · 18 min' : '18 min'}</em>
      </div>
      {done[2] ? (
        <article className="pe-article">
          <h4>Recursion: getting the base case right</h4>
          <p>Every recursive function needs a condition that stops it. Without one, the calls never end and the stack overflows.</p>
          <code>if n == 0: return 1</code>
          <p className="is-dim">Next, draw the recursion tree for factorial(3)…</p>
        </article>
      ) : (
        <div className={`pe-thumb ${done[1] ? 'is-playing' : ''}`}>
          <span className="pe-play">{done[1] ? <Pause size={22} /> : <Play size={22} />}</span>
          <span className="pe-thumb-title">Recursion · Lecture 3 · Base cases</span>
          <span className="pe-thumb-bar"><i /></span>
        </div>
      )}
    </section>

    <section className="pe-panel" style={{ left: 290, top: 256, width: 215, height: 184 }}>
      <p className="pe-ph"><FileText size={14} /> My notes</p>
      <div className={`pe-notes ${done[3] ? 'is-typed' : ''}`}>
        <span>Every call needs a base case</span>
        <span>Stack depth = n</span>
        <span>Draw the recursion tree first</span>
      </div>
    </section>

    <section className="pe-panel pe-prog" style={{ left: 520, top: 256, width: 220, height: 184 }}>
      <p className="pe-ph">Section progress</p>
      <span className="pe-ring" style={{ '--p': done[4] ? 62 : 44 }}><b>{done[4] ? '62%' : '44%'}</b></span>
      <span className={`pe-mini-btn ${done[4] ? 'is-on' : ''}`} data-pe="complete">{done[4] ? <><Check size={12} /> Completed</> : 'Mark complete'}</span>
    </section>
  </>
);

/* ── Canvas 4 · CipherCoins (same ideas as the dashboard: daily check-in ladder,
   missions, streak bonuses and levels) ── */
const LADDER = [10, 15, 20, 25, 30, 40, 75];
const MISSIONS = [
  ['Solve 3 questions today', '3/3', 30, 'ready'],
  ['Watch 2 lectures today', '1/2', 20],
  ['Finish a full section', 'Milestone', 200],
  ['Take your first test', 'Milestone', 60]
];
const CoinsCanvas = ({ done }) => {
  const bal = 1625 + (done[0] ? 40 : 0) + (done[1] ? 30 : 0) + (done[2] ? 75 : 0);
  const pct = Math.min(100, ((bal - 1000) / 750) * 100);
  return (
    <>
      <section className="pe-panel pe-checkin" style={{ left: 20, top: 20, width: 440, height: 160 }}>
        <p className="pe-ph"><CalendarCheck size={14} /> Daily check-in
          <span className={`pe-ck-btn ${done[0] ? 'is-on' : ''}`} data-pe="checkin">{done[0] ? <><Check size={12} /> +40 claimed</> : 'Check in · +40'}</span>
        </p>
        <div className="pe-ladder">
          {LADDER.map((c, i) => (
            <span key={i} className={i < 5 || (i === 5 && done[0]) ? 'is-got' : i === 5 ? 'is-today' : ''}>
              <small>Day {i + 1}</small>
              <b>{i < 5 || (i === 5 && done[0]) ? <Check size={13} strokeWidth={3} /> : <Coins size={13} />}</b>
              <em>+{c}</em>
            </span>
          ))}
        </div>
      </section>

      <section className="pe-panel pe-balance" style={{ left: 480, top: 20, width: 260, height: 160 }}>
        <p className="pe-ph"><Coins size={14} /> Balance</p>
        <span className="pe-bal"><Coins size={20} /> <b key={bal}>{bal.toLocaleString('en-IN')}</b></span>
        <span className="pe-lvl"><span>{done[3] ? 'Level 6 · Achiever' : 'Level 5 · Consistent'}</span><i><b style={{ width: done[3] ? '6%' : `${pct}%` }} /></i>
          <small>{done[3] ? '1,770 / 2,750 to Level 7' : `${bal.toLocaleString('en-IN')} / 1,750 to Level 6`}</small></span>
        {pct >= 100 && !done[3] && <span className="pe-lvlup" data-pe="levelup">Level up!</span>}
        {done[3] && <span className="pe-lvlup is-done"><Award size={12} /> Level 6</span>}
      </section>

      <section className="pe-panel" style={{ left: 20, top: 200, width: 440, height: 240 }}>
        <p className="pe-ph"><Target size={14} /> Missions</p>
        <ul className="pe-missions">
          {MISSIONS.map(([t, prog, c, st], i) => {
            const claimed = i === 0 && done[1];
            return (
              <li key={t} className={claimed ? 'is-claimed' : st === 'ready' ? 'is-ready' : ''}>
                <span className="pe-m-t"><b>{t}</b><small>{prog}</small></span>
                {claimed ? <em className="pe-m-done"><Check size={12} /> +{c}</em>
                  : st === 'ready' ? <em className="pe-m-claim" data-pe="claim">Claim +{c}</em>
                    : <em className="pe-m-c"><Coins size={11} /> {c}</em>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`pe-panel pe-streakbox ${done[2] ? 'is-won' : ''}`} style={{ left: 480, top: 200, width: 260, height: 240 }}>
        <p className="pe-ph"><Flame size={14} /> Learning streak</p>
        <span className="pe-flame"><Flame size={30} /><b>{done[2] ? 7 : 6}</b><small>days</small></span>
        <span className="pe-week">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <i key={i} className={i < 6 || done[2] ? 'is-on' : ''}>{d}</i>)}</span>
        <span className={`pe-bonus ${done[2] ? 'is-on' : ''}`} data-pe="bonus">{done[2] ? <><Check size={12} /> 7-day bonus · +75</> : '7-day bonus · +75 tomorrow'}</span>
      </section>
    </>
  );
};

/* ── Canvas 2 · Practice ── */
const QUESTIONS = [['Fibonacci', 'Easy', true], ['Power Set', 'Medium'], ['Subsets II', 'Medium'], ['N-Queens', 'Hard']];
const CODE = [
  'def power_set(nums):',
  '    res = [[]]',
  '    for n in nums:',
  '        res += [s + [n] for s in res]',
  '    return res'
];
const PracticeCanvas = ({ done }) => (
  <>
    <section className="pe-panel" style={{ left: 20, top: 20, width: 250, height: 320 }}>
      <p className="pe-ph"><ListChecks size={14} /> Recursion · Practice</p>
      <ul className="pe-qs">
        {QUESTIONS.map(([q, lvl, solved], i) => (
          <li key={q} className={`${solved ? 'is-done' : ''} ${i === 1 && done[0] ? 'is-open' : ''}`}>
            <span className="pe-q-dot">{solved && <Check size={10} strokeWidth={3} />}</span>
            {q}<em className={`lvl-${lvl.toLowerCase()}`}>{lvl}</em>
          </li>
        ))}
      </ul>
    </section>

    <section className="pe-panel pe-streak" style={{ left: 20, top: 360, width: 250, height: 80 }}>
      <p className="pe-ph"><Flame size={14} /> {done[3] ? '7-day streak' : '6-day streak'}</p>
      <span className="pe-dots">{Array.from({ length: 7 }, (_, i) => <i key={i} className={i < 6 || done[3] ? 'is-on' : ''} />)}</span>
      {done[3] && <span className="pe-pop"><Coins size={12} /> +10 CipherCoins</span>}
    </section>

    <section className="pe-panel pe-editor" style={{ left: 290, top: 20, width: 450, height: 300 }}>
      <p className="pe-ph"><Code2 size={14} /> {done[0] ? 'power_set.py' : 'Pick a question'}</p>
      <pre className={done[1] ? 'is-typed' : ''}>
        {CODE.map((l, i) => <span key={i} style={{ '--i': i }}><b>{i + 1}</b>{l}</span>)}
      </pre>
    </section>

    <section className="pe-panel pe-runbar" style={{ left: 290, top: 336, width: 450, height: 44 }}>
      <span className="pe-ph">Python 3 · 3 sample tests</span>
      <span className={`pe-run ${done[2] ? 'is-on' : ''}`}><Play size={12} /> Run</span>
    </section>

    <section className={`pe-panel pe-verdict ${done[2] ? 'is-pass' : ''}`} style={{ left: 290, top: 392, width: 450, height: 48 }}>
      {done[2] ? <><Check size={15} /> <b>Accepted</b> · 3/3 tests passed · 42 ms</> : <span className="pe-ph">Run your code to see the verdict</span>}
    </section>
  </>
);

/* ── Canvas 3 · Interview ── */
const TOPICS = ['DSA', 'System Design', 'Full Stack', 'HR & Behavioural'];
const COMPANIES = ['Amazon', 'Google', 'Microsoft', 'Flipkart'];
const InterviewCanvas = ({ done }) => (
  <>
    <section className="pe-panel" style={{ left: 20, top: 20, width: 250, height: 260 }}>
      <p className="pe-ph"><Bot size={14} /> Start an A.I. interview</p>
      <ul className="pe-slots">
        {TOPICS.map((t, i) => <li key={t} className={i === 0 && done[0] ? 'is-on' : ''}>{t}{i === 0 && done[0] && <Check size={12} />}</li>)}
      </ul>
      <span className={`pe-start ${done[0] ? 'is-on' : ''}`}>{done[0] ? 'Starting…' : 'Start now'}</span>
      <p className="pe-hint">{done[0] ? 'No booking, no waiting' : 'Any time, as often as you like'}</p>
    </section>

    <section className="pe-panel pe-live" style={{ left: 290, top: 20, width: 450, height: 260 }}>
      <p className="pe-ph"><Bot size={14} /> A.I. interviewer · DSA round {done[1] && <em className="pe-rec">● Live</em>}</p>
      <div className="pe-bubble">Walk me through your approach for an LRU cache.</div>
      {done[1] && <div className="pe-bubble is-me">I&apos;d use a hash map with a doubly linked list…</div>}
      <div className="pe-mic-row">
        <span className={`pe-wave ${done[1] ? 'is-on' : ''}`}>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
        <span className={`pe-mic ${done[1] ? 'is-on' : ''}`}><Mic size={16} /></span>
      </div>
    </section>

    <section className="pe-panel" style={{ left: 20, top: 300, width: 250, height: 140 }}>
      <p className="pe-ph"><Building2 size={14} /> Company rounds</p>
      <span className="pe-chips">{COMPANIES.map((c, i) => <i key={c} className={i === 0 && done[3] ? 'is-on' : ''}>{c}</i>)}</span>
      <p className="pe-hint">{done[3] ? 'Amazon-style A.I. round ready' : 'Practise the real format'}</p>
    </section>

    <section className="pe-panel pe-feedback" style={{ left: 290, top: 300, width: 450, height: 140 }}>
      <p className="pe-ph"><Target size={14} /> A.I. feedback {done[2] && <em>Overall 8.2 / 10</em>}</p>
      {[['Approach', 82], ['Code quality', 74], ['Communication', 90]].map(([k, v]) => (
        <div key={k} className="pe-score"><span>{k}</span><i><b style={{ width: done[2] ? `${v}%` : '0%' }} /></i><em>{done[2] ? (v / 10).toFixed(1) : '–'}</em></div>
      ))}
    </section>
  </>
);

/* ── Canvas · Ask Buddy A.I. (inside the lecture player) ──
   Reply areas use a CSS-only beat: the orb "thinks" for a moment, then the answer fades in. */
const BD_OPTIONS = ['Move right pointer left', 'Move left pointer right', 'Move both pointers', 'Restart from middle'];
const BD_CODE = [
  'function pairSum(nums, target) {',
  '  let l = 0, r = nums.length - 1;',
  '  while (l < r) {',
  '    const s = nums[l] + nums[r];',
  '    if (s === target) return [l, r];',
  '    s < target ? l++ : r--;',
  '  }',
  '}'
];
const BdThink = ({ label }) => (
  <div className="pe-bd-think"><AiOrb size={18} thinking /><span>{label}</span><i /><i /></div>
);
const BuddyCanvas = ({ done }) => {
  const stage = !done[0] ? 'closed' : !done[1] ? 'hello' : !done[3] ? 'quiz' : 'code';
  return (
    <>
      <section className="pe-panel pe-bd-video" style={{ left: 20, top: 20, width: 440, height: 250 }}>
        <span className="pe-bd-play"><Play size={18} /></span>
        <span className="pe-bd-cap">Two Pointers · Lecture 2 of 16</span>
        <span className="pe-bd-prog"><i /></span>
      </section>
      <section className="pe-panel pe-bd-actions" style={{ left: 20, top: 286, width: 440, height: 46 }}>
        <span className="pe-mini-btn is-on"><Check size={12} /> Completed</span>
        <span className={`pe-mini-btn pe-bd-ask ${done[0] ? 'is-ask' : ''}`} data-pe="ask"><AiOrb size={14} still /> Ask Buddy A.I.</span>
        <span className="pe-mini-btn">Report</span>
      </section>
      <section className="pe-panel" style={{ left: 20, top: 348, width: 440, height: 92 }}>
        <p className="pe-ph"><ListChecks size={14} /> Up next</p>
        <ul className="pe-bd-next"><li><CirclePlay size={13} /> Prefix Sums <em>20 min</em></li><li><CirclePlay size={13} /> Sliding Window <em>22 min</em></li></ul>
      </section>

      {stage === 'closed' ? (
        <section className="pe-panel" style={{ left: 480, top: 20, width: 260, height: 420 }}>
          <p className="pe-ph"><BookOpen size={14} /> Arrays</p>
          <ul className="pe-units">
            {[['Array Basics', 'done'], ['Two Pointers', 'now'], ['Prefix Sums'], ['Sliding Window']].map(([u, st], i) => (
              <li key={u} className={st ? `is-${st}` : ''}><span className="pe-unit-n">{st === 'done' ? <Check size={11} strokeWidth={3} /> : i + 1}</span>{u}{st === 'now' && <em>Now</em>}</li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="pe-panel pe-bd-chat" style={{ left: 480, top: 20, width: 260, height: 420 }}>
          <p className="pe-bd-head"><AiOrb size={20} /> <b>Ask Buddy A.I.</b><small>Two Pointers</small></p>

          {stage === 'hello' && (
            <div key="hello" className="pe-bd-reply" style={{ top: 64 }}>
              <BdThink label="Opening Buddy" />
              <div className="pe-bd-msg"><AiOrb size={16} /> <span>Hi! I&apos;m Buddy. I can quiz you, write code or explain this lecture simply.</span></div>
            </div>
          )}

          {stage === 'quiz' && (
            <div key="quiz" className="pe-bd-reply" style={{ top: 64 }}>
              <span className="pe-bd-user">Ask me a quiz</span>
              <BdThink label="Writing your questions" />
              <div className="pe-bd-quiz">
                <p>The sum is too small. What do you do?</p>
                {BD_OPTIONS.map((o, i) => (
                  <span key={o} className={`pe-bd-opt ${done[2] && i === 1 ? 'is-right' : ''} ${done[2] && i !== 1 ? 'is-dim' : ''}`}>
                    <b>{String.fromCharCode(65 + i)}</b>{o}{done[2] && i === 1 && <Check size={11} strokeWidth={3} />}
                  </span>
                ))}
                {done[2] && <em className="pe-bd-why">Correct. A bigger left value raises the sum.</em>}
              </div>
            </div>
          )}

          {stage === 'code' && (
            <div key="code" className="pe-bd-reply" style={{ top: 64 }}>
              <span className="pe-bd-user">Show me the code</span>
              <BdThink label="Writing the code" />
              <div className="pe-bd-code">
                <p className="pe-bd-code-bar"><span>pairSum.js</span><span className={`pe-bd-run ${done[4] ? 'is-on' : ''}`}><Play size={10} /> Run</span></p>
                <pre>{BD_CODE.join('\n')}</pre>
                {done[4] && <p className="pe-bd-out"><b>Output</b> › [2, 4] · 1 ms</p>}
              </div>
            </div>
          )}

          <span className="pe-bd-chips">
            {stage === 'hello' || stage === 'closed'
              ? <><i data-pe="quiz">Ask me a quiz</i><i>Write code</i></>
              : <><i>Another quiz</i><i data-pe="code">Show me the code</i></>}
          </span>
          <span className="pe-bd-input">Ask anything about this lecture</span>
        </section>
      )}
    </>
  );
};

/* Each step: what it says, where the camera zooms (canvas coords + zoom) and where the cursor clicks */
const TABS = [
  {
    id: 'curriculum', label: 'Curriculum', Icon: BookOpen, Canvas: CurriculumCanvas, title: 'Your curriculum',
    steps: [
      { t: 'Every subject, one path', d: 'Computer Fundamentals to Generative AI, in the right order.', cam: [145, 230, 1.55], cur: [140, 140] },
      { t: 'Lectures, unit by unit', d: 'Short lectures that build on the last one.', cam: [515, 130, 1.5], cur: [518, 142] },
      { t: 'Read the article too', d: 'Every lecture has a short article to revise from.', cam: [470, 110, 1.6], cur: [420, 48] },
      { t: 'Notes beside every lecture', d: 'Write as you watch; they stay with the lecture.', cam: [397, 348, 1.7], cur: [398, 338] },
      { t: 'See your progress grow', d: 'Every lecture you finish moves the section forward.', cam: [630, 348, 1.6], cur: [630, 400] }
    ]
  },
  {
    id: 'practice', label: 'Practice', Icon: Code2, Canvas: PracticeCanvas, title: 'Practice · Recursion',
    steps: [
      { t: 'Questions after every unit', d: 'Practise what you just learnt, easy to hard.', cam: [145, 170, 1.6], cur: [110, 132] },
      { t: 'Code in the browser', d: 'An editor that runs right next to the question.', cam: [515, 170, 1.45], cur: [470, 170] },
      { t: 'Instant verdict', d: 'Run your code against tests and see what passes.', cam: [515, 390, 1.6], cur: [700, 358] },
      { t: 'Streaks that keep you going', d: 'Show up daily and earn CipherCoins.', cam: [145, 400, 1.8], cur: [228, 408] }
    ]
  },
  {
    id: 'buddy', label: 'Buddy A.I.', Icon: Sparkles, Canvas: BuddyCanvas, title: 'Lecture · Two Pointers',
    steps: [
      { t: 'Ask Buddy A.I., mid-lecture', d: 'One tap opens Buddy right beside the video.', cam: [240, 300, 1.75], cur: [207, 309] },
      { t: 'Quiz yourself in a tap', d: 'Buddy turns the lecture into quick questions.', cam: [610, 330, 1.6], cur: [540, 399] },
      { t: 'Instant feedback', d: 'Pick an answer and see why it is right.', cam: [610, 250, 1.6], cur: [600, 237] },
      { t: 'Ask for code', d: 'Get a snippet for the exact idea you just watched.', cam: [610, 330, 1.6], cur: [646, 399] },
      { t: 'Run it right in the chat', d: 'Press Run and see the output without leaving the lecture.', cam: [610, 200, 1.7], cur: [694, 147] }
    ]
  },
  {
    id: 'interview', label: 'A.I. Interview', Icon: Mic, Canvas: InterviewCanvas, title: 'A.I. mock interview',
    steps: [
      { t: 'Start anytime, no booking', d: 'Pick a topic and the A.I. interviewer starts in seconds.', cam: [145, 160, 1.6], cur: [150, 212] },
      { t: 'Talk it through with A.I.', d: 'It asks, listens and follows up, like a real round.', cam: [515, 150, 1.45], cur: [698, 245] },
      { t: 'Instant A.I. feedback', d: 'Scores on approach, code and communication, right after.', cam: [515, 370, 1.5], cur: [600, 400] },
      { t: 'Company-specific rounds', d: 'The A.I. runs the format your target company uses.', cam: [145, 370, 1.7], cur: [62, 352] }
    ]
  }
];

TABS.push({
  id: 'coins', label: 'CipherCoins', Icon: Coins, Canvas: CoinsCanvas, title: 'CipherCoins',
  steps: [
    { t: 'Check in every day', d: 'Daily check-ins pay more the longer your streak runs.', cam: [240, 100, 1.45], cur: [392, 52] },
    { t: 'Missions that pay', d: 'Solve, watch and test to complete missions and claim coins.', cam: [240, 300, 1.5], cur: [405, 268] },
    { t: 'Streak bonuses', d: 'Keep a 7-day learning streak for a big bonus.', cam: [610, 320, 1.6], cur: [612, 362] },
    { t: 'Level up as you go', d: 'Coins move you through levels from Beginner to Legend.', cam: [610, 100, 1.6], cur: [694, 52] }
  ]
});

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const PlatformExperience = () => {
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);
  const [clicked, setClicked] = useState(false);   // current step's click has happened
  const [zoomed, setZoomed] = useState(false);     // camera on the step's focus (vs. overview)
  const [cursor, setCursor] = useState([380, 520]);
  const [pressing, setPressing] = useState(false);
  const [live, setLive] = useState(false);         // section has scrolled into view
  const [fit, setFit] = useState(1);
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  // scale the 760×460 canvas to the stage width
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setFit(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // start once visible
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setLive(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // one step: zoom out → cursor travels → zoom in → click → hold → next
  useEffect(() => {
    if (!live) return undefined;
    const s = TABS[tab].steps[step];
    const still = reducedMotion();
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    at(0, () => { setClicked(false); setZoomed(false); setCursor(s.cur); });
    at(still ? 0 : 750, () => setZoomed(true));
    at(still ? 0 : 1650, () => setPressing(true));
    at(still ? 10 : 1820, () => { setPressing(false); setClicked(true); });
    at(STEP_MS, () => {
      const last = step === TABS[tab].steps.length - 1;
      if (last) { setTab((t) => (t + 1) % TABS.length); setStep(0); } else setStep(step + 1);
    });
    return () => timers.forEach(clearTimeout);
  }, [live, tab, step]);

  const T = TABS[tab];
  const s = T.steps[step];
  const done = T.steps.map((_, i) => i < step || (i === step && clicked));

  // camera: put the focus point in the middle of the stage, never showing past the canvas edges
  const z = zoomed && !reducedMotion() ? s.cam[2] : 1;
  const k = fit * z;
  const clamp = (v, lo) => Math.min(0, Math.max(lo, v));
  const tx = clamp((W * fit) / 2 - s.cam[0] * k, W * fit - W * k);
  const ty = clamp((H * fit) / 2 - s.cam[1] * k, H * fit - H * k);

  const pick = (ti, si = 0) => { setTab(ti); setStep(si); setLive(true); };

  return (
    <section className="hs-section pe-section" id="platform-section" ref={rootRef}>
      <div className="container">
        <header className="pe-head">
          <h2>One platform. <span>Every step of your prep.</span></h2>
        </header>

        <div className="pe-tabs" role="tablist" aria-label="Platform features">
          {TABS.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'is-on' : ''} onClick={() => pick(i)}>
              <x.Icon size={15} /> {x.label}
            </button>
          ))}
        </div>

        <div className="pe-body">
          <ol className="pe-steps">
            {T.steps.map((x, i) => (
              <li key={x.t}>
                <button type="button" className={i === step ? 'is-on' : i < step ? 'is-past' : ''} onClick={() => pick(tab, i)}>
                  <span className="pe-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pe-step-text"><b>{x.t}</b>{i === step && <small>{x.d}</small>}</span>
                  {i === step && live && <i key={`${tab}-${step}`} className="pe-step-bar" style={{ '--ms': `${STEP_MS}ms` }} />}
                </button>
              </li>
            ))}
          </ol>

          <div className="pe-stage-wrap">
            <div className="pe-window">
              <div className="pe-window-bar"><em>{T.title}</em></div>
              <div className="pe-stage" ref={stageRef} style={{ height: H * fit }} aria-hidden="true">
                <div className="pe-canvas" style={{ width: W, height: H, transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
                  <T.Canvas done={done} />
                  <span className={`pe-cursor ${pressing ? 'is-down' : ''}`} style={{ left: cursor[0], top: cursor[1] }}>
                    <svg width="18" height="20" viewBox="0 0 18 20"><path d="M1.5 1.5 16 9.2l-6.4 1.6-3 6.7z" fill="#111827" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                    <i className={`pe-click ${pressing ? 'is-on' : ''}`} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformExperience;
