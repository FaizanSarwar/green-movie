import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPassword';
// import Seo from '../components/common/Seo';

const ForgotPassword = () => {
  // const pageSeo = {
  //   title: 'Login for The Green Channel Documentary Films & Series',
  //   description:
  //     "Thanks for watching The Green Channel! We're passionate about shining new light on current global challenges and the creative solutions that may inspire change.",
  //   keyword: 'the green channel'
  // };
  return (
    <>
      {/* <Seo seo={pageSeo} /> */}
      <div className="auth-page-container d-flex justfy-content-center">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPassword;
