import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../common/Button';

const Product = ({ nameClass, onConfirm, onClose, type, page }) => {
  const [plans, setPlans] = useState([null]);

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

  const onScroll = () => {
    const { pageYOffset } = window;
    if (page !== 'account') {
      if (pageYOffset > 264) {
        window.jQuery('#header-logo').removeClass('hide-header-logo');
        window.jQuery('#header-logo').addClass('show-header-logo');
      } else {
        window.jQuery('#header-logo').removeClass('show-header-logo');
        window.jQuery('#header-logo').addClass('hide-header-logo');
      }
    }
  };

  useEffect(() => {
    //fetch subscription plan price
    fetchData();
    //add eventlistener to window
    window.addEventListener('scroll', onScroll, { passive: true });
    if (page !== 'account') {
      window.jQuery('#header-logo').addClass('hide-header-logo');
      window.jQuery('#right-menu').addClass('hide-header-logo');
    }
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true });
      window
        .jQuery('.menu-main-menu-container')
        .removeClass('hide-header-logo');
    };
  }, []);

  useEffect(() => {
    window.jQuery(`.${nameClass}`).css('opacity', '0.4');
    return () => {
      window.jQuery(`.${nameClass}`).removeAttr('style');
    };
  }, []);

  return (
    <>
      <div
        className="product-form-modal subscription-model"
        style={{
          marginTop: '-7rem',
        }}>
        <div className="d-flex justify-content-end" onClick={() => onClose()}>
          <a onClick={() => onClose()}>
            <i className="ri-close-line close-icon" />
          </a>
        </div>
        <div className="text-center mb-5">
          <h3 className="font-weight-bold text-uppercase">Select a plan</h3>
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
                  type === 'subscription'
                    ? 'product-plan-box modal-plan-view selected-sample-plan'
                    : 'product-plan-box modal-plan-view'
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
                <Button
                  onClick={() => onConfirm('monthly')}
                  className={`buttonStyle product-btn-btn`}>
                  Subscribe
                </Button>
              </div>

              <div
                className={
                  type === 'sample'
                    ? 'product-plan-box modal-plan-view selected-sample-plan'
                    : 'product-plan-box modal-plan-view'
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
                <Button
                  onClick={() => onConfirm('sample')}
                  className={`buttonStyle product-btn-btn`}>
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
