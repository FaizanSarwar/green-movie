import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { NotificationManager } from 'react-notifications';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import 'react-step-progress-bar/styles.css';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { passwordStrength } from 'check-password-strength';
import { countries } from '../../config/Constants';

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

const titles = ['Donate', 'Donate', 'Donate', 'Donation Successful'];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID
);

const StepLabel = ({ index, accomplished }) => {
  const getLabel = () => {
    switch (index) {
      case 0:
        return 'Amount';
      case 1:
        return 'Card Information';
      case 2:
        return 'Billing Address';
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
      <span className="mt-5 text-center"> {getLabel()}</span>
    </div>
  );
};

let stripe;
let elements;

const InjectedPaymentForm = ({}) => {
  let isSubscriptionEnable = false;
  let subscriptionStatus = '';

  stripe = useStripe();
  elements = useElements();

  const router = useRouter();

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
  //const [isSignUp, setIsSignUp] = useState(false);
  //const [title, setTitle] = useState('');
  // const [card, setCard] = useState(null);

  const [activeButton, setActiveButton] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [activeFrequency, setActiveFrequency] = useState('');

  //this advances the uer to the next step of a multi-step process
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
  //end of the Nextstep

  //this move the user back to the previous step
  const previousStep = () => {
    setActiveStep((ps) => (ps === 0 ? 0 : ps - 1));
  };
  // end of the previousStep

  const onSubmit = async (data) => {
    setFormSubmitted(true);
    if (activeStep === 0) {
      nextStep();
      setFormSubmitted(false);
      /*if (!isSignUp) {
      signUpUser({
        username: '',
        email: data.email,
        password: data.chosenPassword
      })
        .then((res) => {
          if (res.success) {
            window.localStorage.setItem('mainProfileEmail', data.email);
            setIsSignUp(true);
            nextStep();
            setFormSubmitted(false);
          } else {
            NotificationManager.error(
              res.message || 'Something went wrong. Please try again.',
              '',
              4000
            );
            setFormSubmitted(false);
          }
        })
        .catch((e) => {
          NotificationManager.error(
            e?.response?.data?.message ||
              'Something went wrong. Please try again.',
            '',
            4000
          );
          setFormSubmitted(false);
          // reset();
        });
    } else {
      nextStep();
      setFormSubmitted(false);
    }*/
    } else if (activeStep === 1) {
      nextStep();
      setFormSubmitted(false);
    } else if (activeStep === 2) {
      nextStep();
      setFormSubmitted(false);
      /*
    try {
      if (!stripe || !elements) {
        return;
      }
      const card1 = elements.getElement(CardNumberElement);
      setTimeout(() => {
        nextStep();
        setFormSubmitted(false);
      }, 4000);
    } catch (e) {
      NotificationManager.error(
        'Please enter valid card details.',
        '',
        4000
      );
      setFormSubmitted(false);
    }
  */
    } else if (activeStep === 3) {
      setFormSubmitted(false);
      nextStep();
      /*

    
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
          postal_code: data.postalCode
        },
        phone: data.phone
      }
    };

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
        subscriptionStatus === 'none')
    ) {
      const res = await stripe.createPaymentMethod(cardPayload);
      if (res && res.paymentMethod) {
        const data = {
          payment_method_id: res.paymentMethod.id
        };
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
            .catch(() => {
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
      } else {
        NotificationManager.error('Something went wrong.', '', 4000);
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
    */
    }
  };
  const handleFrequencyButtonClick = (frequency) => {
    setActiveFrequency(frequency);
  };

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue);
    setCustomAmount(buttonValue.replace('$', ''));
  };

  const handleCustomAmountChange = (e) => {
    setActiveButton('');
    setCustomAmount(e.target.value);
  };

  const handleNextButtonClick = () => {
    window.scrollTo(0, 0);
    nextStep();
  };
  const onConfirm = () => {
    handleHomeRoute();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="index-page-container">
            <div className="select-plan-container">
              <div style={{ zIndex: '1' }} className="container">
                <h2
                  className="font-size contact-us-title"
                  style={{ fontWeight: 'bold' }}>
                  Donate
                </h2>
              </div>
            </div>

            <div id="donate-container" className="donate-container">
              <div className="container">
                <p className=" p-margin guest-landing-paragraph-text-small ft-26 contact-us-title">
                  Would you like to make this a monthly, yearly or one time
                  donation?
                </p>
                <div className="donate-section-container">
                  <div className="donation-form">
                    <div className="frequency-buttons">
                      <button
                        className={`frequency-button ${
                          activeFrequency === 'one-time' ? 'active' : ''
                        }`}
                        onClick={() => handleFrequencyButtonClick('one-time')}>
                        One Time
                      </button>
                      <button
                        className={`frequency-button ${
                          activeFrequency === 'monthly' ? 'active' : ''
                        }`}
                        onClick={() => handleFrequencyButtonClick('monthly')}>
                        Monthly
                      </button>
                      <button
                        className={`frequency-button ${
                          activeFrequency === 'yearly' ? 'active' : ''
                        }`}
                        onClick={() => handleFrequencyButtonClick('yearly')}>
                        Yearly
                      </button>
                    </div>

                    <button
                      className={`first-button amount-button ${
                        activeButton === '$50' ? 'active' : ''
                      }`}
                      onClick={() => handleButtonClick('$50')}>
                      <span
                        className={`circle ${
                          activeButton === '$50' ? 'active' : ''
                        }`}></span>
                      <span className="value-container">
                        <span className="circle-inner"></span>
                        <span className="value">$&nbsp;&nbsp;50</span>
                      </span>
                    </button>
                    <button
                      className={`second-button amount-button ${
                        activeButton === '$20' ? 'active' : ''
                      }`}
                      onClick={() => handleButtonClick('$20')}>
                      <span
                        className={`circle ${
                          activeButton === '$20' ? 'active' : ''
                        }`}></span>
                      <span className="value-container">
                        <span className="circle-inner"></span>
                        <span className="value">$&nbsp;&nbsp;20</span>
                      </span>
                    </button>
                    <button
                      className={`last-button amount-button ${
                        activeButton === '$100' ? 'active' : ''
                      }`}
                      onClick={() => handleButtonClick('$100')}>
                      <span
                        className={`circle ${
                          activeButton === '$100' ? 'active' : ''
                        }`}></span>
                      <span className="value-container">
                        <span className="circle-inner"></span>
                        <span className="value">$&nbsp;&nbsp;100</span>
                      </span>
                    </button>
                    <div className="custom-amount-container">
                      <div className="input-container">
                        <span
                          className={`input-circle ${
                            customAmount ? 'input-circle-active' : ''
                          }`}></span>
                        <span className="dollar-symbol">$</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className={`custom-amount-input ${
                            customAmount ? 'has-value' : ''
                          }`}
                        />
                        <span className="currency">USD</span>
                      </div>
                    </div>
                    <button
                      className="next-button donate-button"
                      onClick={handleNextButtonClick}>
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <CardInformation
            register={register}
            /*errors={errors}*/
            activeStep={activeStep}
          />
        );

      case 2:
        return (
          <CardInformation
            register={register}
            /* errors={errors}*/
            activeStep={activeStep}
          />
        );

      case 3:
        return <ConfirmMessage /*register={register} errors={errors} */ />;
      default:
        return <></>;
    }
  };
  const handleHomeRoute = () => {
    router.replace(PageRoutes.BROWSE);
  };

  return (
    <>
      {activeStep === 0 ? (
        <div className="index-page-container">
          <div className="select-plan-container">
            <div style={{ zIndex: '1' }} className="container">
              <h2
                className="font-size contact-us-title"
                style={{ fontWeight: 'bold' }}>
                Donate
              </h2>
            </div>
          </div>

          <div id="donate-container" className="donate-container">
            <div className="container donation-section">
              <p className=" p-margin guest-landing-paragraph-text-small ft-26 contact-us-title">
                Would you like to make this a monthly, yearly or one time
                donation?
              </p>
              <div className="donate-section-container">
                <div className="donation-form">
                  <div className="frequency-buttons">
                    <button
                      className={`frequency-button ${
                        activeFrequency === 'one-time' ? 'active' : ''
                      }`}
                      onClick={() => handleFrequencyButtonClick('one-time')}>
                      One Time
                    </button>
                    <button
                      className={`frequency-button ${
                        activeFrequency === 'monthly' ? 'active' : ''
                      }`}
                      onClick={() => handleFrequencyButtonClick('monthly')}>
                      Monthly
                    </button>
                    <button
                      className={`frequency-button ${
                        activeFrequency === 'yearly' ? 'active' : ''
                      }`}
                      onClick={() => handleFrequencyButtonClick('yearly')}>
                      Yearly
                    </button>
                  </div>

                  <button
                    className={`second-button amount-button ${
                      activeButton === '$20' ? 'active' : ''
                    }`}
                    onClick={() => handleButtonClick('$20')}>
                    <span
                      className={`circle ${
                        activeButton === '$20' ? 'active' : ''
                      }`}></span>
                    <span className="value-container">
                      <span className="circle-inner"></span>
                      <span className="value">$&nbsp;&nbsp;20</span>
                    </span>
                  </button>
                  <button
                    className={`first-button amount-button ${
                      activeButton === '$50' ? 'active' : ''
                    }`}
                    onClick={() => handleButtonClick('$50')}>
                    <span
                      className={`circle ${
                        activeButton === '$50' ? 'active' : ''
                      }`}></span>
                    <span className="value-container">
                      <span className="circle-inner"></span>
                      <span className="value">$&nbsp;&nbsp;50</span>
                    </span>
                  </button>

                  <button
                    className={`last-button amount-button ${
                      activeButton === '$100' ? 'active' : ''
                    }`}
                    onClick={() => handleButtonClick('$100')}>
                    <span
                      className={`circle ${
                        activeButton === '$100' ? 'active' : ''
                      }`}></span>
                    <span className="value-container">
                      <span className="circle-inner"></span>
                      <span className="value">$&nbsp;&nbsp;100</span>
                    </span>
                  </button>
                  <div className="custom-amount-container">
                    <div className="input-container">
                      <span
                        className={`input-circle ${
                          customAmount ? 'input-circle-active' : ''
                        }`}></span>
                      <span className="dollar-symbol">$&nbsp;&nbsp;</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className={`custom-amount-input ${
                          customAmount ? 'has-value' : ''
                        }`}
                      />
                      <span className="currency">USD</span>
                    </div>
                  </div>
                  <button
                    className="next-button donate-button"
                    onClick={handleNextButtonClick}>
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="donate-page-container d-flex justfy-content-center">
          <div className="row mt-md-5 mt-0 pt-md-5 pt-0 justify-content-center align-items-center height-self-center m-auto p-3">
            <div className="col-12 donate-user_card donate-form-container">
              <div className="sign-in-page-data">
                <h3
                  className="mb-4 text-center px-2"
                  style={{ fontWeight: 'bolder' }}>
                  {titles[activeStep]}
                </h3>
                <div className="mb-5">
                  <ProgressBar
                    percent={activeStep > 0 ? (activeStep + 1) * 33.33 : 0}
                    height={3}
                    filledBackground="#6dd400">
                    <Step>{StepLabel}</Step>
                    <Step>{StepLabel}</Step>
                    <Step>{StepLabel}</Step>
                    <Step>{StepLabel}</Step>
                  </ProgressBar>
                </div>
                <div className="donate-in-from w-100 m-auto mt-2 px-md-5">
                  <form
                    name="donate-form"
                    id="donate-form"
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="donate-form-inputs-wrapper d-flex align-items-center flex-column">
                      {activeStep !== 0 && (
                        <div className="w-100">{renderStepContent()}</div>
                      )}
                    </div>
                    {activeStep !== 0 && activeStep !== 3 && (
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
                              form="donate-form"
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
                        <Button onClick={onConfirm}>Okay</Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

//end of injected payment which is a component

const CardInformation = ({ register, errors, activeStep }) => {
  return (
    <>
      <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            autoComplete="off"
            /*disabled={isSignUp ? true : false}*/
            /* {...register('email', {
            required: true,
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Please enter a valid email address.'
            }
          })}*/
          />
          {/*errors?.email && (
          <div className="form-group error-label text-danger">
            Please enter a valid email address.
          </div>
        )*/}
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            autoComplete="off"
            /*disabled={isSignUp ? true : false}*/
            /* {...register('email', {
            required: true,
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Please enter a valid email address.'
            }
          })}*/
          />
          {/*errors?.email && (
          <div className="form-group error-label text-danger">
            Please enter a valid email address.
          </div>
        )*/}
        </div>

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
                placeholder="Card Expiry Date"
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
                placeholder="CVV"
                options={ELEMENT_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
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
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
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
        <div className="col col-12 col-md-4">
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
          <div className="col col-6">
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
        </div>

        <div className="row px-3">
          <div className="col col-6">
            <div className="form-group">
              <input
                type="text"
                className="form-control auth-form-input mb-0"
                id="phone"
                name="phone"
                placeholder="Phone"
                {...register('phone')}
              />
              {errors?.phone && (
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
    <div className="text-center mt-5">
      <div className="value">$500</div>
      <div className="message">Thank you for your donation.</div>
      <style>{`
        .value {
          font-size: 30px !important;
          line-height: 1;
          font-weight: bolder;
          margin-right: 60px;
          margin-bottom: 20px;
        }

        .message {
          font-size: 20px;
        }

        @media (max-width: 767px) {
          .value {
            font-size: 30px;
          }

          .message {
            font-size: 25px;
          }
        }
      `}</style>
    </div>
  );
};

const DonateForm = () => (
  <Elements stripe={stripePromise}>
    <InjectedPaymentForm />
  </Elements>
);

export default DonateForm;
