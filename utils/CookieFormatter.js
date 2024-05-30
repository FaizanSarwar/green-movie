import cookie from 'cookie';

// Get cookies information
export const parseCookies = (ck) =>
  cookie.parse(ck ? ck || '' : document.cookie);
