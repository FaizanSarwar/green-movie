/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  signUpUser,
  createSubscription,
  validateUser,
} from '../../services/apiService';
import { NotificationManager } from 'react-notifications';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import 'react-step-progress-bar/styles.css';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { passwordStrength } from 'check-password-strength';
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

const titles = [
  'Personal Information',
  'Why Credit Card?',
  'Card Information',
  'Success!',
];

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

const StepLabel = ({ index, accomplished }) => {
  const getLabel = () => {
    switch (index) {
      case 0:
        return 'Personal Information';
      case 1:
        return 'Disclaimer';
      case 2:
        return 'Card Information';
      case 3:
        return 'Done';
    }
  };

  return (
    <div
      className="stepper-label"
      style={{
        color: accomplished ? '#6dd400' : '#fff',
        backgroundColor: accomplished ? '#6dd400' : 'gray',
      }}>
      <span className="mt-5 text-center stepper-label-text"> {getLabel()}</span>
    </div>
  );
};
let stripe;
let elements;
const InjectedPaymentForm = ({ defaultEmail }) => {
  let isSubscriptionEnable = false;
  let subscriptionStatus = '';
  stripe = useStripe();
  elements = useElements();
  const router = useRouter();
  const subscriptionType =
    router.query.from && router.query.from === 'subscription'
      ? 'monthly'
      : 'sample';
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' });

  const [activeStep, setActiveStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [title, setTitle] = useState('');
  const [userDetail, setUserDetail] = useState({});

  const nextStep = () => {
    if (isValid) {
      setActiveStep((ps) => (ps === 4 ? 4 : ps + 1));
    } else {
      NotificationManager.error(
        'Please make sure details are entered properly.',
        '',
        4000
      );
    }
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

  const previousStep = () => {
    setActiveStep((ps) => (ps === 0 ? 0 : ps - 1));
  };

  const getConfirmPayment = async (cardPayload) => {
    if (subscriptionStatus && subscriptionStatus === 'payment_succeeded') {
      setFormSubmitted(false);
      nextStep();
    } else if (
      subscriptionStatus === 'subscribing' ||
      subscriptionStatus === 'none' ||
      !subscriptionStatus
    ) {
      NotificationManager.info(
        'Your subscription is being verified. It may take some time to verify your payment.',
        '',
        4000
      );
      setTimeout(() => {
        checkPaymentStatus();
      }, 2000);
      setFormSubmitted(false);
      nextStep();
    } else if (subscriptionStatus && subscriptionStatus === 'payment_failed') {
      NotificationManager.error(
        'Your subscription has not started due to failed payment. Please contact admin for further assistance or try again.',
        '',
        4000
      );
      setFormSubmitted(false);
    }
  };

  const onSubmit = async (data) => {
    setFormSubmitted(true);
    if (activeStep === 0) {
      const uDetails = {
        username: '',
        email: data.email,
        password: data.chosenPassword,
      };
      setUserDetail(uDetails);
      nextStep();
      setFormSubmitted(false);
    } else if (activeStep === 1) {
      setTimeout(() => {
        nextStep();
        setFormSubmitted(false);
      }, 1000);
    } else if (activeStep === 2) {
      try {
        if (!stripe || !elements) {
          return;
        }
        const card = elements.getElement(CardNumberElement);
        const cardPayload = {
          type: 'card',
          card,
        };
        const signupRes = await signUpUser(userDetail);
        if (signupRes && !signupRes.success) {
          NotificationManager.error(
            signupRes?.response?.data?.message ||
              'Something went wrong. Please try again.',
            '',
            4000
          );
          setFormSubmitted(false);
          return;
        } else {
          window.localStorage.setItem('mainProfileEmail', data.email);
          const resp = await validateUser();
          if (resp.success) {
            isSubscriptionEnable = resp.data.data.subscription_enabled;
            if (
              resp.data.data.subscription_state &&
              resp.data.data.subscription_state !== undefined
            ) {
              subscriptionStatus = resp.data.data.subscription_state;
            }
          }

          if (
            !isSubscriptionEnable &&
            (subscriptionStatus === 'payment_failed' ||
              subscriptionStatus === 'none' ||
              !subscriptionStatus)
          ) {
            const { error, paymentMethod } = await stripe.createPaymentMethod(
              cardPayload
            );
            if (error) {
              NotificationManager.error(
                error?.message || t('messages.commonError'),
                '',
                4000
              );
              return;
            }

            if (paymentMethod) {
              const data = {
                payment_method_id: paymentMethod.id,
                subscription_type: subscriptionType,
              };
              try {
                const subRes = await createSubscription(data);
                if (subRes.success) {
                  validateUser()
                    .then((resp) => {
                      if (resp.success) {
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
                        getConfirmPayment(cardPayload);
                      }
                    })
                    .catch((t) => {
                      // Skip error
                    });
                } else {
                  NotificationManager.error(
                    'Please enter correct card details.',
                    '',
                    4000
                  );
                  setFormSubmitted(false);
                }
              } catch (error) {
                NotificationManager.error(
                  e?.response?.data?.message ||
                    'Something went wrong. Please try again.',
                  '',
                  4000
                );
                setFormSubmitted(false);
              }
            } else {
              NotificationManager.error(
                'Something went wrong. Please try again.',
                '',
                4000
              );
              setFormSubmitted(false);
            }
          } else if (
            !isSubscriptionEnable &&
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
            setFormSubmitted(false);
            nextStep();
          } else {
            setFormSubmitted(false);
            nextStep();
          }
        }
      } catch (e) {
        NotificationManager.error(
          e?.response?.data?.message ||
            'Something went wrong. Please try again.',
          '',
          4000
        );
        setFormSubmitted(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInformation
            register={register}
            errors={errors}
            watch={watch}
            isSignUp={isSignUp}
          />
        );
      case 1:
        return <Disclaimer />;
      case 2:
        return (
          <CardInformation
            register={register}
            errors={errors}
            activeStep={activeStep}
          />
        );
      case 3:
        return <ConfirmMessage register={register} errors={errors} />;

      default:
        return <></>;
    }
  };

  const handleHomeRoute = (from = '') => {
    if (from === 'confirm') {
      router.replace(PageRoutes.BROWSE);
    } else {
      router.back();
    }
  };

  const onConfirm = () => {
    const redirectUrl = router?.query?.redirect || PageRoutes.BROWSE;
    router.replace(redirectUrl);
  };

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail);
    }
  }, [defaultEmail]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  }, []);

  return (
    <div className="row mt-md-5 mt-0 pt-md-5 pt-0 justify-content-center align-items-center height-self-center m-auto p-3">
      <div className="col-12 sign-user_card signup-form-container">
        <div className="sign-in-page-data">
          <h3
            className="mb-4 text-center px-2 text-uppercase"
            style={{ fontWeight: 'bolder' }}>
            {titles[activeStep]}
          </h3>
          <div className="mb-5">
            <ProgressBar
              percent={activeStep > 0 ? activeStep * 34 : 0}
              height={3}
              filledBackground="#6dd400">
              <Step>{StepLabel}</Step>
              <Step>{StepLabel}</Step>
              <Step>{StepLabel}</Step>
              <Step>{StepLabel}</Step>
            </ProgressBar>
          </div>
          <div className="sign-in-from w-100 m-auto mt-2 px-md-5">
            <form
              name="signup-form"
              id="signup-form"
              onSubmit={handleSubmit(onSubmit)}>
              <div className="signup-form-inputs-wrapper d-flex align-items-center flex-column">
                <div className="w-100"> {renderStepContent()}</div>
              </div>
              {activeStep !== 3 && (
                <div className="sign-info row px-md-2">
                  <div className="col col-12 col-md-6 order-2 order-md-1">
                    <Button
                      id="cencel-btn"
                      fullWidth
                      variant="outlined"
                      disabled={formSubmitted}
                      onClick={
                        activeStep === 0 ? handleHomeRoute : previousStep
                      }>
                      {activeStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                  </div>
                  <div className="col col-12 col-md-6 order-1">
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={formSubmitted}
                        fullWidth
                        form="signup-form"
                        className="px-5"
                        type="submit">
                        {formSubmitted ? (
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
              {activeStep === 3 && (
                <div className="d-flex justify-content-center">
                  <Button onClick={onConfirm}>Get Started</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalInformation = ({ register, errors, watch, isSignUp }) => {
  const pswd = useRef({});
  pswd.current = watch('chosenPassword', '');
  const [showPassword, setShowPassword] = useState(false);
  const opnts = [
    {
      id: 0,
      value: 'Too weak',
      minDiversity: 0,
      minLength: 10,
    },
    {
      id: 1,
      value: 'Weak',
      minDiversity: 1,
      minLength: 10,
    },
    {
      id: 2,
      value: 'Medium',
      minDiversity: 2,
      minLength: 10,
    },
    {
      id: 3,
      value: 'Strong',
      minDiversity: 3,
      minLength: 10,
    },
  ];

  const pswdStrength = passwordStrength(pswd.current, opnts);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="form-group mt-3">
        <input
          type="email"
          className="form-control auth-form-input mb-0"
          id="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="off"
          disabled={isSignUp ? true : false}
          {...register('email', {
            required: true,
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Please enter a valid email address.',
            },
          })}
        />
        {errors?.email && (
          <div className="form-group error-label text-danger">
            Please enter a valid email address.
          </div>
        )}
      </div>
      <div className="text-center mb-3">
        <span>10 characters minimum with mixed case letters and numbers.</span>
      </div>
      <div className="form-group">
        <div className="input-icon-container">
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control auth-form-input mb-0 d-inline-block pr-1"
            id="chosenPassword"
            name="chosenPassword"
            placeholder="Choose a password"
            disabled={isSignUp ? true : false}
            {...register('chosenPassword', {
              required: true,
              minLength: 10,
            })}
          />
          <i
            className={!showPassword ? 'ri-eye-fill' : 'ri-eye-off-fill'}
            onClick={togglePassword}></i>
        </div>

        {errors?.chosenPassword &&
          errors.chosenPassword.type === 'required' && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        {errors?.chosenPassword &&
          errors.chosenPassword.type === 'minLength' && (
            <div className="form-group error-label text-danger">
              Please enter minimum 10 characters password.
            </div>
          )}
      </div>
      <div className="form-group">
        <div className="input-icon-container">
          <input
            type="password"
            className="form-control auth-form-input mb-0 d-inline-block pr-1"
            id="cPassword"
            name="cPassword"
            placeholder="Confirm password."
            disabled={isSignUp ? true : false}
            {...register('cPassword', {
              required: true,
              validate: (value) => {
                if (value === pswd.current) return true;
                return false;
              },
            })}
          />
        </div>
        {errors?.cPassword && errors.cPassword.type === 'validate' && (
          <div className="form-group error-label text-danger">
            Confirm password do not match with password.
          </div>
        )}
      </div>
      <div className="text-center mt-4">
        <span>Password Strength Indicator</span>
        <div className="progress mt-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(pswdStrength.id * 25).toString()}%` }}
            aria-valuemin="0"
            aria-valuemax="100"></div>
        </div>
      </div>
    </>
  );
};

const Disclaimer = () => {
  return (
    <div className="text-center">
      <h5 className="disclaimer-text">
        We use your credit card information to determine that <br /> you are a
        real person and not a bot. We set the value <br />
        on our back-end to zero so your credit card will not be charged.
      </h5>
    </div>
  );
};

const CardInformation = ({ register, errors, activeStep }) => {
  return (
    <>
      <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
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
      <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
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
    </>
  );
};

const ConfirmMessage = () => {
  return (
    <div className="text-center">
      <h5
        style={{
          padding: '60px 0px',
          fontWeight: 'bolder',
          minWidth: 300,
          maxWidth: 500,
        }}>
        Enjoy select films, series and shorts free of charge.
        <br />
        <br />
        Thank you for supporting our filmmakers that make a difference by
        bringing their stories to the world!
      </h5>
    </div>
  );
};

const SignUpForm = (props) => (
  <Elements stripe={stripePromise}>
    <InjectedPaymentForm {...props} />
  </Elements>
);

export default SignUpForm;
