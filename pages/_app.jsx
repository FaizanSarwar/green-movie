import PropTypes from 'prop-types';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../public/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-notifications/lib/notifications.css';
import '../public/css/typography.css';
import '../public/css/style.css';
import '../public/css/responsive.css';
import '../styles/custom.css';
import '../styles/stripe.css';
import { DataProvider } from '../contexts/DataContext';

// Configure page loading transition
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({})
};
MyApp.defaultProps = {
  pageProps: {}
};

export default MyApp;
