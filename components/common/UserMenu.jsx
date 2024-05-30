/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Button from '../common/Button';
import PageRoutes from '../../config/PageRoutes';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { DataContext } from '../../contexts/DataContext';
import { generateSubGenrelUrl } from '../../utils/urlGenerator';
import { validateUser } from '../../services/apiService';

const toggleMenu = () => {
  if (typeof window !== 'undefined') {
    const menu = window.document.getElementById('navbarSupportedContent');
    const isMenuOpen = menu.classList.contains('show');
    if (isMenuOpen) {
      const body = window.document.getElementsByTagName('body')[0];
      body.classList.remove('nav-open');
      menu.classList.remove('show');
    }
  }
};

const SubGenres = ({ page, defaultPage }) => {
  const { subGenres, selectedGenre } = useContext(DataContext);
  const router = useRouter();

  const onChangeGenre = (g) => {
    if (selectedGenre !== g) {
      if (g === 'All') {
        router.push(defaultPage);
      } else {
        router.push(generateSubGenrelUrl(page, g));
      }
    }
    toggleMenu();
  };

  return (
    <ul className="d-flex d-sm-flex d-xs-flex d-lg-none flex-column align-items-start">
      {subGenres.length > 0 &&
        subGenres.map((sg) => (
          <li
            className={`features-tabs-item ${
              selectedGenre === sg
                ? `features-tabs-item-selected menu-item font-weight-bold py-1`
                : `menu-item font-weight-bold py-1`
            }`}
            onClick={() => onChangeGenre(sg)}
            key={sg}>
            {sg}
          </li>
        ))}
    </ul>
  );
};

