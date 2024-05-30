import { useRouter } from 'next/router';
import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import { COOKIE_TGC_CK_LIST } from '../config/Constants';
import PageRoutes from '../config/PageRoutes';
import { parseCookies } from '../utils/CookieFormatter';
import Seo from '../components/common/Seo';

const SignUpPage = () => {
  const router = useRouter();
  const email = router.query?.email || '';

  const pageSeo = {
    title: 'Watch the Best New Documentaries with Environmental Impact',
    description:
      "Don't miss out on the best new documentaries to hit the environmental, nature, and animal activist lists. Subscribe to The Green Channel TV to watch now!",
    keyword: 'best new documentaries'
  };

  return (
    <>
      <Seo seo={pageSeo} />
      <div className="auth-page-container d-flex justfy-content-center">
        <SignUpForm defaultEmail={email} />
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

export default SignUpPage;
