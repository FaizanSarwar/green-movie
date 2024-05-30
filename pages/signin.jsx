import React from 'react';
import SignInForm from '../components/auth/SignInForm';
import { COOKIE_TGC_CK_LIST } from '../config/Constants';
import PageRoutes from '../config/PageRoutes';
import { parseCookies } from '../utils/CookieFormatter';
import Seo from '../components/common/Seo';

const SignInPage = () => {
  const pageSeo = {
    title: 'Login for The Green Channel Documentary Films & Series',
    description:
      "Thanks for watching The Green Channel! We're passionate about shining new light on current global challenges and the creative solutions that may inspire change.",
    keyword: 'the green channel'
  };
  return (
    <>
      <Seo seo={pageSeo} />
      <div className="auth-page-container d-flex justfy-content-center">
        <SignInForm />
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  if (req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);

    if (COOKIE_TGC_CK_LIST in cookies) {
      let areCookieOk = true;
      cookies[COOKIE_TGC_CK_LIST].split(',').forEach((cKey) => {
        if (cKey) {
          if (!cookies[cKey]) {
            areCookieOk = false;
          }
        }
      });

      if (areCookieOk) {
        return {
          redirect: {
            destination: PageRoutes.HOME,
            permanent: false
          }
        };
      }
    }
  }
  return { props: {} };
};

export default SignInPage;
