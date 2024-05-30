import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NotificationManager } from 'react-notifications';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import { resetPassword } from '../../services/apiService';
import { passwordStrength } from 'check-password-strength';

const ResetPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({ mode: 'all' });

  const pswd = watch('nPassword');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const opnts = [
    {
      id: 0,
      value: 'Too weak',
      minDiversity: 0,
      minLength: 10
    },
    {
      id: 1,
      value: 'Weak',
      minDiversity: 1,
      minLength: 10
    },
    {
      id: 2,
      value: 'Medium',
      minDiversity: 2,
      minLength: 10
    },
    {
      id: 3,
      value: 'Strong',
      minDiversity: 3,
      minLength: 10
    }
  ];
  const pswdStrength = passwordStrength(pswd, opnts);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    setCode(auth);
  }, []);

  useEffect(() => {
    if (code !== '') {
      resetPassword({ code: code })
        .then((res) => {
          if (res.success) {
            setIsLoading(false);
            if (res.data && res.data.data && res.data.data.email) {
              setEmail(res.data.data.email);
            }
          } else {
            router.push(PageRoutes.SIGNIN);
          }
        })
        .catch((e) => {
          router.push(PageRoutes.SIGNIN);
        });
    }
  }, [code]);

  useEffect(() => {
    const cPass = watch('cPassword');
    const nPass = watch('nPassword');
    if (cPass !== nPass) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [watch('cPassword')]);

  const onSubmit = (data) => {
    setFormSubmitted(true);
    resetPassword({
      code: code,
      password: data.nPassword,
      email: email
    })
      .then((res) => {
        if (res.success) {
          // handle success
          setIsSuccess(true);
          setFormSubmitted(false);
        } else {
          NotificationManager.error(
            res.message || 'Something went wrong. Please try again.',
            '',
            7000
          );
          setTimeout(() => {
            setFormSubmitted(false);
            // reset();
          }, 8000);
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
          setFormSubmitted(false);
          // reset();
        }, 8000);
      });
  };

  return (
    <>
      {!isLoading && (
        <div className="row justify-content-center align-items-center height-self-center m-auto p-3">
          <div className="col-12 sign-user_card">
            <div className="sign-in-page-data">
              <div className="sign-in-from w-100 m-auto">
                <h3
                  className="mb-4 text-center text-bold text-uppercase"
                  style={{ fontWeight: 'bolder' }}>
                  {isSuccess ? 'Success!' : 'Enter new Password'}
                </h3>
                {!isSuccess ? (
                  <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="signin-form-inputs-wrapper">
                      <div className="text-center mb-3">
                        <span>
                          10 characters minimum with mixed case letters and
                          numbers.
                        </span>
                      </div>
                      <div className="form-group">
                        <div className="input-icon-container">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control auth-form-input mb-0 d-inline-block pr-1"
                            id="nPassword"
                            name="nPassword"
                            placeholder="Choose a password"
                            disabled={isLoading ? true : false}
                            {...register('nPassword', {
                              required: true,
                              minLength: 10
                            })}
                          />
                          <i
                            className={
                              !showPassword ? 'ri-eye-fill' : 'ri-eye-off-fill'
                            }
                            onClick={togglePassword}></i>
                        </div>
                        {errors?.nPassword &&
                          errors.nPassword.type === 'required' && (
                            <div className="form-group error-label text-danger">
                              This field is required.
                            </div>
                          )}
                        {errors?.nPassword &&
                          errors.nPassword.type === 'minLength' && (
                            <div className="form-group error-label text-danger">
                              Please enter minimum 10 characters password.
                            </div>
                          )}
                      </div>
                      <div className="text-center mb-3">
                        <span>Password Strength Indicator</span>
                        <div className="progress mt-3">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${(pswdStrength.id * 25).toString()}%`
                            }}
                            aria-valuemin="0"
                            aria-valuemax="100"></div>
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control auth-form-input mb-0"
                          id="cPassword"
                          name="cPassword"
                          placeholder="Confirm password"
                          {...register('cPassword', { required: 'required' })}
                        />
                        {errors?.cPassword && (
                          <div className="form-group error-label text-danger">
                            This field is required.
                          </div>
                        )}
                        {isError && (
                          <div className="form-group error-label text-danger">
                            Password does not match. Please re-enter your
                            desired password.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sign-info row px-md-2">
                      <div className="col col-12 col-md-6 order-2 order-md-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => {
                            router.replace(PageRoutes.SIGNIN);
                          }}>
                          Cancel
                        </Button>
                      </div>
                      <div className="col col-12 col-md-6 order-1">
                        <Button
                          type="submit"
                          fullWidth
                          disabled={formSubmitted}>
                          Confirm password change
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div
                      className="d-flex justify-content-center"
                      style={{ height: 150, marginTop: 80, fontSize: 18 }}>
                      Your password has been successfully changed
                    </div>
                    <div className="sign-info row px-md-2 justify-content-center">
                      <div className="col col-12 col-md-6 order-1">
                        <Button
                          type="submit"
                          fullWidth
                          onClick={() => {
                            router.replace(PageRoutes.SIGNIN);
                          }}>
                          Login
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
