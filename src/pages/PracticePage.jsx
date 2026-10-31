import React, { useState } from 'react';
import { ArrowRight, Code2, Database, Binary, Play, Send, Trophy, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import './PracticePage.css';

const TRACKS = [
  { id: 'programming', title: 'Programming', desc: 'Sharpen language fundamentals, logic building and core concepts.', Icon: Code2 },
  { id: 'dsa', title: 'Data Structures & Algorithms', desc: 'Arrays to graphs: the patterns top tech interviews ask about.', Icon: Binary },
  { id: 'sql', title: 'SQL & Database Queries', desc: 'Write joins, aggregates and window queries against real schemas.', Icon: Database },
];

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

const STARTERS = {
  JavaScript: [
    'function twoSum(nums, target) {',
    '  const seen = new Map();',
    '  for (let i = 0; i < nums.length; i++) {',
    '    const need = target - nums[i];',
    '    if (seen.has(need)) return [seen.get(need), i];',
    '    seen.set(nums[i], i);',
    '  }',
    '}',
  ],
  Python: [
    'def two_sum(nums, target):',
    '    seen = {}',
    '    for i, n in enumerate(nums):',
    '        need = target - n',
    '        if need in seen:',
    '            return [seen[need], i]',
    '        seen[n] = i',
    '',
  ],
  Java: [
    'int[] twoSum(int[] nums, int target) {',
    '  Map<Integer, Integer> seen = new HashMap<>();',
    '  for (int i = 0; i < nums.length; i++) {',
    '    int need = target - nums[i];',
    '    if (seen.containsKey(need)) return new int[]{seen.get(need), i};',
    '    seen.put(nums[i], i);',
    '  }',
    '  return new int[0];  }',
  ],
  'C++': [
    'vector<int> twoSum(vector<int>& nums, int target) {',
    '  unordered_map<int, int> seen;',
    '  for (int i = 0; i < nums.size(); i++) {',
    '    int need = target - nums[i];',
    '    if (seen.count(need)) return {seen[need], i};',
    '    seen[nums[i]] = i;',
    '  }',
    '  return {};  }',
  ],
};

const PROBLEMS = [
  { title: 'Two Sum', topic: 'Arrays & Hashing', difficulty: 'Easy' },
  { title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy' },
  { title: 'Merge Intervals', topic: 'Arrays & Sorting', difficulty: 'Medium' },
  { title: 'Longest Substring Without Repeating Characters', topic: 'Sliding Window', difficulty: 'Medium' },
  { title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium' },
  { title: 'Trapping Rain Water', topic: 'Two Pointers', difficulty: 'Hard' },
];

const PracticePage = () => {
  const [tab, setTab] = useState('problem');
  const [lang, setLang] = useState('JavaScript');
  const [result, setResult] = useState(null);

  const scrollToProblems = () => {
    document.getElementById('practice-problems')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="practice-page">
      {/* ── Hero ── */}
      <section className="practice-hero">
        <span className="practice-badge"><Sparkles size={13} /> New Practice Questions</span>
        <h1 className="practice-h1">Master the Art of <span>Coding Practice.</span></h1>
        <p className="practice-sub">
          Build your coding skills, strengthen core concepts and track your progress, all in one clean practice workspace.
        </p>
        <button type="button" className="practice-btn-primary" onClick={scrollToProblems}>
          Start Practicing Now <ArrowRight size={17} />
        </button>
      </section>

      {/* ── Tracks ── */}
      <section className="practice-section">
        <h2 className="practice-h2">Targeted Practice Across Every Domain</h2>
        <div className="practice-tracks">
          {TRACKS.map(({ id, title, desc, Icon }) => (
            <article key={id} className="practice-track-card">
              <span className="practice-track-icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="practice-track-meta">
                <span>Practice Problems <b>—</b></span>
                <button type="button" onClick={scrollToProblems}>Start Practice <ArrowRight size={14} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Editor preview ── */}
      <section className="practice-section">
        <div className="practice-editor">
          <div className="practice-editor-bar">
            <div className="practice-tabs" role="tablist">
              {['problem', 'submissions'].map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  className={tab === t ? 'is-active' : ''}
                  onClick={() => setTab(t)}
                >
                  {t === 'problem' ? 'Problem' : 'Submissions'}
                </button>
              ))}
            </div>
            <span className="practice-rank"><Trophy size={14} /> Global Rank <b>#8,421</b></span>
          </div>

          <div className="practice-editor-grid">
            <div className="practice-problem-pane">
              {tab === 'problem' ? (
                <>
                  <span className="practice-diff diff-easy">Easy</span>
                  <h3>Two Sum</h3>
                  <p>
                    Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>.
                  </p>
                  <p>You may assume each input has exactly one solution, and you may not use the same element twice.</p>
                  <div className="practice-example">
                    <span>Example</span>
                    <code>nums = [2, 7, 11, 15], target = 9</code>
                    <code>Output: [0, 1]</code>
                  </div>
                </>
              ) : (
                <p className="practice-empty">No submissions yet. Run and submit your solution to see it here.</p>
              )}
            </div>

            <div className="practice-code-pane">
              <div className="practice-code-toolbar">
                <select value={lang} onChange={(e) => { setLang(e.target.value); setResult(null); }} aria-label="Language">
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
                <div className="practice-code-actions">
                  <button type="button" className="practice-btn-ghost" onClick={() => setResult('run')}>
                    <Play size={14} /> Run
                  </button>
                  <button type="button" className="practice-btn-solid" onClick={() => setResult('submit')}>
                    <Send size={14} /> Submit
                  </button>
                </div>
              </div>
              <pre className="practice-code">
                {STARTERS[lang].map((line, i) => (
                  <div key={i} className="practice-code-line">
                    <span className="ln">{i + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </pre>
              {result && (
                <div className="practice-result">
                  <CheckCircle2 size={15} />
                  {result === 'run' ? 'Sample tests passed 2/2' : 'Accepted: all test cases passed'}
                </div>
              )}
              <div className="practice-statusbar">
                <span>Ln 5, Col 24</span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workspace CTA ── */}
      <section className="practice-section">
        <div className="practice-cta">
          <h2>Ready to practice Two Sum?</h2>
          <p>Compile in real time, get instant test feedback and watch your rank climb with every solved problem.</p>
          <button type="button" className="practice-btn-primary" onClick={scrollToProblems}>
            Start Practicing Now <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* ── Problem set ── */}
      <section className="practice-section" id="practice-problems">
        <div className="practice-table-head">
          <h2 className="practice-h2">Curated Problem Set</h2>
          <a href="https://www.cipherschools.com/practice" target="_blank" rel="noopener noreferrer">
            View all problems <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="practice-table" role="table">
          <div className="practice-row practice-row-head" role="row">
            <span>Title</span><span>Topic</span><span>Difficulty</span>
          </div>
          {PROBLEMS.map((p) => (
            <div key={p.title} className="practice-row" role="row">
              <span className="practice-row-title">{p.title}</span>
              <span className="practice-row-topic">{p.topic}</span>
              <span><i className={`practice-diff diff-${p.difficulty.toLowerCase()}`}>{p.difficulty}</i></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PracticePage;
