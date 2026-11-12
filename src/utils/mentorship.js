import { MENTOR_CREDITS_INCLUDED } from '../data/learnerModules';

/* 1:1 Mentorship credits: included credits + bought credits − meetings booked.
   Cancelling a booking removes it, which gives the credit back. */
export const mentorCredits = (progress) => {
  const bought = Object.values(progress.mentorCredits || {}).reduce((a, n) => a + n, 0);
  const used = Object.keys(progress.mentorBookings || {}).length;
  return { included: MENTOR_CREDITS_INCLUDED, bought, used, left: Math.max(0, MENTOR_CREDITS_INCLUDED + bought - used) };
};

export const mentorCreditsLeft = (progress) => mentorCredits(progress).left;
