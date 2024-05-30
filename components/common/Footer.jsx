import Link from 'next/link';
import React from 'react';
import PageRoutes from '../../config/PageRoutes';

const Footer = () => {
  return (
    <footer className="mb-0 index-footer">
      <div className="container-fluid">
        <div className="block-space">
          <div className="row justify-content-center">
            <div className="col-lg-2 col-md-4 ml-7">
              <ul className="f-link list-unstyled mb-5">
                <li>
                  <Link passHref href={PageRoutes.FAQ}>
                    <a href="#">Frequently Asked Questions</a>
                  </Link>
                </li>
                <li>
                  <Link passHref href={PageRoutes.ABOUT}>
                    <a href="#">About The Green Channel</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4">
              <ul className="f-link list-unstyled mb-5">
                <li>
                  <Link passHref href={PageRoutes.SUBMITYOURFILM}>
                    <a href="#">Submit Your Film</a>
                  </Link>
                </li>
                <li>
                  <Link passHref href={PageRoutes.TERMS}>
                    <a href="#">Terms of Service</a>
                  </Link>
                </li>
                <li>
                  <Link passHref href={PageRoutes.PRIVACY}>
                    <a href="#">Privacy Rights</a>
                  </Link>
                </li>
                <li>
                  <Link passHref href={PageRoutes.ANTISPAM}>
                    <a href="#">Anti-Spam</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4">
              <ul className="f-link list-unstyled mb-5">
                <li>
                  <Link passHref href={PageRoutes.CAREERS}>
                    <a href="#">Careers</a>
                  </Link>
                </li>
                <li>
                  <Link passHref href={PageRoutes.CONTACTUS}>
                    <a href="#">Contact Us</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-12 r-mt-15">
              <div className="d-flex">
                <a
                  href="https://www.facebook.com/GreenChanneltv/"
                  target="_blank"
                  className="s-icon"
                  rel="noreferrer">
                  <i className="ri-facebook-box-fill"></i>
                </a>
                <a
                  href="https://twitter.com/TGCEcologicaltv"
                  target="_blank"
                  className="s-icon"
                  rel="noreferrer">
                  <i className="ri-twitter-fill"></i>
                </a>
                <a
                  href="https://www.instagram.com/thegreenchanneltv/"
                  target="_blank"
                  className="s-icon"
                  rel="noreferrer">
                  <i className="ri-instagram-line"></i>
                </a>
                <a
                  href="https://www.youtube.com/@thegreenchannel2676/featured"
                  target="_blank"
                  className="s-icon"
                  rel="noreferrer">
                  <i className="ri-youtube-fill"></i>
                </a>
              </div>
            </div>
          </div>
          <div className=" mt-3 row justify-content-center">
            <div className="col-lg-3 col-md-4">
              <div className="d-flex flex-column">
                <span className="mt-5 footer-content-text">
                  &copy;TheGreenChannel Inc. All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
