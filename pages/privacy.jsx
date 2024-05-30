import { useEffect, useState } from 'react';
import { getPrivacyData } from '../services/tgcApi';
import parse from 'html-react-parser';
import Loader from '../components/common/Loader';
import Seo from '../components/common/Seo';

const PrivacyPage = ({ data }) => {
  const [isSearching, setIsSearching] = useState(true);
  const pageSeo = {
    title: 'Privacy Policy | The Green Channel',
    description:
      "Please read The Green Channel's complete privacy policy. If you have any concerns, email our team at webmaster@thegreenchannel.tv. Thanks!",
    keyword: ''
  };

  useEffect(() => {
    if (data) {
      setIsSearching(false);
      setTimeout(() => {
        try {
          window.jQuery(document).ready(function () {
            window.jQuery('.nav-tabs li a').click(function () {
              window
                .jQuery('.tab-content > .tab-pane')
                .removeClass('active')
                .addClass('hide')
                .removeClass('show');
              window
                .jQuery(window.jQuery(this).attr('href'))
                .removeClass('hide')
                .addClass('show')
                .addClass('active');
            });
            window.jQuery('ul li:first-child a').click();
            window.jQuery('.tab-content > div').addClass('mt-3');
          });
        } catch (error) {
          //skip error
        }
      }, 1000);
    }
  }, [data]);

  return (
    <>
      <Seo seo={pageSeo} />
      <div className="black-overlay">
        <div className="container">
          <div className="row align-items-center justify-content-center py-5">
            <div className="col-sm-10 col-12">
              <h1 className="text-center text-uppercase py-3 font-weight-bold">
                Privacy Policy
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
    const res = await getPrivacyData(req.headers.cookie);
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

export default PrivacyPage;
