// No analytics vendor is installed in this project. Events are pushed to
// window.dataLayer only if a tag manager has already created it.
export const track = (event, props = {}) => {
  if (typeof window === 'undefined') return;
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...props });
  }
};
