import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../common/Button';
import PageRoutes from '../../config/PageRoutes';

const InfoModel = ({
  isSample,
  isVod,
  isMonthly,
  isUserLogin,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    window.jQuery(`.details-container`).css('opacity', '0.2');
    return () => {
      window.jQuery(`.details-container`).removeAttr('style');
    };
  }, []);

  const SampleContent = ({ action }) => {
    return (
      <>
        <div className="row mt-5 mb-5">
          <div className="form-group">
            <div className="col-md-12">
              {action === 'sample' ? (
                <h6>
                  This content is available free of change for a limited time. A
                  valid TGC account is required to watch this content.
                </h6>
              ) : (
                <>
                  <h6>
                    This content is available for pay-per-view video on demand.
                  </h6>
                  <h6 className="mt-4">
                    Rent and watch this content now. You will have access to it
                    for 30 days. After you beign watching, you will have 48
                    hours to finish it.
                  </h6>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="sign-info row px-md-2 mb-5">
          <div className="col col-lg-12 col-md-12">
            <div className="d-flex justify-content-center">
              <Button
                disabled={false}
                className="px-5"
                onClick={() =>
                  onConfirm(action === 'sample' ? 'sample' : 'rent&create')
                }>
                Create An Account
              </Button>
            </div>
          </div>
        </div>
        {!isUserLogin && (
          <div className="row">
            <div className="col-md-12">
              If you already have a valid account,{' '}
              <Link passHref href={PageRoutes.SIGNIN}>
                <span className="info-login-text">Login to watch</span>
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div
        className="profile-form-modal subscription-model notice-subscription-container"
        style={{
          marginTop: '5rem',
        }}>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="text-center mb-5">
          <h3 className="font-weight-bold">
            {isUserLogin && isMonthly && !isSample && !isVod
              ? 'Purchase Monthly Subscription'
              : isSample
              ? 'Sample Content'
              : 'Paid Content'}
          </h3>
          {isSample && <SampleContent action="sample" />}

          {!isSample && isMonthly && (
            <>
              <div className="row mt-4 mb-5">
                <div className="form-group">
                  <div className="col-md-12">
                    {!isUserLogin && (
                      <h6>
                        A valid TGC account is required to watch this content.
                      </h6>
                    )}
                    <h6 className="mt-4">
                      This content is available on a monthly subscription plan.
                    </h6>
                    <h6>
                      Purchase a subscription to have access to this content and
                      many more per month.
                    </h6>
                  </div>
                </div>
              </div>
              <div className="sign-info row px-md-2 mb-4">
                <div className="col col-lg-12 col-md-12">
                  <div className="d-flex justify-content-center">
                    <Button
                      disabled={false}
                      className="px-5"
                      onClick={() => onConfirm('subscription')}>
                      {isUserLogin && isMonthly && !isSample && !isVod
                        ? 'Switch Plan'
                        : 'Subscribe to Watch'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
          {!isSample && isVod && isUserLogin && (
            <>
              <div className="row mt-5 mb-3">
                <div className="form-group">
                  <div className="col-md-12">
                    <h6>
                      This content is available for pay-per-view video on
                      demand.
                    </h6>
                    <h6 className="mt-4">
                      Rent and watch this content now. You will have access to
                      it for 30 days. After you beign watching, you will have 48
                      hours to finish it.
                    </h6>
                  </div>
                </div>
              </div>
              <div className="sign-info row px-md-2 mb-4">
                <div className="col col-lg-12 col-md-12">
                  <div className="d-flex justify-content-center">
                    <Button
                      disabled={false}
                      className="px-5"
                      onClick={() => onConfirm('rent')}>
                      Rent to Watch
                    </Button>
                  </div>
                </div>
              </div>
              {!isUserLogin && (
                <div className="row">
                  <div className="col-md-12">
                    If you already have a valid account,{' '}
                    <Link passHref href={PageRoutes.SIGNIN}>
                      <span className="info-login-text">Login to watch</span>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          {!isSample && !isUserLogin && <SampleContent action="rent" />}
        </div>
      </div>
    </>
  );
};

export default InfoModel;
