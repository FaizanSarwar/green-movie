import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import {
  createSubscription,
  updateUserBilling,
  validateUser,
} from '../../services/apiService';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import { NotificationManager } from 'react-notifications';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#424770',
      '::placeholder': {
        color: 'rgba(0,0,0,0.5)',
      },
    },
    invalid: {
      color: '#FF0000',
    },
  },
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID
);

let stripe;
let elements;

const PaymentForm = ({ nameClass, onConfirm, onClose, subscriptionType }) => {
  subscriptionType = subscriptionType === 'vod' ? 'vod' : 'monthly';
  stripe = useStripe();
  elements = useElements();
  let isUserSubscriptionEnable = false;
  let subscriptionStatus = '';
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' });
  const [activeStep, setActiveStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const previousStep = () => {
    setActiveStep(1);
  };

  useEffect(() => {
    window.jQuery(`.${nameClass}`).css('opacity', '0.2');
    return () => {
      window.jQuery(`.${nameClass}`).removeAttr('style');
    };
  }, []);

  const validateClientBilling = (data) => {
    if (!data.country) {
      return false;
    } else if (!data.billingAddressLine1) {
      return false;
    } else if (data.billingAddressLine2) {
      return false;
    } else if (data.state) {
      return false;
    } else if (data.postalCode) {
      return false;
    }
    return true;
  };

  const checkPaymentStatus = async () => {
    const res = await validateUser();
    if (res && res.success) {
      const data = res.data.data;
      if (
        data.subscription_enabled &&
        data.subscription_state !== undefined &&
        data.subscription_state &&
        data.subscription_state === 'payment_succeeded'
      ) {
        subscriptionStatus = data.subscription_state;
        onConfirm();
      } else if (
        data.subscription_state !== undefined &&
        data.subscription_state &&
        data.subscription_state === 'payment_failed'
      ) {
        NotificationManager.error(
          'Your subscription has not started due to failed payment. Please contact admin for further assistance or try again.',
          '',
          4000
        );
        subscriptionStatus = data.subscription_state;
      } else if (
        !data.subscription_enabled &&
        data.subscription_state !== undefined &&
        data.subscription_state &&
        data.subscription_state === 'subscribing'
      ) {
        checkPaymentStatus();
      }
    }
  };
  const getConfirmPayment = async (cardPayload, isSubscriptionEnable) => {
    if (
      !isSubscriptionEnable &&
      (subscriptionStatus === 'payment_failed' ||
        subscriptionStatus === 'none' ||
        !subscriptionStatus)
    ) {
      const res = await stripe.createPaymentMethod(cardPayload);
      if (res && res.paymentMethod) {
        const data = {
          payment_method_id: res.paymentMethod.id,
          subscription_type: subscriptionType || 'monthly',
        };
        const subRes = await createSubscription(data);
        if (subRes.success) {
          const resp = await validateUser();
          if (resp.success || resp.status === 'success') {
            const resData = resp.data.data;
            if (
              resData.subscription_state !== undefined &&
              resData.subscription_state
            ) {
              subscriptionStatus = resData.subscription_state;
            } else {
              subscriptionStatus = resData.subscription_enabled
                ? 'payment_succeeded'
                : '';
            }

            if (
              subscriptionStatus &&
              subscriptionStatus === 'payment_succeeded'
            ) {
              window.jQuery(`.${nameClass}`).css('opacity', '');
              onConfirm();
              // setFormSubmitted(false);
            } else if (
              subscriptionStatus &&
              subscriptionStatus === 'subscribing'
            ) {
              NotificationManager.info(
                'Your subscription is being verified. It may take some time to verify your payment.',
                '',
                4000
              );
              setTimeout(() => {
                checkPaymentStatus();
              }, 2000);
            } else if (
              subscriptionStatus &&
              subscriptionStatus === 'payment_failed'
            ) {
              NotificationManager.error(
                'Your subscription has not started due to failed payment. Please contact admin for further assistance or try again.',
                '',
                4000
              );
              setFormSubmitted(false);
            }
          }
        } else {
          NotificationManager.error(
            'Please enter correct card details.',
            '',
            4000
          );
          setFormSubmitted(false);
        }
      } else {
        NotificationManager.error('Something went wrong.', '', 4000);
        setFormSubmitted(false);
      }
    } else if (!isSubscriptionEnable && subscriptionStatus === 'subscribing') {
      NotificationManager.info(
        'Your subscription is being verified. It may take some time to verify your payment.',
        '',
        4000
      );
      setTimeout(() => {
        checkPaymentStatus();
      }, 2000);
    } else {
      onConfirm();
    }
  };

  const doPayment = async (cardPayload) => {
    try {
      validateUser()
        .then((resp) => {
          if (resp.success) {
            const resData = resp.data.data;
            let isSubscriptionEnable = false;
            let subscriptionStatus = 'none';
            if (resp.data.data === subscriptionType) {
              isSubscriptionEnable = resData.subscription_enabled;
              if (
                resData.subscription_state !== undefined &&
                resData.subscription_state
              ) {
                subscriptionStatus = resData.subscription_state;
              } else {
                subscriptionStatus = resData.subscription_enabled
                  ? 'payment_succeeded'
                  : '';
              }
            }
            getConfirmPayment(cardPayload, isSubscriptionEnable);
          }
        })
        .catch(() => {
          // Skip Error
        });
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = (data) => {
    if (activeStep === 1) {
      setFormSubmitted(true);
      if (!stripe || !elements) {
        setFormSubmitted(false);
        return;
      }
      const card = elements.getElement(CardNumberElement);
      const cardPayload = {
        type: 'card',
        card,
      };
      doPayment(cardPayload, data)
        .then((res) => {
          // Skip
        })
        .catch((e) => {
          // Skip
        });
    }
  };

  return (
    <>
      <div
        className="profile-form-modal subscription-model"
        style={{
          marginTop: nameClass === 'account-page-container' ? '-5rem' : '0rem',
        }}>
        <div className="text-center mb-5">
          <h3 className="font-weight-bold text-uppercase">
            {activeStep === 1 ? 'Card Information' : 'Billing Information'}
          </h3>
        </div>
        <form
          name="subscribe-form"
          id="subscribe-form"
          onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
            <div className="form-group">
              <CardNumberElement
                className="form-control auth-form-input mb-0"
                id="cardNumber"
                name="cardNumber"
                options={ELEMENT_OPTIONS}
              />
            </div>
            <div className="sign-info row mt-4">
              <div className="col col-12 col-md-6">
                <div className="form-group">
                  <CardExpiryElement
                    className="form-control auth-form-input mb-0"
                    id="cardExpiryDate"
                    name="cardExpiryDate"
                    options={ELEMENT_OPTIONS}
                  />
                </div>
              </div>
              <div className="col col-12 col-md-6">
                <div className="form-group">
                  <CardCvcElement
                    type="text"
                    className="form-control auth-form-input mb-0"
                    id="cardCvv"
                    name="cardCvv"
                    options={ELEMENT_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sign-info row px-md-2 mt-3">
            <div className="col col-12 col-md-6 order-2 order-md-1">
              <Button
                id="cencel-btn"
                disabled={formSubmitted}
                fullWidth
                variant="outlined"
                onClick={activeStep === 1 ? onClose : previousStep}>
                {activeStep === 1 ? 'Cancel' : 'Back'}
              </Button>
            </div>
            <div className="col col-12 col-md-6 order-1">
              <div className="d-flex justify-content-center">
                <Button
                  fullWidth
                  disabled={formSubmitted}
                  form="subscribe-form"
                  className="px-5"
                  type="submit">
                  {formSubmitted ? (
                    <div className="d-flex">
                      <div className="loader ml-4"></div>
                      <div className="ml-1"> Processing...</div>
                    </div>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const SubscribeModel = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentForm {...props} />
  </Elements>
);

export default SubscribeModel;