const UserMenu = ({ userDetails }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showSearchField, setShowSearchField] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { asPath } = useRouter();

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    Router.push(`${PageRoutes.SEARCH}?query=${encodeURIComponent(query)}`);
  };

  const toggleInput = () => {
    setShowSearchField(!showSearchField);
    if (!showSearchField) {
      setQuery('');
    }
  };

  const handleRoute = (routeTo) => router.push(routeTo);

  const checkUserLoggedIn = async () => {
    const res = await validateUser();
    if (res && res.success) {
      setIsUserLoggedIn(true);
    }
  };

  // useEffect(() => {
  //   checkUserLoggedIn();
  // }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light p-0 align-items-center">
        <Link href={isUserLoggedIn ? PageRoutes.BROWSE : PageRoutes.HOME}>
          <a className="navbar-brand" id="logo-link">
            <img
              height="50"
              className="icon-logo img"
              src="/images/tgc-logo.png"
              alt="The Green Channel"
            />
          </a>
        </Link>
        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <div className="menu-main-menu-container w-auto">
            <ul id="top-menu" className="navbar-nav">
              <form className="searchbox" onSubmit={handleSearch}>
                <div className="form-group position-relative d-block d-lg-none">
                  <input
                    type="text"
                    className="text search-input font-size-12 "
                    defaultValue={query}
                    onChange={handleQueryChange}
                  />
                  <button className="ml-1 search-button btn d-inline-block p-0 p-1">
                    Search
                  </button>
                </div>
              </form>
              {isUserLoggedIn && (
                <li className="menu-item d-block d-lg-none">
                  <Link passHref href={PageRoutes.PROFILES}>
                    <div
                      onClick={toggleMenu}
                      className="d-flex mx-3  align-items-center justify-content-betwee mb-1 menu-item">
                      <div className="mx-2">
                        <img
                          width="28px"
                          className="mx-auto d-block"
                          src={
                            userDetails?.photo &&
                            userDetails?.photo !==
                              'data:image/unknown;base64,' &&
                            userDetails?.photo !==
                              'data:application/x-empty;base64,' &&
                            userDetails?.photo !== 'data:;base64,'
                              ? userDetails?.photo
                              : '/images/user.png'
                          }
                          alt="user"
                        />
                      </div>
                      <div>
                        <h6
                          className="mb-0 font-weight-bold"
                          style={{
                            lineBreak: 'anywhere',
                          }}>
                          {userDetails?.username ||
                            userDetails?.email.split('@')[0]}
                        </h6>
                      </div>
                    </div>
                  </Link>
                </li>
              )}
              {router.pathname !== PageRoutes.BROWSE && isUserLoggedIn && (
                <li className="menu-item" data-page={PageRoutes.BROWSE}>
                  <Link passHref href={PageRoutes.BROWSE}>
                    <a
                      onClick={toggleMenu}
                      className={
                        asPath === PageRoutes.BROWSE ? 'active-page-link' : ''
                      }>
                      <i className="ri-home-2-line menu-icons"></i>
                      Home
                    </a>
                  </Link>
                </li>
              )}

              {/* <li className="menu-item" data-page={PageRoutes.FEATURES}>
                <Link passHref href={PageRoutes.FEATURES}>
                  <a
                    onClick={toggleMenu}
                    className={
                      asPath.startsWith(PageRoutes.FEATURES)
                        ? 'active-page-link'
                        : ''
                    }>
                    <i className="ri-film-line menu-icons"></i>
                    Features
                  </a>
                </Link>

                {asPath.startsWith(PageRoutes.FEATURES) && (
                  <SubGenres
                    page={PageRoutes.FEATURES_PAGE}
                    defaultPage={PageRoutes.FEATURES}
                  />
                )}
              </li>
              <li className="menu-item" data-page={PageRoutes.SERIES}>
                <Link passHref href={PageRoutes.SERIES}>
                  <a
                    onClick={toggleMenu}
                    className={
                      asPath.startsWith(PageRoutes.SERIES)
                        ? 'active-page-link'
                        : ''
                    }>
                    <i className="ri-tv-line menu-icons"></i>
                    Series
                  </a>
                </Link>
                {asPath.startsWith(PageRoutes.SERIES) && (
                  <SubGenres
                    page={PageRoutes.SERIES_GENRE_PAGE}
                    defaultPage={PageRoutes.SERIES}
                  />
                )}
              </li>
              <li className="menu-item" data-page={PageRoutes.SHORTS}>
                <Link passHref href={PageRoutes.SHORTS}>
                  <a
                    onClick={toggleMenu}
                    className={
                      asPath.startsWith(PageRoutes.SHORTS)
                        ? 'active-page-link'
                        : ''
                    }>
                    <i className="ri-timer-line menu-icons"></i>
                    Shorts
                  </a>
                </Link>
                {asPath.startsWith(PageRoutes.SHORTS) && (
                  <SubGenres
                    defaultPage={PageRoutes.SHORTS}
                    page={PageRoutes.SHORTS_GENRE_PAGE}
                  />
                )}
              </li> */}
              {/* <li className="menu-item" data-page={PageRoutes.SHORTS}>
                <Link passHref href="#">
                  <a
                    onClick={toggleMenu}
                    className={
                      asPath.startsWith(PageRoutes.SHORTS)
                        ? 'active-page-link'
                        : ''
                    }>
                    <i className="ri-shopping-cart-2-line menu-icons"></i>
                    On Demand
                  </a>
                </Link>
                {asPath.startsWith(PageRoutes.SHORTS) && (
                  <SubGenres
                    defaultPage={PageRoutes.SHORTS}
                    page={PageRoutes.SHORTS_GENRE_PAGE}
                  />
                )}
              </li> 
              <li className="menu-item" data-page={PageRoutes.SAMPLECONTENT}>
                <Link passHref href={PageRoutes.SAMPLECONTENT}>
                  <a
                    onClick={toggleMenu}
                    className={
                      asPath.startsWith(PageRoutes.SAMPLECONTENT)
                        ? 'active-page-link'
                        : ''
                    }>
                    <i className="ri-money-dollar-circle-line menu-icons"></i>
                    Sample
                  </a>
                </Link>
                {asPath.startsWith(PageRoutes.SAMPLECONTENT) && (
                  <SubGenres
                    defaultPage={PageRoutes.SAMPLECONTENT}
                    page={PageRoutes.SAMPLECONTENT}
                  />
                )}
              </li>*/}
              {isUserLoggedIn && (
                <>
                  <li
                    className="menu-item d-block d-lg-none"
                    data-page={PageRoutes.ACCOUNT}>
                    <Link passHref href={PageRoutes.ACCOUNT}>
                      <a
                        onClick={toggleMenu}
                        className={
                          asPath.startsWith(PageRoutes.ACCOUNT)
                            ? 'active-page-link'
                            : ''
                        }>
                        <i className="ri-account-circle-line menu-icons"></i>
                        Account
                      </a>
                    </Link>
                  </li>
                  <li
                    className="menu-item d-block d-lg-none"
                    data-page={PageRoutes.SIGNOUT}>
                    <Link passHref href={PageRoutes.SIGNOUT}>
                      <a
                        onClick={toggleMenu}
                        className={
                          asPath.startsWith(PageRoutes.SIGNOUT)
                            ? 'active-page-link'
                            : ''
                        }>
                        <i className="ri-shut-down-line menu-icons"></i>Sign Out
                      </a>
                    </Link>
                  </li>
                </>
              )}
              {!isUserLoggedIn && (
                <>
                  <li
                    className="menu-item d-block d-lg-none"
                    data-page={PageRoutes.SIGNUP}>
                    <Link passHref href={PageRoutes.SIGNUP}>
                      <a
                        onClick={toggleMenu}
                        className={
                          asPath.startsWith(PageRoutes.SIGNUP)
                            ? 'active-page-link'
                            : ''
                        }>
                        <i className="ri-shut-down-line menu-icons"></i>Join The
                        Green Channel
                      </a>
                    </Link>
                  </li>
                  <li
                    className="menu-item d-block d-lg-none"
                    data-page={PageRoutes.SIGNIN}>
                    <Link passHref href={PageRoutes.SIGNIN}>
                      <a
                        onClick={toggleMenu}
                        className={
                          asPath.startsWith(PageRoutes.SIGNIN)
                            ? 'active-page-link'
                            : ''
                        }>
                        <i className="ri-shut-down-line menu-icons"></i>Sign In
                      </a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="mobile-more-menu">
          <a
            className="navbar-toggler c-toggler d-block d-lg-none"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <div className="navbar-toggler-icon" data-toggle="collapse">
              <span className="navbar-menu-icon navbar-menu-icon--top" />
              <span className="navbar-menu-icon navbar-menu-icon--middle" />
              <span className="navbar-menu-icon navbar-menu-icon--bottom" />
            </div>
          </a>
          <div className="more-menu" aria-labelledby="dropdownMenuButton">
            <div className="navbar-right position-relative">
              <ul className="d-flex align-items-center justify-content-end list-inline m-0">
                <li>
                  <div className="search-toggle">
                    <i className="ri-search-line" />
                  </div>
                  <div className="search-box iq-search-bar">
                    <form className="searchbox" onSubmit={handleSearch}>
                      <div className="form-group position-relative">
                        <input
                          type="text"
                          autoFocus
                          className="text search-input font-size-12"
                          placeholder="Search..."
                          defaultValue={query}
                          onChange={handleQueryChange}
                        />
                        <i className="search-link ri-search-line" />
                      </div>
                    </form>
                  </div>
                </li>
                {!isUserLoggedIn && (
                  <div className="navbar-right ml-md-auto">
                    <ul className="d-flex align-items-center list-inline m-0">
                      <li className="nav-item d-none d-md-block">
                        <Button
                          variant="contained"
                          onClick={() => handleRoute(PageRoutes.SIGNUP)}>
                          Join The Green Channel
                        </Button>
                      </li>
                      <li className="nav-item ml-sm-auto">
                        <Button
                          variant="outlined"
                          onClick={() => handleRoute(PageRoutes.SIGNIN)}>
                          Sign In
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
                {isUserLoggedIn && (
                  <li>
                    <div className="iq-user-dropdown search-toggle d-flex align-items-center">
                      <img
                        width="40"
                        height="40"
                        src={
                          userDetails?.photo &&
                          userDetails?.photo !== 'data:image/unknown;base64,' &&
                          userDetails?.photo !==
                            'data:application/x-empty;base64,' &&
                          userDetails?.photo !== 'data:;base64,'
                            ? userDetails?.photo
                            : '/images/user.png'
                        }
                        className="img-fluid avatar-40 rounded-circle"
                        alt="user"
                      />
                    </div>
                    <div className="iq-sub-dropdown iq-user-dropdown profile-dropdown">
                      <div className="iq-card shadow-none m-0">
                        <div className="iq-card-body px-2">
                          <a className="iq-sub-card setting-dropdown">
                            <div className="d-flex align-items-center justify-content-center">
                              <div className="">
                                <img
                                  width="80px"
                                  src={
                                    userDetails?.photo &&
                                    userDetails?.photo !==
                                      'data:image/unknown;base64,' &&
                                    userDetails?.photo !==
                                      'data:application/x-empty;base64,' &&
                                    userDetails?.photo !== 'data:;base64,'
                                      ? userDetails?.photo
                                      : '/images/user.png'
                                  }
                                  alt="user"
                                />
                              </div>
                              <div className="ml-3 w-50">
                                <h6
                                  className="mb-0 text-wrap"
                                  style={{
                                    overflowWrap: 'break-word',
                                    fontSize: 12,
                                  }}>
                                  {userDetails?.username ||
                                    userDetails?.email.split('@')[0]}
                                </h6>
                              </div>
                            </div>
                          </a>
                          <Link href={PageRoutes.PROFILES}>
                            <a className="iq-sub-card setting-dropdown">
                              <div className="media align-items-center">
                                <div className="media-body ml-3">
                                  <h6 className="mb-0 ">Edit Profile</h6>
                                </div>
                              </div>
                            </a>
                          </Link>
                          <Link href={PageRoutes.ACCOUNT}>
                            <a className="iq-sub-card setting-dropdown">
                              <div className="media align-items-center">
                                <div className="media-body ml-3">
                                  <h6 className="mb-0 ">Account Details</h6>
                                </div>
                              </div>
                            </a>
                          </Link>
                          <Link href={PageRoutes.SIGNOUT}>
                            <a className="iq-sub-card setting-dropdown">
                              <div className="media align-items-center">
                                <div className="media-body ml-3">
                                  <h6 className="mb-0 ">Sign Out</h6>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="navbar-right menu-right" id="right-menu">
          <ul className="d-flex align-items-center  list-inline m-0">
            {showSearchField && (
              <li className="nav-item">
                <div>
                  <form className="searchbox" onSubmit={handleSearch}>
                    <input
                      type="text"
                      autoFocus
                      className="text search-input-large font-size-12"
                      placeholder="Search..."
                      defaultValue={query}
                      onBlur={toggleInput}
                      onChange={handleQueryChange}
                    />
                  </form>
                </div>
              </li>
            )}
            <li className="nav-item nav-icon">
              <div className="search-toggle device-search">
                <i className="ri-search-line" onClick={toggleInput}></i>
              </div>
            </li>
            {!isUserLoggedIn && (
              <div className="navbar-right ml-md-auto">
                <ul className="d-flex align-items-center list-inline m-0">
                  <li className="nav-item d-none d-md-block">
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleRoute(
                          `${PageRoutes.SELECTPLAN}?from=subscription`
                        )
                      }>
                      Join The Green Channel
                    </Button>
                  </li>
                  <li className="nav-item ml-sm-auto">
                    <Button
                      variant="outlined"
                      onClick={() => handleRoute(PageRoutes.SIGNIN)}>
                      Sign In
                    </Button>
                  </li>
                </ul>
              </div>
            )}
            {isUserLoggedIn && (
              <li className="nav-item nav-icon">
                <div
                  className="iq-user-dropdown search-toggle p-0 d-flex align-items-center"
                  data-toggle="search-toggle">
                  <img
                    src={
                      userDetails?.photo &&
                      userDetails?.photo !== 'data:image/unknown;base64,' &&
                      userDetails?.photo !==
                        'data:application/x-empty;base64,' &&
                      userDetails?.photo !== 'data:;base64,'
                        ? userDetails?.photo
                        : '/images/user.png'
                    }
                    width="40"
                    height="40"
                    className="img-fluid avatar-40 rounded-circle"
                    alt="user"
                  />
                </div>
                <div className="iq-sub-dropdown iq-user-dropdown profile-dropdown">
                  <div className="iq-card shadow-none m-0">
                    <div className="iq-card-body px-2">
                      <a className="iq-sub-card setting-dropdown">
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="">
                            <img
                              width="80px"
                              src={
                                userDetails?.photo &&
                                userDetails?.photo !==
                                  'data:image/unknown;base64,' &&
                                userDetails?.photo !==
                                  'data:application/x-empty;base64,' &&
                                userDetails?.photo !== 'data:;base64,'
                                  ? userDetails?.photo
                                  : '/images/user.png'
                              }
                              alt="user"
                            />
                          </div>
                          <div className="ml-3 w-50">
                            <h6
                              className="mb-0 text-wrap"
                              style={{
                                overflowWrap: 'break-word',
                              }}>
                              {userDetails?.username ||
                                userDetails?.email.split('@')[0]}
                            </h6>
                          </div>
                        </div>
                      </a>
                      <Link href={PageRoutes.PROFILES}>
                        <a className="iq-sub-card setting-dropdown">
                          <div className="media align-items-center">
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Edit Profile</h6>
                            </div>
                          </div>
                        </a>
                      </Link>
                      <Link href={PageRoutes.ACCOUNT}>
                        <a className="iq-sub-card setting-dropdown">
                          <div className="media align-items-center">
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Account Details</h6>
                            </div>
                          </div>
                        </a>
                      </Link>
                      <Link href={PageRoutes.SIGNOUT}>
                        <a className="iq-sub-card setting-dropdown">
                          <div className="media align-items-center">
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Sign Out</h6>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

UserMenu.propTypes = {
  userDetails: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UserMenu;
