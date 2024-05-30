import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import PageRoutes from '../../config/PageRoutes';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { stayInTouch } from '../../services/apiService';
import Image from 'next/image';
import tgcLogo from '/public/images/tgc-logo.png';
import sampleMobileBg1 from '/public/images/sample-content-img1.png';
import sampleMobileBg2 from '/public/images/sample-content-img2.png';
import appleTVImg from '/public/images/apple-tv-logo.png';
import videoOnDemand from '/public/images/videoOnDemand.png';
import fireTVImg from '/public/images/amazon-fire-tv-logo.png';
import rokuTVImg from '/public/images/roku-tv-logo.png';
import androidTVImg from '/public/images/android-tv-logo.png';
import Seo from '../common/Seo';

const GuestHomePage = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([null]);
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [btnMessage, setBtnMessage] = useState('');

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

  const pageSeo = {
    title: 'The Green Channel | Honest & Impactful Documentary Channel',
    description:
      'TGC is your go-to documentary channel for authentic films and series on compelling topics from animal rights to environmental activism. Start watching now!',
    keyword: 'documentary channel',
  };

  const onScroll = () => {
    const { pageYOffset } = window;
    if (pageYOffset > 264) {
      window.jQuery('#header-logo').removeClass('hide-header-logo');
      window.jQuery('#header-logo').addClass('show-header-logo');
    } else {
      window.jQuery('#header-logo').removeClass('show-header-logo');
      window.jQuery('#header-logo').addClass('hide-header-logo');
    }
  };

  useEffect(() => {
    //fetch subscription plan price
    fetchData();
    //add eventlistener to window
    window.addEventListener('scroll', onScroll, { passive: true });
    window.jQuery('#header-logo').addClass('hide-header-logo');
    window.jQuery('#right-menu').addClass('hide-header-logo');
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true });
      window
        .jQuery('.menu-main-menu-container')
        .removeClass('hide-header-logo');
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function handleClose() {
    setIsOpen(false);
  }
  const handleGetStarted = (data) => {
    stayInTouch({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    })
      .then((res) => {
        if (res.data.status === 'Success') {
          setSuccess(true);
          setMessage('Thanks for subscribing!');
          setBtnMessage('Okay');
          setIsOpen(true);
        }
        reset();
      })
      .catch((e) => {
        setSuccess(true);
        setMessage(
          ' We are sorry, something went wrong. Please check your information and try again.'
        );
        setIsOpen(true);
        setBtnMessage('Okay');
      });
  };
  return (
    <>
      <Seo seo={pageSeo} />
      <div className="index-page-container">
        <div className="index-main-container">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4 col-sm-12 col-xs-12">
                <>
                  <div className="tgc-logo-index">
                    <Image
                      src={tgcLogo}
                      alt="TGC Logo"
                      width={150}
                      height={125}
                    />
                  </div>
                  <h1 className="font-weight-bold guest-landing-large-text mt-3">
                    The Largest Green Streaming Site
                  </h1>
                  <p className="mt-4">
                    Not only will you see great content, your subscription helps
                    the environment by supporting stories that shine a light on
                    pressing issues&#33; Join today for{' '}
                    {plans && plans.currency_symbol}
                    {plans && plans.value} {plans && plans.currency_name} per
                    month.
                  </p>
                  <Link
                    className="d-flex justify-content-start"
                    passHref
                    href={PageRoutes.BROWSE}>
                    <Button className="mt-2" style={{ padding: '10px 94px' }}>
                      Browse Library
                    </Button>
                  </Link>
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="sample-content-container">
          <div className="container">
            <div className="row custom-row">
              <div className="col-md-7">
                <div className="sample-content-img1">
                  <Image src={videoOnDemand} alt="" width={400} height={400} />
                </div>
              </div>
              <div className="col-md-5">
                <div className=" mr-3 d-flex flex-column align-items-md-end align-items-sm-center">
                  <h1 className="font-weight-bold guest-landing-large-text text-md-right text-sm-center w-100">
                    Video On Demand
                  </h1>
                  <p className="mt-4 text-md-right text-sm-center w-70 reduced-width">
                    Sign up and try some of our films without a subscription
                  </p>
                  {/* TODO Update Routing Link for VIEW VIDEO ON DEMAND */}
                  <Link passHref href={PageRoutes.SAMPLECONTENT}>
                    <Button className="mt-2" style={{ padding: '10px 25px' }}>
                      View Video On Demand
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="devices-container">
          <div className="container">
            <div className="row">
              <div className="col col-md-6 col-sm-12 col-xs-12 mt-5">
                <h1 className="font-weight-bold guest-landing-large-text col-md-6 col-sm-12 col-xs-12">
                  WATCH EVERYWHERE &amp; ENJOY ON YOUR TV
                </h1>
                <p className="mt-4 col-md-10">
                  Watch on Android TVs, Amazon FireTV, Apple TV, Roku Devices,
                  iPhones, iPads, and on your computer.
                </p>
                <Link
                  passHref
                  href={`${PageRoutes.SELECTPLAN}?from=subscription`}>
                  <Button
                    className="mt-2 ml-3"
                    style={{ padding: '10px 90px' }}>
                    Join The Green Channel
                  </Button>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12 col-xs-12">
                <div className="devices-container-image"></div>
              </div>
            </div>
            <div className="row justify-content-center align-items-center text-center mt-5 tvs-row">
              <div className="row col-md-10 ml-auto mr-auto">
                <div className="col">
                  <Image
                    src={appleTVImg}
                    alt="Apple TV"
                    className="apple-tv"
                    width={90}
                    height={45}
                  />
                </div>
                <div className="col">
                  <Image
                    src={fireTVImg}
                    alt="Amazon Fire TV"
                    className="amazon-fire-tv"
                    width={75}
                    height={45}
                  />
                </div>
                <div className="col">
                  <Image
                    src={rokuTVImg}
                    alt="Roku TV"
                    className="roku-tv"
                    width={200}
                    height={45}
                  />
                </div>
                <div className="col">
                  <Image
                    src={androidTVImg}
                    alt="Android TV"
                    width={200}
                    height={45}
                    className="android-tv"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="why-tgc-container p-100">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-md-4 d-flex justify-content-center">
                <h1 className="font-weight-bold guest-landing-large-text col-md-8 col-sm-12 col-xs-12 d-flex justify-content-center">
                  Why TGC
                </h1>
              </div>
              <div className="container">
                <div className="mt-4 d-flex mlr-auto text-center mx-auto w-650">
                  The Green Channel was founded by filmmaker, Scott Renyard, who
                  noticed that environmental filmmakers are terribly underfunded
                  worldwide. His goal was to create a streaming service that
                  would feature environmental content to help these filmmakers
                  with their crucial and important work. If you like what we do,
                  but don&#39;t want to subscribe just yet.
                </div>
                <div className="mt-0 d-flex mlr-auto text-center mx-auto w-650 justify-content-center">
                  You can always help us tell more stories with a donation.
                </div>
                {/* TODO Update Link for DONATE */}
                <div className="d-flex justify-content-center mt-3">
                  {/* <Link passHref href={PageRoutes.DONATE}> */}
                  <Button
                    className="mt-2 width-225"
                    style={{ padding: '10px 94px' }}>
                    Coming Soon
                  </Button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sign-up-form">
          <div className="container">
            <div className="mt-100">
              <div className="row mt-3 height-20 d-flex justify-content-center">
                <div className="col-lg-6 col-md-10 col-sm-12 d-flex justify-content-center">
                  Sign up for updates on upcoming and new releases.
                </div>
              </div>

              <div className="row form-justify-content-center height-250 mt-4 d-flex justify-content-center">
                <div className="col-12 col-md-5 col-sm-10 col-xs-12">
                  <form
                    className="row g-3"
                    onSubmit={handleSubmit(handleGetStarted)}>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control  stay-intouch-form-input  d-inline"
                        autoComplete="off"
                        placeholder="First Name"
                        {...register('firstName', {
                          required: true,
                        })}
                      />
                      {errors?.firstName && (
                        <div className="form-group error-label text-danger">
                          This field is required.
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 stay-intouch-mt">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        autoComplete="off"
                        className="form-control stay-intouch-form-input d-inline"
                        placeholder="Last Name"
                        {...register('lastName', { required: true })}
                      />
                      {errors?.lastName && (
                        <div className="form-group error-label text-danger">
                          This field is required.
                        </div>
                      )}
                    </div>
                    <div className="col-md-12 mt-3">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control stay-intouch-form-input d-inline"
                        placeholder="Email"
                        autoComplete="off"
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
                    <div className="col-md-12 mt-3">
                      <input
                        type="submit"
                        className="form-control btn d-inline contained-button "
                        value="Okay"
                      />
                    </div>
                  </form>
                  <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    success={success}
                    message={message}
                    btnMessage={btnMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestHomePage;
