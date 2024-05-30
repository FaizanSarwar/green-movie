/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import {
  createSubscription,
  validateUser,
  updateUserBilling,
} from '../../services/apiService';
import { useRouter } from 'next/router';
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
import { countries } from '../../config/Constants';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID
);

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

const InjectedPaymentForm = ({
  activeStep,
  previousStep,
  getCradDetails,
  cardDetails,
  isPayment,
  req,
  nextStep,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  let isUserSubscriptionEnable = false;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentForm, setIsPaymentForm] = useState(true);

  const dollarUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' });

  const backHandler = async () => {
    if (isPaymentForm) {
      previousStep();
    } else {
      setIsPaymentForm(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePayment = async (data) => {
    setIsProcessing(true);
    if (isPaymentForm) {
      try {
        if (!stripe || !elements) {
          return;
        }
        setIsPaymentForm(false);
      } catch (e) {
        NotificationManager.error(
          'Please enter correct card details.',
          '',
          4000
        );
        setIsProcessing(false);
      }
    } else {
      const card = elements.getElement(CardNumberElement);
      const cardPayload = {
        type: 'card',
        card,
        billing_details: {
          address: {
            city: data.city,
            country: data.country,
            line1: data.billingAddressLine1,
            line2: data.billingAddressLine2,
            state: data.state,
            postal_code: data.postalCode,
          },
          phone: data.phone,
        },
      };
      validateUser()
        .then((resp) => {
          if (resp.success) {
            isUserSubscriptionEnable = resp.data.data.subscription_enabled;
          }
        })
        .catch(() => {
          // skip error
        });
      if (!isUserSubscriptionEnable) {
        const res = await stripe.createPaymentMethod(cardPayload);
        if (res) {
          const data = {
            payment_method_id: res.paymentMethod.id,
            subscription_type: 'monthly',
          };
          const subRes = await createSubscription(data);
          if (subRes.success) {
            const clientSecret = subRes.data.data.client_secret;
            if (clientSecret) {
              const paymentResult = await stripe.confirmCardPayment(
                clientSecret,
                {
                  payment_method: res.paymentMethod.id,
                }
              );
              if (paymentResult.error) {
                NotificationManager.error(
                  paymentResult.error.message,
                  '',
                  4000
                );
              }
              if (paymentResult.paymentIntent.status === 'succeeded') {
                nextStep();
              }
            } else {
              NotificationManager.error(
                'Please enter valid card details.',
                '',
                4000
              );
              setIsProcessing(false);
            }
          } else {
            NotificationManager.error(
              'Please enter valid card details.',
              '',
              4000
            );
            setIsProcessing(false);
          }
        }
      } else {
        nextStep();
      }
    }
  };

  const handleHomeRoute = () => {
    router.replace(PageRoutes.HOME);
  };

  return (
    <form
      name="signup-form"
      id="signup-form"
      onSubmit={handleSubmit(handlePayment)}>
      <div style={{ display: isPaymentForm ? 'block' : 'none' }}>
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
      <div style={{ display: !isPaymentForm ? 'block' : 'none' }}>
        <div className="col col-12">
          <div className="form-group">
            <select
              type=""
              className="form-control auth-form-input mb-0"
              id="country"
              name="country"
              placeholder="Country"
              {...register('country')}>
              {countries.map((c) => (
                <option value={c.code}>{c.name}</option>
              ))}
            </select>

            {errors?.country && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="col col-12">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="billingAddressLine1"
              name="billingAddressLine1"
              placeholder="Billing Address (Line 1)"
              {...register('billingAddressLine1')}
            />
            {errors?.billingAddressLine1 && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="col col-12">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="billingAddressLine2"
              name="billingAddressLine2"
              placeholder="Billing Address (Line 2)"
              {...register('billingAddressLine2')}
            />
            {errors?.billingAddressLine2 && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="col col-12">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="city"
              name="city"
              placeholder="City"
              {...register('city')}
            />
            {errors?.city && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="col col-12">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="state"
              name="state"
              placeholder="State"
              {...register('state')}
            />

            {errors?.state && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="row px-3">
          <div className="col col-12 col-md-6">
            <div className="form-group">
              <input
                type="text"
                className="form-control auth-form-input mb-0"
                id="postalCode"
                name="postalCode"
                placeholder="Postal code"
                {...register('postalCode')}
              />
              {errors?.postalCode && (
                <div className="form-group error-label text-danger">
                  This field is required.
                </div>
              )}
            </div>
          </div>
          <div className="col col-12 col-md-6">
            <div className="form-group">
              <input
                type="text"
                className="form-control auth-form-input mb-0"
                id="phone"
                name="phone"
                placeholder="Phone"
                {...register('phone')}
              />
              {errors?.postalCode && (
                <div className="form-group error-label text-danger">
                  This field is required.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {activeStep === 1 && (
        <div className="sign-info row px-md-2">
          <div className="col col-12 col-md-6 order-2 order-md-1">
            <Button
              fullWidth
              variant="outlined"
              disabled={isProcessing}
              onClick={activeStep === 0 ? handleHomeRoute : backHandler}>
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
          </div>
          <div className="col col-12 col-md-6 order-1">
            <div className="d-flex justify-content-center">
              <Button
                form="signup-form"
                className="px-5"
                disabled={isProcessing}
                type="submit">
                {isProcessing ? (
                  <div className="d-flex">
                    <div className="loader"></div>
                    <div className="ml-1"> Processing...</div>
                  </div>
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

const Payment = (props) => (
  <Elements stripe={stripePromise}>
    <InjectedPaymentForm {...props} />
  </Elements>
);

export default Payment;
