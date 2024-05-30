import { useEffect, useState } from 'react';
import { getCareersData } from '../services/tgcApi';
import parse from 'html-react-parser';
import Loader from '../components/common/Loader';
import Seo from '../components/common/Seo';

const CareersPage = ({ data }) => {
  const [isSearching, setIsSearching] = useState(true);
  const pageSeo = {
    title: 'Documentary Film Jobs & Careers | The Green Channel',
    description:
      "We're hiring! Start your next documentary film job with our team in Canada dedicated to producing & showcasing educational & inspiring environmental content.",
    keyword: 'documentary film jobs'
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
                Careers
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
    const res = await getCareersData(req.headers.cookie);
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

export default CareersPage;
