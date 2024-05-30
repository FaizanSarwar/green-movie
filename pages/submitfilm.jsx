import { useEffect, useState } from 'react';
import { getSubmitFilmData } from '../services/tgcApi';
import parse from 'html-react-parser';
import Loader from '../components/common/Loader';
import Seo from '../components/common/Seo';

const SubmitFilmPage = ({ data }) => {
  const [isSearching, setIsSearching] = useState(true);
  const pageSeo = {
    title: 'Submit a Short Film or Full Documentary | The Green Channel',
    description:
      "We are always looking for inspiring films and series to share with our subscribers. Submit a short film, documentary, or series and we'll be in touch soon!",
    keyword: 'submit a short film'
  };

  useEffect(() => {
    setIsSearching(false);
  }, [data]);

  return (
    <>
      <Seo seo={pageSeo} />
      <div className="black-overlay">
        <div className="container">
          <div className="row align-items-center justify-content-center py-5">
            <div className="col-sm-10 col-12">
              <h1 className="text-center text-uppercase py-3 font-weight-bold">
                Submit Your Film
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
    const res = await getSubmitFilmData(req.headers.cookie);
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

export default SubmitFilmPage;
