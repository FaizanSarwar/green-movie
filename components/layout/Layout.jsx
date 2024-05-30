/* eslint-disable @next/next/no-sync-scripts */
import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PageRoutes from '../../config/PageRoutes';
import { useRouter } from 'next/router';
import AuthPageHeader from '../common/AuthPageHeader';
import { NotificationContainer } from 'react-notifications';
import { validateUser, validateGeoIP } from '../../services/apiService';
import Forbidden from '../../pages/forbidden';

const Layout = ({ children }) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const router = useRouter();
  const validateInProgress = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [forbiddenMessage, setForbiddenMessage] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: 'Guest' });

  // useEffect(() => {
  //   validateGeoIP()
  //     .then(() => {
  //       if (validateInProgress.current) {
  //         return;
  //       }
  //       validateInProgress.current = 1;
  //       validateUser()
  //         .then((res) => {
  //           if (res.success) {
  //             const data = res.data.data;
  //             const uDetails = { username: 'Guest', photo: '/images/user.png' };
  //             if (data) {
  //               uDetails = {
  //                 ...data,
  //                 username: data.current_profile.name || '',
  //                 photo: data.current_profile.photo_url
  //                   ? data.current_profile.photo_url
  //                   : '/images/user.png',
  //               };
  //               setUserDetails(uDetails);
  //               validateInProgress.current = null;
  //             }
  //           }
  //         })
  //         .catch(() => {
  //           // Skip User
  //           validateInProgress.current = null;
  //         });
  //     })
  //     .catch((error) => {
  //       setForbiddenMessage(error?.response?.data?.message);
  //       setIsForbidden(true);
  //     });
  // }, [router.pathname]);

  if (isForbidden && !domain.includes('dev')) {
    return <Forbidden message={forbiddenMessage} />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {[
        PageRoutes.SIGNUP,
        PageRoutes.SIGNIN,
        PageRoutes.HOME,
        PageRoutes.FORGOTPASSWORD,
        PageRoutes.RESETPASSWORD,
        PageRoutes.PRODUCTPLAN,
      ].includes(router.pathname) &&
      ![PageRoutes.FORBIDDEN].includes(router.pathname) ? (
        <AuthPageHeader />
      ) : ![PageRoutes.FORBIDDEN].includes(router.pathname) ? (
        <Header isLoggedIn={isLoggedIn} userDetails={userDetails} />
      ) : null}
      <div
        id="app-container"
        className={`app-container no-smartapp-banner ${
          !isLoggedIn ? 'pt-0' : ''
        }`}>
        {children}
      </div>
      <Footer />
      <NotificationContainer />

      <script src="/js/jquery-3.4.1.min.js" />
      <script src="/js/popper.min.js" />
      <script src="/js/bootstrap.min.js" />
      <script src="/js/slick.min.js" />
      <script src="/js/jquery.magnific-popup.min.js" />
      <script src="/js/slick-animation.min.js" />
      <script src="/js/custom.js" />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
