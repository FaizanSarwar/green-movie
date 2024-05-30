import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import Button from '../common/Button';
import Seo from '../common/Seo';

const ProductPlanPage = () => {
  const router = useRouter();
  const SelectedItem = router.query.from || '';
  const pageSeo = {
    title: 'The Green Channel | Honest & Impactful Documentary Channel',
    description:
      'TGC is your go-to documentary channel for authentic films and series on compelling topics from animal rights to environmental activism. Start watching now!',
    keyword: 'documentary channel',
  };

  const [plans, setPlans] = useState([null]);
  const [subscriptionFrom, setSubscriptionFrom] = useState('monthly');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [continueConfirmationAccount, setContinueConfirmationAccount] =
    useState(false);
  const fetchData = () => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        '/wp-json/tgc/v1/site/subscription/plans'
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPlans(data.data.monthly);
      });
  };

  const openNoticeModal = (action = 'add') => {
    const from = router?.query?.from || '';
    const lastPageUrl = router?.query?.redirect || '';
    setSubscriptionFrom(from);
    setRedirectUrl(lastPageUrl);
    if (action === 'add') {
      window.document
        .getElementById('product-plan-container')
        .classList.add('page-opacity');
      setContinueConfirmationAccount(true);
    } else {
      window.document
        .getElementById('product-plan-container')
        .classList.remove('page-opacity');
      setContinueConfirmationAccount(false);
    }
  };

  const onScroll = () => {
    const { pageYOffset } = window;
    if (pageYOffset > 264) {
      window.jQuery('#header-logo').removeClass('hide-header-logo');
      window.jQuery('#header-logo').addClass('show-header-logo');
    } else {
      window.jQuery('#header-logo').removeClass('show-header-logo');
      window.jQuery('#header-logo').addClass('hide-header-logo');
    }
  };

  useEffect(() => {
    //fetch subscription plan price
    fetchData();
    //add eventlistener to window
    window.addEventListener('scroll', onScroll, { passive: true });
    window.jQuery('#header-logo').addClass('hide-header-logo');
    window.jQuery('#right-menu').addClass('hide-header-logo');
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true });
      window
        .jQuery('.menu-main-menu-container')
        .removeClass('hide-header-logo');
    };
  }, []);

  return (
    <>
      <Seo seo={pageSeo} />
      <div className="index-page-container">
        <div className="select-plan-container">
          <div style={{ zIndex: '1' }} className="container">
            <h2
              className="font-size contact-us-title"
              style={{ fontWeight: 'bold' }}>
              Select a plan
            </h2>
          </div>
        </div>

        <div id="product-plan-container" className="product-plan-container">
          <div className="container">
            <p className=" p-margin guest-landing-paragraph-text-small ft-26 contact-us-title">
              Stream unique and impactful environmental films, on Amazon FireTV,
              Apple TV, Roku devices, iPhones, iPads, and on your computer,
              Ad-Free. Choose a package that best suits your needs.
            </p>
            <div className="product-plan-box-container">
              <div
                className={
                  SelectedItem === 'subscription'
                    ? 'product-plan-box selected-sample-plan'
                    : 'product-plan-box'
                }>
                <h2>Subscribe</h2>
                <p className="first-paragraph">
                  {' '}
                  For {plans && plans.currency_symbol}
                  {plans && plans.value} per month
                </p>
                <hr />
                <p className="second-paragraph">
                  {' '}
                  Change or cancel your package anytime.
                </p>
                <Link
                  passHref
                  href={`${PageRoutes.SIGNUP}?from=subscription&redirect=${
                    router?.query?.redirect || ''
                  }`}>
                  <Button className={`buttonStyle`}>Subscribe</Button>
                </Link>
              </div>

              <div
                className={
                  SelectedItem === 'sample' || SelectedItem === 'rent-create'
                    ? 'product-plan-box selected-sample-plan'
                    : 'product-plan-box'
                }>
                <h2>Video on Demand</h2>
                <p className="first-paragraph">
                  Access samples free of charge as well as paid content.
                </p>
                <p className="second-paragraph">
                  {' '}
                  By creating a VOD account you can watch the films in our VOD
                  library on a pay-as-you-go basic. Or just watch the free
                  samples.
                </p>
                <hr />
                <Link passHref href={''}>
                  <Button
                    onClick={() => openNoticeModal()}
                    className={`buttonStyle`}>
                    {' '}
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="select-plan-faq-section">
              <div className="mt-5 white-color ft-40 ft-weight-600 select-plan-faq-font">
                FAQ
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  What is The Green Channel?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  The Green Channel is a streaming service that offers shorts,
                  series, and feature films with a connection to environmental
                  themes. Although most of our content is factual or
                  documentaries, our library has a growing number of comedies,
                  dramas, and reality films. If you are a full member, you can
                  watch as much as you want and as often as you want. We also
                  offer Video-on-Demand &#40;VOD&#41; for those viewers that
                  would like to just rent one film. And we also have a sample
                  section so you can try us out if you are not familiar with The
                  Green Channel. We add at least one new film per week and, as
                  our subscriber base grows, we hope to add even more content on
                  a daily and weekly basis in the future.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  How much does The Green Channel cost?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  Full subscriptions are &#36;9.99 CAD. No contract. No hidden
                  costs. Video-on-Demand is &#36;4.99 per film. Samples are free
                  with a simple newsletter sign up.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  Why do I need to provide my credit card information to watch a
                  sample?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  We use your credit card information to determine that you are
                  a real person and not a bot. We set the value on our back-end
                  to zero so your credit card will not be charged.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  How can I watch?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  You can watch anywhere and anytime. The schedule is up to you.
                  You can connect to our channel through your phone, smart TVs,
                  tablets, streaming media players and game consoles. We have
                  apps on Roku, Fire, Google Play and all Apple devices.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  How can I cancel my subscription?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  You can simply go into your account and unsubscribe. There are
                  no cancellation fees so you can stop or start your account
                  anytime.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  What can I expect to see on The Green Channel?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  The Green Channel was founded by Scott Renyard, a filmmaker
                  specializing in environmental content. So right from the
                  moment the channel was launched, there was a commitment to
                  create original content for our members. You will see
                  documentaries, features, series, comedies and more. The Green
                  Channel also seeks out unique, thought-provoking films from
                  all over the world.
                </div>
              </div>

              <div className="select-plan-faq-qa mt-4 mb-10">
                <div className="select-plan-faq-question white-color ft-36 ft-weight-600">
                  Is The Green Channel good for all ages?
                </div>
                <div className="select-plan-faq-answer ft-19">
                  Most of The Green Channel library is educational. But we
                  recommend that teachers and parents watch the content before
                  sharing with young children. Some content may be too serious
                  or disturbing for kids.
                </div>
              </div>
            </div>
          </div>
        </div>
        {continueConfirmationAccount && (
          <div className="d-flex justify-content-center">
            <div className="notice-subscription-container col-md-6 col-sm-12 col-lg-6 4 br-20">
              <div className="text-center mb-5 mt-5">
                <h3 className="font-weight-bold text-uppercase">Notice</h3>
              </div>
              <div className="d-flex justify-content-center mt-5 mb-60">
                By creating an account, you are also joining our <br /> mailing
                list so we can send you notices, you can <br /> unsubscribe at
                any time
              </div>
              <div className="sign-info row px-md-2 mb-10">
                <div className="col col-12 col-md-6 order-2 col-sm-12 order-md-1">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      openNoticeModal('remove');
                    }}>
                    Cancel
                  </Button>
                </div>
                <div className="col col-12 col-md-6 col-sm-12 order-1">
                  <Button
                    type="submit"
                    fullWidth
                    onClick={() => {
                      const url = `${PageRoutes.SIGNUP}?from=${
                        SelectedItem === 'sample' ? 'sample' : 'rent-create'
                      }`;
                      if (redirectUrl) {
                        url += `&redirect=${encodeURIComponent(redirectUrl)}`;
                      }
                      router.push(url);
                    }}>
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPlanPage;
