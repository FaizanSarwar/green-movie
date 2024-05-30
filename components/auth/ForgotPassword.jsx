import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NotificationManager } from 'react-notifications';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import { forgotPassword } from '../../services/apiService';

const ForgotPasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  }, []);

  const onSubmit = (data) => {
    setFormSubmitted(true);
    forgotPassword({ email: data.email })
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
    <div className="row justify-content-center align-items-center height-self-center m-auto p-3">
      <div className="col-12 sign-user_card">
        <div className="sign-in-page-data">
          <div className="sign-in-from w-100 m-auto">
            {isSuccess ? (
              <h3
                className="mb-4 text-center text-bold text-uppercase"
                style={{ fontWeight: 'bolder' }}>
                Password Reset <br />
                Confirmation
              </h3>
            ) : (
              <h3
                className="mb-4 text-center text-bold text-uppercase"
                style={{ fontWeight: 'bolder' }}>
                Forgot Password?
              </h3>
            )}

            {!isSuccess ? (
              <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="signin-form-inputs-wrapper">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control auth-form-input mb-0"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      {...register('email', {
                        required: true
                      })}
                    />
                    {errors?.email && (
                      <div className="form-group error-label text-danger">
                        Please enter proper value.
                      </div>
                    )}
                  </div>
                  <div className="d-flex">Now click “Reset Password”</div>
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
                    <Button type="submit" fullWidth disabled={formSubmitted}>
                      Reset Password
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ height: 150, marginTop: 50, fontSize: 18 }}>
                  The password reset link has been sent to your inbox.
                  <br />
                  Please check your email and follow the prompts to reset
                  <br />
                  your password.
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
  );
};

export default ForgotPasswordForm;
