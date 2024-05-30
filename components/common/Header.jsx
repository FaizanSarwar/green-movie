import PropTypes from 'prop-types';
import GuestMenu from './GuestMenu';
import UserMenu from './UserMenu';
import PageRoutes from '../../config/PageRoutes';
import { useRouter } from 'next/router';

const Header = ({ isLoggedIn, userDetails }) => {
  const router = useRouter();
  const renderHeader = () => {
    if (
      [PageRoutes.SAMPLECONTENT, PageRoutes.SELECTPLAN].includes(
        router.pathname
      )
    ) {
      return <GuestMenu />;
    } else if (router.query?.from === 'sample') {
      return <GuestMenu />;
    } else {
      return <UserMenu userDetails={userDetails} />;
    }
  };
  return (
    <header
      id="main-header"
      className={`app-header card-layout-bg no-smartapp-banner ${
        !isLoggedIn ? 'py-2' : ''
      }`}>
      <div className="main-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">{renderHeader()}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userDetails: PropTypes.objectOf(PropTypes.any).isRequired
};

export default Header;
