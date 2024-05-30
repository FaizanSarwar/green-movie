/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getAboutData } from '../services/tgcApi';
import parse from 'html-react-parser';
import Loader from '../components/common/Loader';
import Seo from '../components/common/Seo';

const AboutPage = ({ data }) => {
  const [isSearching, setIsSearching] = useState(true);
  const pageSeo = {
    title: 'Learn About The Green Channel Documentary Streaming Service',
    description:
      'The Green Channel is an online documentary streaming service highlighting beautiful, untold stories of those coming together to better our planet. Watch now!',
    keyword: 'documentary streaming service'
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
            <div className="col-sm-10 col-12 about">
              <div className="text-center py-2 my-2">
                <img src="/images/tgc-logo.png" width="200px" alt="" />
              </div>
              <h1 className="text-center text-uppercase py-3 font-weight-bold">
                About the green channel
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
    const res = await getAboutData(req.headers.cookie);
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

export default AboutPage;
