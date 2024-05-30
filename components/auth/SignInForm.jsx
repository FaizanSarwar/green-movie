import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { signInUser } from '../../services/apiService';
import { NotificationManager } from 'react-notifications';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import ProfileSelection from '../profiles/ProfileSelection';

const SignInForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [chooseProfile, setChooseProfile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  }, []);

  

  const onSubmit = (data) => {
    setFormSubmitted(true);
    signInUser({ username: data.email, password: data.password })
      .then((res) => {
        if (res.success) {
          // handle success
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('mainProfileEmail', data.email);
          }
          setChooseProfile(true);
          // router.replace(PageRoutes.HOME);
          NotificationManager.success('Signed in Successfully.', '', 3000);
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
            <h3
              className="mb-4 text-center text-bold text-uppercase"
              style={{ fontWeight: 'bolder' }}>
              {chooseProfile ? 'Who is watching?' : 'Log in to your account'}
            </h3>
            {chooseProfile ? (
              <ProfileSelection />
            ) : (
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
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control auth-form-input mb-0"
                      id="password"
                      name="password"
                      placeholder="Password"
                      {...register('password', { required: 'required' })}
                    />
                    {errors?.password && (
                      <div className="form-group error-label text-danger">
                        This field is required.
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-center">
                    <Link passHref href={PageRoutes.FORGOTPASSWORD}>
                      <a className="green-color forgot-link">
                        Forgot password?
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="sign-info row px-md-2">
                  <div className="col col-12 col-md-6 order-2 order-md-1">
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        router.replace(PageRoutes.HOME);
                      }}>
                      Cancel
                    </Button>
                  </div>
                  <div className="col col-12 col-md-6 order-1">
                    <Button type="submit" fullWidth disabled={formSubmitted}>
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
