import { validateUser } from '../../services/tgcApi';
import { parseCookies } from '../../utils/CookieFormatter';
import { serialize } from 'cookie';
import { getClientIp } from '../../utils/getClientIp';
import { COOKIE_TGC_CK_LIST } from '../../config/Constants';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

const handler = async (req, res) => {
  const clientIp = getClientIp(req);
  const result = await validateUser(req.headers.cookie, clientIp);
  if (result.success) {
    const resCokkies = result?.headers['set-cookie'].map((ck) => {
      return parseCookies(ck);
    });

    // TGC + A custom cookie + userDetails cookie
    let TGC_CK_LIST_VALUE = '';
    let cookiesToSet = resCokkies.map((ck) => {
      const cKey = Object.keys(ck)[0];
      const isWordpress = cKey.includes('wordpress');
      TGC_CK_LIST_VALUE += `${cKey},`;

      const cOpts = {};
      if (ck.domain) {
        cOpts.domain = ck.domain;
      }
      cOpts.path = isWordpress ? '/' : ck.path;
      cOpts.httpOnly = true;
      cOpts.secure = true;

      if (isWordpress) {
        cOpts.expires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      }

      if (ck.expires) {
        cOpts.expiresAt = ck.expires;
      }
      if (ck['Max-Age']) {
        cOpts.maxAge = ck['Max-Age'];
      }
      if (ck.SameSite) {
        cOpts.sameSite = ck.SameSite;
      }

      return serialize(cKey, ck[cKey], cOpts);
    });

    // A custom cookie
    cookiesToSet.push(
      serialize(COOKIE_TGC_CK_LIST, TGC_CK_LIST_VALUE, {
        domain: process.env.NEXT_PUBLIC_DOMAIN,
        path: '/',
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      })
    );
    if (resCokkies) {
      res.setHeader('Set-Cookie', cookiesToSet);
      res.status(200).json(result.data);
    } else {
      res.status(500).json(result);
    }
  } else {
    res.status(500).json(result);
  }
};

export default handler;
