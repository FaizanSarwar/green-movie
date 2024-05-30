import { serialize } from 'cookie';
import React from 'react';
import PageRoutes from '../config/PageRoutes';
import { parseCookies } from '../utils/CookieFormatter';

const SignOutPage = () => {
  return <div></div>;
};

export const getServerSideProps = async ({ req, res }) => {
  if (req.headers.cookie) {
    const resCokkies = parseCookies(req.headers.cookie || '');
    if (resCokkies) {
      let cookiesToSet = Object.keys(resCokkies).map((cKey) => {
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

  return {
    redirect: {
      destination: PageRoutes.SIGNIN,
      permanent: false,
    },
  };
};

export default SignOutPage;
