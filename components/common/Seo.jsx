import Head from 'next/head';
import PropTypes from 'prop-types';

const Seo = ({ seo }) => (
  <Head>
    <title>{seo.title}</title>
    <meta name="title" content={seo.title} />

    {seo.description && <meta name="description" content={seo.description} />}
    {seo.keyword && <meta name="keywords" content={seo.keyword} />}
    {seo.url && <link rel="url" href={seo.url} />}
  </Head>
);

Seo.propTypes = {
  seo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    keyword: PropTypes.string
  })
};

Seo.defaultProps = {
  seo: {
    title: 'The Green Channel',
    description: '',
    keyword: ''
  }
};

export default Seo;
