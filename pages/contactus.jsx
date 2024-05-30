import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/common/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PageRoutes from '../config/PageRoutes';
import Seo from '../components/common/Seo';
import { contactus } from '../services/apiService';
import { NotificationManager } from 'react-notifications';

const ContactUsPage = () => {
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const pageSeo = {
    title: 'Contact the Team Behind The Green Channel TV',
    description:
      "Whether you're looking to stream today's top environmental films, or ready to distribute one of your own pieces, we're here for you at The Green Channel TV.",
    keyword: 'the green channel tv'
  };

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    if (data) {
      const payload = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      };
      setFormSubmitted(true);
      contactus(payload)
        .then((res) => {
          if (!res.success) {
            NotificationManager.error(
              res.status_msg || 'Something went wrong. Please try again.',
              '',
              4000
            );
          } else {
            NotificationManager.success('Mail sent successfully.', '', 2000);
          }
          reset();
          setFormSubmitted(false);
        })
        .catch((e) => {
          setFormSubmitted(false);
          NotificationManager.error(
            res.status_msg || 'Something went wrong. Please try again.',
            '',
            4000
          );
        });
    } else {
      NotificationManager.error(
        'Something went wrong. Please try again.',
        '',
        4000
      );
    }
  };

  return (
    <>
      <Seo seo={pageSeo} />
      <div className="black-overlay">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-md-8 col-sm-9 col-12 mt-5">
              <h3 className="ft-weight-600 contact-us-title">
                Got something on your mind&#63;
              </h3>
              <p className="mt-5">
                Don&apos;t be shy! If you need additional information or you
                want to connect with us to talk about anything green, use the
                contact form below.
              </p>
              <div className="w-100 m-auto">
                <h3
                  className="mb-4 text-center text-bold text-uppercase"
                  style={{ fontWeight: 'bolder' }}></h3>

                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="contact-us-form-inputs-wrapper">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control auth-form-input mb-0"
                        id="name"
                        name="name"
                        placeholder="Enter your name (Required)"
                        autoComplete="off"
                        {...register('name', {
                          required: true
                        })}
                      />
                      {errors?.name && (
                        <div className="form-group error-label text-danger visible">
                          Please enter proper value.
                        </div>
                      )}
                      {!errors?.name && (
                        <div className="form-group error-label text-danger invisible">
                          Please enter proper value.
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control auth-form-input mb-0"
                        id="email"
                        name="email"
                        placeholder="Enter your email (Required)"
                        autoComplete="off"
                        {...register('email', {
                          required: true
                        })}
                      />
                      {errors?.email && (
                        <div className="form-group error-label text-danger visible">
                          Please enter proper value.
                        </div>
                      )}
                      {!errors?.email && (
                        <div className="form-group error-label text-danger invisible">
                          Please enter proper value.
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control auth-form-input mb-0"
                        id="subject"
                        name="subject"
                        placeholder="Subject"
                        autoComplete="off"
                        {...register('subject', {
                          required: false
                        })}
                      />
                      {errors?.subject && (
                        <div className="form-group error-label text-danger invisible">
                          Please enter proper value.
                        </div>
                      )}
                      {!errors?.subject && (
                        <div className="form-group error-label text-danger invisible">
                          Please enter proper value.
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <textarea
                        className="form-control auth-form-textarea mb-0"
                        id="message"
                        name="message"
                        placeholder="Type your message here"
                        autoComplete="off"
                        {...register('message', {
                          required: false
                        })}
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="contact-us-submit row">
                    <div className="col col-12 col-md-6 col-sm-8">
                      <Button type="submit" fullWidth disabled={formSubmitted}>
                        Send Message
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div>
                  For specific information on media inquiries, technical
                  support, or film submissions, you can also contact the
                  following people.
                </div>
                <div>
                  <div>
                    <div className="contact-us-headings">Media</div>
                    <div>press&#64;thegreenchannel.tv</div>
                  </div>
                  <div>
                    <div className="contact-us-headings">Technical support</div>
                    <div>
                      <a href="mailto:webmaster@thegreenchannel.tv">
                        webmaster&#64;thegreenchannel.tv
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="contact-us-headings">Films submissions</div>
                    <div>
                      acquisitions&#64;thegreenchannel.tv &#40;and check out our
                      film submission instructions&#41;
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  You can find more answers to the most common questions in our{' '}
                  <Link passHref href={PageRoutes.FAQ}>
                    <a href="#" className="contact-us-faq">
                      FAQ
                    </a>
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
