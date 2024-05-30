import Link from 'next/link';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import Button from '../common/Button';

const GuestMenu = () => {
  const router = useRouter();
  const { asPath } = useRouter();
  const handleRoute = (routeTo) => router.push(routeTo);

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

  return (
    <nav className="navbar navbar-expand-lg justify-content-md-start justify-content-center navbar-light p-0 pt-2">
      <div id="" className="mr-auto mr-xs-0 mr-sm-0">
        <Link passHref href={PageRoutes.HOME}>
          <a className="navbar-brand" id="logo-link">
            <img
              className="img-fluid logo"
              src="/images/tgc-logo.png"
              alt="The Green Channel"
            />
          </a>
        </Link>
      </div>
      <div className="navbar-collapse collapse" id="navbarSupportedContent">
        <div className="menu-main-menu-container w-auto">
          <ul id="top-menu" className="navbar-nav">
            <li className="menu-item" data-page={PageRoutes.SAMPLECONTENT}>
              <Link passHref href={PageRoutes.SAMPLECONTENT}>
                <a
                  onClick={toggleMenu}
                  className={
                    asPath === PageRoutes.SAMPLECONTENT ||
                    [PageRoutes.SELECTPLAN].includes(router.pathname) ||
                    router.query?.from === 'sample'
                      ? 'active-page-link'
                      : ''
                  }>
                  <i className="ri-home-2-line menu-icons"></i>
                  VOD
                </a>
              </Link>
            </li>
            <li className="menu-item" data-page={PageRoutes.BROWSE}>
              <Link passHref href={PageRoutes.BROWSE}>
                <a
                  onClick={toggleMenu}
                  className={
                    asPath.startsWith(PageRoutes.BROWSE)
                      ? 'active-page-link'
                      : ''
                  }>
                  <i className="ri-grid-fill menu-icons"></i>
                  Explore
                </a>
              </Link>

              {asPath.startsWith(PageRoutes.BROWSE) && (
                <SubGenres
                  page={PageRoutes.BROWSE}
                  defaultPage={PageRoutes.BROWSE}
                />
              )}
            </li>
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
              <div className="navbar-right ml-md-auto">
                <ul className="d-flex align-items-center list-inline m-0">
                  <li className="nav-item d-none d-md-block">
                    <Button
                      variant="contained"
                      onClick={() => handleRoute(PageRoutes.SELECTPLAN)}>
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
            </ul>
          </div>
        </div>
      </div>
      <div className="navbar-right menu-right" id="right-menu">
        <ul className="d-flex align-items-center  list-inline m-0">
          <div className="navbar-right ml-md-auto">
            <ul className="d-flex align-items-center list-inline m-0">
              <li className="nav-item d-none d-md-block">
                <Button
                  variant="contained"
                  onClick={() =>
                    handleRoute(`${PageRoutes.SELECTPLAN}?from=subscription`)
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
        </ul>
      </div>
    </nav>
  );
};

export default GuestMenu;
