import { useEffect, useState } from 'react';
import { getTermsData } from '../services/tgcApi';
import parse from 'html-react-parser';
import Loader from '../components/common/Loader';
import Seo from '../components/common/Seo';

const TermsAndConditionsPage = ({ data }) => {
  const [isSearching, setIsSearching] = useState(true);
  const pageSeo = {
    title: 'Terms of Service | The Green Channel',
    description:
      "Please read The Green Channel's complete terms of service. If you have any concerns, email our team at webmaster@thegreenchannel.tv. Thanks!",
    keyword: ''
  };

  useEffect(() => {
    setIsSearching(false);
  }, []);
  return (
    <>
      <Seo seo={pageSeo} />
      <div className="black-overlay">
        <div className="container">
          <div className="row align-items-center justify-content-center py-5">
            <div className="col-sm-10 col-12">
              <h1 className="text-center text-uppercase py-3 font-weight-bold">
                Terms &amp; Conditions
              </h1>
              {data ? (
                <div className="privacy-content">
                  {' '}
                  {data ? parse(data) : ''}
                </div>
              ) : (
                <Loader isSearching={isSearching} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  let htmlData;
  try {
    const res = await getTermsData(req.headers.cookie);
    if (res.data.status) {
      htmlData = res.data.data;
    }
  } catch (e) {
    // handle error
  }

  return {
    props: {
      data: JSON.parse(JSON.stringify(htmlData))
    }
  };
};
export default TermsAndConditionsPage;
