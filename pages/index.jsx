import { useEffect } from 'react';
import GuestHomePage from '../components/pages/GuestLandingPage';
import { COOKIE_TGC_CK_LIST } from '../config/Constants';
import { parseCookies } from '../utils/CookieFormatter';
import { serialize } from 'cookie';
import { useRouter } from 'next/router';
import PageRoutes from '../config/PageRoutes';
import { validateUser } from '../services/tgcApi';

const Home = ({ isLoggedIn }) => {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push(PageRoutes.BROWSE);
    }
  }, [isLoggedIn]);

  return <GuestHomePage />;
};

export const getServerSideProps = async ({ req, res }) => {
  let areCookieOk = false;
  let cookies;
  if (req.headers.cookie) {
    cookies = parseCookies(req.headers.cookie);
    if (COOKIE_TGC_CK_LIST in cookies) {
      cookies[COOKIE_TGC_CK_LIST].split(',').forEach((cKey) => {
        if (cKey) {
          if (cookies[cKey]) {
            areCookieOk = true;
          }
        }
      });
    } else {
      areCookieOk = false;
    }
  } else {
    areCookieOk = false;
  }

  if (areCookieOk) {
    areCookieOk = true;
  } else {
    if (cookies) {
      let cookiesToSet = Object.keys(cookies).map((cKey) => {
        const isWordpress = cKey.includes('wordpress');
        return serialize(cKey, '', {
          domain: cKey.domain,
          path: isWordpress ? '/' : cKey.path,
          httpOnly: true,
          secure: true,
          sameSite: cKey.sameSite,
          expires: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        });
      });
      res.setHeader('Set-Cookie', cookiesToSet);
    }
  }

  return { props: { isLoggedIn: true } };
};

export default Home;
