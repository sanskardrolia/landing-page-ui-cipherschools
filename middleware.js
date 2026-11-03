// Vercel Edge Middleware: password-gates the whole site.
// The password lives only in the SITE_PASSWORD env var on Vercel (never in the client bundle).

export const config = {
  matcher: '/:path*',
};

const COOKIE = 'cs_auth';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

function loginPage(error) {
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Protected</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0b0f;color:#fff;
       font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  form{width:min(360px,calc(100vw - 32px));padding:32px;border-radius:16px;background:#15151c;
       border:1px solid #26262f;display:flex;flex-direction:column;gap:14px}
  h1{margin:0;font-size:20px}
  p{margin:0;color:#9a9aa8;font-size:14px}
  input{padding:12px 14px;border-radius:10px;border:1px solid #2f2f3a;background:#0b0b0f;color:#fff;font-size:16px}
  input:focus{outline:2px solid #6c5ce7;border-color:transparent}
  button{padding:12px;border:0;border-radius:10px;background:#6c5ce7;color:#fff;font-size:16px;font-weight:600;cursor:pointer}
  .err{color:#ff6b6b;font-size:14px}
</style></head>
<body>
<form method="POST" autocomplete="off">
  <h1>This site is protected</h1>
  <p>Enter the password to continue.</p>
  <input type="password" name="password" placeholder="Password" autofocus required>
  ${error ? '<div class="err">Incorrect password. Try again.</div>' : ''}
  <button type="submit">Unlock</button>
</form>
</body></html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(req) {
  const password = process.env.SITE_PASSWORD;

  // Fail closed: if the env var is missing, don't expose the site.
  if (!password) {
    return new Response('SITE_PASSWORD is not configured.', { status: 500 });
  }

  const secret = process.env.AUTH_SECRET || '';
  const token = await sha256Hex(`${password}:${secret}:cs-auth-v1`);

  // Already authenticated?
  const cookie = getCookie(req, COOKIE);
  if (cookie && safeEqual(cookie, token)) return; // pass through to the site

  // Login submission
  if (req.method === 'POST') {
    let submitted = '';
    try {
      submitted = String((await req.formData()).get('password') || '');
    } catch {
      /* ignore */
    }
    const [a, b] = await Promise.all([sha256Hex(submitted), sha256Hex(password)]);
    if (safeEqual(a, b)) {
      const url = new URL(req.url);
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname + url.search,
          'set-cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }
    return loginPage(true);
  }

  return loginPage(false);
}
