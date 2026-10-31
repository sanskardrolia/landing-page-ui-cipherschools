import { useSyncExternalStore, useCallback } from 'react';

const MODE_KEY = 'cs-diwali-mode';
const DIYAS_KEY = 'cs-diwali-diyas';
const CLAIMED_KEY = 'cs-diwali-claimed';
const EVENT = 'cs-diwali-change';

export const DIYA_GOAL = 3;
export const COUPON_CODE = 'DEEPAWALI';
export const DISCOUNT_LABEL = 'X%'; // placeholder until the final discount is confirmed
export const PRO_URL = 'https://pro.cipherschools.com';

const read = (key) => {
  try { return localStorage.getItem(key) || ''; } catch { return ''; }
};

const write = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (cb) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
};

/* Deepawali mode on/off, shared between the toggle and the hero */
export const useDiwaliMode = () => {
  const on = useSyncExternalStore(subscribe, () => read(MODE_KEY) === '1', () => false);
  const toggle = useCallback(() => write(MODE_KEY, read(MODE_KEY) === '1' ? '0' : '1'), []);
  return [on, toggle];
};

/* Diyas collected on the hero + coupon claim state */
export const useDiyaCollection = () => {
  const raw = useSyncExternalStore(subscribe, () => read(DIYAS_KEY), () => '');
  const claimed = useSyncExternalStore(subscribe, () => read(CLAIMED_KEY) === '1', () => false);
  const collected = raw ? raw.split(',') : [];

  const collect = useCallback((id) => {
    const current = read(DIYAS_KEY);
    const list = current ? current.split(',') : [];
    if (list.includes(id) || list.length >= DIYA_GOAL) return false;
    write(DIYAS_KEY, [...list, id].join(','));
    return true;
  }, []);

  const claim = useCallback(() => write(CLAIMED_KEY, '1'), []);

  return { collected, count: collected.length, claimed, collect, claim };
};
