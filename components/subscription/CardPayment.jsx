import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useForm } from 'react-hook-form';
import {
  updateUserBilling,
  modifySubscription,
} from '../../services/apiService';
import Button from '../common/Button';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import { rentFilm } from '../../services/apiService';
import { loadStripe } from '@stripe/stripe-js';
import { countries } from '../../config/Constants';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';

const titles = [
  'Select payment method',
  'New Card Information',
  'Billing Address',
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
        return 'Card Information';
      case 1:
        return 'Billing Address';
      case 2:
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
const InjectedForm = ({ filmId, title, upgradeText, onClose, onConfirm }) => {
  stripe = useStripe();
  elements = useElements();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const [selected, setSelected] = useState('new');
  const [isNewCard, setIsNewCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    window.jQuery(`.details-container`).css('opacity', '0.2');
    return () => {
      window.jQuery(`.details-container`).removeAttr('style');
    };
  }, []);

  const nextStep = () => {
    if (isValid) {
      setActiveStep((ps) => (ps === 2 ? 2 : ps + 1));
    } else {
      NotificationManager.error(
        'Please make sure details are entered properly.',
        '',
        4000
      );
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (activeStep === 0 && selected === 'old') {
      withOldCard();
    } else if (activeStep === 0 && selected === 'new') {
      nextStep();
      setIsLoading(false);
    } else if (activeStep === 1) {
      try {
        if (!stripe || !elements) {
          return;
        }
        // if (firstName && lastName) {
        const card = elements.getElement(CardNumberElement);
        const cardPayload = {
          type: 'card',
          card,
        };
        const { error, paymentMethod } = await stripe.createPaymentMethod(
          cardPayload
        );
        if (error) {
          NotificationManager.error(
            error?.message || 'Something went wrong. Please try again.',
            '',
            4000
          );
          setIsLoading(false);
          return;
        }
        if (paymentMethod && paymentMethod.id) {
          setPaymentId(paymentMethod?.id || '');
          nextStep();
          setIsLoading(false);
        }
        // } else {
        //   // Handle error
        // }
      } catch (error) {
        NotificationManager.error('Please enter valid card details.', '', 4000);
        setIsLoading(false);
      }
    } else if (activeStep === 2) {
      setIsLoading(true);
      const info = {
        city: event.target.elements.city.value,
        country: event.target.elements.country.value,
        line1: event.target.elements.billingAddressLine1.value,
        line2: event.target.elements.billingAddressLine2.value,
        postal_code: event.target.elements.postalCode.value,
        state: event.target.elements.state.value,
        phone: event.target.elements.phone.value,
        payment_method_id: paymentId,
      };
      if (info) {
        updateUserBilling(info)
          .then((res) => {
            if (res.success) {
              withOldCard(true);
            }
          })
          .catch((e) => {
            NotificationManager.error(
              e?.response?.data?.message ||
                'Something went wrong. Please try again.',
              '',
              4000
            );
            setIsLoading(false);
          });
      } else {
        NotificationManager.error('Please enter valid information.', '', 4000);
        setIsLoading(false);
      }
    }
  };
  const withOldCard = (isUpdate = false) => {
    if (upgradeText === 'rent') {
      if (selected === 'old' || isUpdate) {
        rentFilm(filmId)
          .then((res) => {
            if (res.success) {
              NotificationManager.success(
                res?.data?.status_msg
                  ? res?.data?.status_msg
                  : 'Film rental request success.',
                '',
                4000
              );
              if (isUpdate) {
                setActiveStep(3);
                setIsLoading(false);
              } else {
                setTimeout(() => {
                  onConfirm();
                }, 5000);
              }
            } else {
              NotificationManager.error(
                res?.message || 'Something went wrong. Please try again.',
                '',
                4000
              );
              setTimeout(() => {
                setIsLoading(false);
              }, 4500);
            }
          })
          .catch((e) => {
            NotificationManager.error(
              e?.response?.data?.message ||
                'Something went wrong. Please try again.',
              '',
              7000
            );
            setTimeout(() => {
              setIsLoading(false);
            }, 8000);
          });
      }
    } else {
      const payload = {
        new_subscription_plan:
          upgradeText === 'subscription' ? 'monthly' : 'vod',
      };
      modifySubscription(payload)
        .then((res) => {
          if (res?.success) {
            NotificationManager.success(
              res?.data?.status_msg
                ? res?.data?.status_msg
                : 'Plan has been successfully Switched.',
              '',
              4000
            );
            setTimeout(() => {
              onConfirm();
            }, 4000);
          }
        })
        .catch((e) => {
          NotificationManager.error(
            e?.response?.data?.message ||
              'Something went wrong. Please try again.',
            '',
            7000
          );
        });
    }
  };

  const CardSelection = () => {
    return (
      <>
        {upgradeText === 'rent' && (
          <div className="d-flex justify-content-center mt-4">
            Rent for $4.99 CAD.
          </div>
        )}
        <div className="d-flex flex-column mt-5 p-1">
          <div
            className={
              selected === 'old'
                ? 'form-check mt-3 radio-btn-div form-check selected'
                : 'form-check mt-3 radio-btn-div form-check'
            }>
            <input
              type="radio"
              className="form-check-input"
              id="selectCard"
              name="selectCard"
              value="old"
              checked={selected === 'old' ? true : false}
              onChange={() => console.log('old')}
              onClick={(e) => setSelected('old')}
            />
            <label className="form-check-label ml-4" htmlFor="selectCard">
              Use saved payment method
            </label>
          </div>
          <div
            className={
              selected === 'new'
                ? 'form-check mt-3 radio-btn-div form-check selected'
                : 'form-check mt-3 radio-btn-div form-check'
            }>
            <input
              type="radio"
              className="form-check-input"
              id="selectCardNew"
              name="selectCard"
              value="new"
              checked={selected === 'new' ? true : false}
              onChange={() => console.log('new')}
              onClick={() => setSelected('new')}
            />
            <label className="form-check-label ml-4" htmlFor="selectCardNew">
              Enter new card
            </label>
          </div>
        </div>
      </>
    );
  };

  const CardInformation = ({ register, errors, activeStep }) => {
    return (
      <>
        <div className="form-group">
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            // {...register('firstname')}
          />
          {errors?.firstname && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="lastname"
            name="lastname"
            placeholder="Last Name"
            // {...register('lastname')}
          />
          {errors?.lastname && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
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
          {`You've successfully rented "${title}". You have 30 days to begin
          watching it. You have 48 hours to complete it once you begin watching`}
          it.
        </h5>
      </div>
    );
  };

  const PersonalInformation = ({ register, errors, activeStep }) => {
    return (
      <>
        <div className="col col-12">
          <div className="form-group">
            <select
              type=""
              className="form-control auth-form-input mb-0"
              id="country"
              name="country"
              placeholder="Country">
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
              // {...register('city')}
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
              // {...register('state')}
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
                // {...register('postalCode')}
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
                // {...register('phone')}
              />
              {errors?.postalCode && (
                <div className="form-group error-label text-danger">
                  This field is required.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CardSelection />;
      case 1:
        return (
          <CardInformation
            register={register}
            errors={errors}
            activeStep={activeStep}
          />
        );
      case 2:
        return (
          <PersonalInformation
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

  return (
    <div
      className="profile-form-modal no-subscription"
      style={{
        marginTop: '5rem',
      }}>
      <div className="text-center">
        <h3 className="font-weight-bold">{titles[activeStep]}</h3>
      </div>
      <div className="modal-body">
        <>
          {activeStep !== 0 && (
            <div className="mb-5">
              <ProgressBar
                percent={
                  activeStep === 3
                    ? activeStep * 34
                    : activeStep > 1
                    ? activeStep * 25
                    : 0
                }
                height={3}
                filledBackground="#6dd400">
                <Step>{StepLabel}</Step>
                <Step>{StepLabel}</Step>
                <Step>{StepLabel}</Step>
              </ProgressBar>
            </div>
          )}
          <div className="sign-in-from w-100 m-auto mt-2 px-md-5">
            <form name="card-form" id="card-form" onSubmit={onSubmit}>
              <div className="signup-form-inputs-wrapper d-flex align-items-center flex-column mt-5">
                <div className="w-100"> {renderStepContent()}</div>
              </div>
              {activeStep !== 3 && (
                <div className="sign-info row px-md-2">
                  <div className="col col-12 col-md-6 order-2 order-md-1">
                    <Button
                      id="cencel-btn"
                      fullWidth
                      variant="outlined"
                      disabled={isLoading}
                      onClick={() => onClose()}>
                      {activeStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                  </div>
                  <div className="col col-12 col-md-6 order-1">
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={isLoading}
                        fullWidth
                        className="px-5"
                        type="submit">
                        {isLoading ? (
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
                <div className="sign-info row px-md-2">
                  <div className="col col-12 col-md-6 order-2 order-md-1">
                    <Button
                      id="cencel-btn"
                      fullWidth
                      variant="outlined"
                      disabled={isLoading}
                      onClick={() => onConfirm()}>
                      Play Later
                    </Button>
                  </div>
                  <div className="col col-12 col-md-6 order-1">
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={isLoading}
                        fullWidth
                        className="px-5"
                        onClick={() => onConfirm()}>
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </>
      </div>
    </div>
  );
};

const CardPayment = (props) => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <InjectedForm {...props} />
      </Elements>
    </div>
  );
};

export default CardPayment;
