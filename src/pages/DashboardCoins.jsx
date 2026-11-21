import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Copy, Flame, Lock } from 'lucide-react';
import { CheckinDots, Coin, LevelBadge, MissionRow } from '../components/CipherCoinParts';
import {
  CHECKIN_LADDER, LEVELS, REFERRAL_FRIEND, REFERRAL_REWARD, buildMissions, fmtCoins, referralCode
} from '../utils/cipherCoins';

/* ══════════════════════════════════════════════════════════════
   CipherCoins — /dashboard/coins
   Top: streak card + level card. Tabs: Missions · Levels ·
   How to earn · Rewards (coming soon) · History.
   Check-in is automatic on the first visit of the day.
   ══════════════════════════════════════════════════════════════ */

const TABS = [
  { id: 'missions', label: 'Missions' },
  { id: 'levels', label: 'Levels' },
  { id: 'earn', label: 'How to earn' },
  { id: 'rewards', label: 'Rewards', soon: true },
  { id: 'history', label: 'History' }
];

const EARN = [
  { title: 'Daily check-in', coins: `${CHECKIN_LADDER[0]}–${CHECKIN_LADDER[CHECKIN_LADDER.length - 1]}`, how: 'Automatic when you open the dashboard. Each day in a row pays more; day 7 pays 75.' },
  { title: 'Daily missions', coins: '20–50', how: 'Watch 2 lectures, solve 3 questions, attempt a test. Clear all three for a 50-coin bonus.' },
  { title: 'Practice missions', coins: '20–1,200', how: '15 questions in a week, and 1, 10, 25, 50, 100 and 250 questions solved.' },
  { title: 'Learning streaks', coins: '40–750', how: '3, 7, 14 and 30 days in a row with a lecture, question, test or mock.' },
  { title: 'Milestones', coins: '20–200', how: 'First lecture, 25 lectures, a full section, first and fifth test, first mock interview.' },
  { title: 'Referrals', coins: `${REFERRAL_REWARD} each`, how: `When a friend buys a plan with your code; they get ${REFERRAL_FRIEND} too.` },
  { title: 'Bonuses', coins: '30–100', how: 'Welcome bonus, a complete profile, your first finished Planner task.' }
];

const REWARDS = [
  { title: 'Resume review by an expert', cost: 1500 },
  { title: 'Extra mock interview', cost: 2500 },
  { title: 'Certificate of excellence', cost: 3000 },
  { title: '1:1 mentor session', cost: 3500 },
  { title: 'CipherSchools merch', cost: 4000 },
  { title: '1-month plan extension', cost: 5000 }
];

