import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import Button from '../common/Button';

const AuthPageHeader = () => {
  const router = useRouter();
  const handleRoute = (routeTo) => router.push(routeTo);

  return (
    <header
      id="main-header"
      className="app-header card-layout-bg no-smartapp-banner">
      <div className="main-header py-1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <nav className="navbar navbar-expand-lg navbar-light p-0 py-2">
                <div>
                  <Link href={PageRoutes.HOME}>
                    <a className="navbar-brand" id="logo-link">
                      <img
                        className="img-fluid logo"
                        src="/images/tgc-logo.png"
                        alt="The Green Channel"
                      />
                    </a>
                  </Link>
                </div>
                <div className="navbar-right ml-md-auto">
                  <ul className="d-flex align-items-center list-inline m-0">
                    {![PageRoutes.SELECTPLAN].includes(router.pathname) && (
                      <li className="nav-item d-none d-md-block">
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleRoute(
                              `${PageRoutes.SELECTPLAN}?from=subscription`
                            )
                          }>
                          {' '}
                          Join The Green Channel
                        </Button>
                      </li>
                    )}
                    {![PageRoutes.SIGNIN].includes(router.pathname) && (
                      <li className="nav-item ml-sm-auto">
                        <Button
                          variant="outlined"
                          onClick={() => handleRoute(PageRoutes.SIGNIN)}>
                          Sign In
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthPageHeader;