const fmtWhen = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const DashboardCoins = ({ ctx }) => {
  const { coins } = ctx;
  const { level } = coins;
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'missions';
  const setTab = (id) => setParams(id === 'missions' ? {} : { tab: id }, { replace: true });
  const [copied, setCopied] = useState(false);

  const { groups } = buildMissions(ctx, coins);
  const ready = groups.flatMap((g) => g.items).filter((m) => m.status === 'ready');
  const code = referralCode(ctx.enrollment.learner?.name || 'Learner');
  const link = `${window.location.origin}/premium?ref=${code}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  const today = CHECKIN_LADDER[coins.ladderPos];

  return (
    <div className="dx-cc">
      <section className="dx-cc-top">
        {/* Streak */}
        <div className="dx-cc-streak">
          <div className="dx-cc-streak-num">
            <strong>{coins.checkinStreak}</strong>
            <span>day streak</span>
          </div>
          <CheckinDots coins={coins} onDark />
          <small>Checked in today · +{today}</small>
          <Flame className="dx-cc-streak-art" strokeWidth={1.6} aria-hidden="true" />
        </div>

        {/* Level + balance */}
        <div className="dx-cc-level">
          <LevelBadge level={level.level} state="current" size={72} />
          <div className="dx-cc-level-text">
            <small>Level {level.level}</small>
            <strong><Coin size={20} /> {fmtCoins(coins.balance)}</strong>
            {level.next ? (
              <>
                <span className="dx-cc-bar" aria-hidden="true"><span style={{ width: `${level.pct}%` }} /></span>
                <em>{fmtCoins(level.next - coins.earned)} coins to Level {level.level + 1}</em>
              </>
            ) : <em>Top level reached</em>}
          </div>
        </div>
      </section>

      <div className="dx-cc-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {t.soon && <em>Soon</em>}
            {t.id === 'missions' && ready.length > 0 && <span className="dx-cc-count">{ready.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'missions' && (
        <div className="dx-cc-missions">
          {ready.length > 1 && (
            <div className="dx-cc-ready">
              <span>{ready.length} missions ready · <b>+{fmtCoins(ready.reduce((a, m) => a + m.reward, 0))}</b></span>
              <button type="button" className="dx-ms-cta is-claim" onClick={() => coins.claimMany(ready)}>Claim all</button>
            </div>
          )}
          <div className="dx-cc-list">
            {groups.map((g) => (
              <section key={g.id} className="dx-cc-group">
                <header><h3>{g.title}</h3><span>{g.note}</span></header>
                {g.items.map((m) => <MissionRow key={m.key} m={m} onClaim={coins.claim} />)}
              </section>
            ))}
            <section className="dx-cc-group dx-cc-ref">
              <header><h3>Refer a friend</h3><span>+{REFERRAL_REWARD} per friend</span></header>
              <p>When a friend buys a plan with your code, you get {REFERRAL_REWARD} coins and they get {REFERRAL_FRIEND}.</p>
              <div className="dx-cc-code">
                <strong>{code}</strong>
                <button type="button" className="dx-btn dx-btn-ghost dx-btn-sm" onClick={copy}>{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy invite link</>}</button>
              </div>
              <small className="dx-cc-muted">Friends joined: 0</small>
            </section>
          </div>
        </div>
      )}

      {tab === 'levels' && (
        <section className="dx-cc-panel">
          <div className="dx-cc-levels">
            {LEVELS.map((need, i) => {
              const n = i + 1;
              const state = n < level.level ? 'passed' : n === level.level ? 'current' : 'locked';
              return (
                <div key={n} className={`dx-cc-lv is-${state}`}>
                  <LevelBadge level={n} state={state} size={60} />
                  <strong>Level {n}</strong>
                  <small>{state === 'passed' ? 'Passed' : state === 'current' ? 'Your level' : `${fmtCoins(need)} coins`}</small>
                </div>
              );
            })}
          </div>
          <p className="dx-cc-muted">Levels go by the coins you've earned in total, so spending coins later never drops your level.</p>
        </section>
      )}

      {tab === 'earn' && (
        <section className="dx-cc-panel dx-cc-earn">
          <ul>
            {EARN.map((e) => (
              <li key={e.title}>
                <span><strong>{e.title}</strong><small>{e.how}</small></span>
                <span className="dx-ms-reward"><Coin size={13} /> {e.coins}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'rewards' && (
        <section className="dx-cc-panel">
          <p className="dx-cc-muted dx-cc-soon">The rewards store is coming soon. Coins you earn now carry over.</p>
          <ul className="dx-cc-rewards">
            {REWARDS.map((r) => (
              <li key={r.title}>
                <span><strong>{r.title}</strong><small><Coin size={12} /> {fmtCoins(r.cost)}</small></span>
                <span className="dx-cc-lock"><Lock size={13} /> Soon</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'history' && (
        <section className="dx-cc-panel dx-cc-history">
          {coins.store.ledger.length ? (
            <ul>
              {[...coins.store.ledger].reverse().slice(0, 50).map((e) => (
                <li key={`${e.id}:${e.at}`}>
                  <span><strong>{e.label}</strong><small>{fmtWhen(e.at)}</small></span>
                  <b>+{fmtCoins(e.amount)}</b>
                </li>
              ))}
            </ul>
          ) : <p className="dx-cc-muted">No coins yet.</p>}
        </section>
      )}
    </div>
  );
};

export default DashboardCoins;
